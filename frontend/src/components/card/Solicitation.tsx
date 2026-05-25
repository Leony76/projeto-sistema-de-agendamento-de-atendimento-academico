import { formatDate } from '@frontend/utils/formats/formatDate.util';
import { formatTime } from '@frontend/utils/formats/formatTime.util';
import React, { useState, type JSX } from 'react'
import { BsFillCalendarXFill, BsThreeDotsVertical } from 'react-icons/bs';
import { FaCalendarCheck, FaCheck, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { IoCloseCircleSharp, IoCloseSharp } from 'react-icons/io5';
import { Button } from '../button';
import { MdEdit } from 'react-icons/md';
import { TbCancel } from 'react-icons/tb';
import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { AppointmentStatus } from '@backend/generated/prisma/enums';
import { APPOINTMENT_STATUS_MAP } from '@frontend/constants/maps/appointmentStatus.map';
import type { UserAppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import { Modal } from '../modal';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ScheduleService } from '@frontend/services/schedule.service';
import type { SolicitationDecision } from '@shared/types/solicitationDecision.type';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';

type Props = {
  smVersion? : boolean;
  refresh?   : () => void;
} & UserAppointmentSolicitationResponse;

const Solicitation = (props:Props): React.JSX.Element => {

  const { toast } = useToast();

  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmDecison, setConfirmDecision] = useState<boolean>(false);
  const [acceptOrDenyAppointmentDecision, setAcceptOrDenyAppointmentDecision] = useState<SolicitationDecision | null>(null);

  const statusTagStyle: Record<Exclude<AppointmentStatus, 'DONE' | 'NO_SHOW'>, { style: string, icon: JSX.Element }> = {
    ACCEPTED  : { style: 'bg-green-50 text-green-400'   , icon: <FaCheckCircle size={17}/>       },
    PENDING   : { style: 'bg-yellow-50 text-yellow-500' , icon: <FaRegClock size={17}/>          },
    REJECTED  : { style: 'bg-red-50 text-red-400'       , icon: <IoCloseCircleSharp size={20} /> },
    CANCELED  : { style: 'bg-red-50 text-red-400'       , icon: <BsFillCalendarXFill size={17}/> },
    CONFIRMED : { style: 'bg-green-50 text-green-400'   , icon: <FaCalendarCheck size={17} />    },
  };

  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
  const disciplines = props.from === 'STUDENT' 
    ? props.professor.disciplines.map(name => name) 
    : []
  ;

  const user = props.from === 'PROFESSOR'
    ? props.student
    : props.professor
  ;

  const handleAcceptOrDenyAppointmentRequest = async(decision: SolicitationDecision): Promise<void> => {
    try {
      setLoading(true);

      const response = await ScheduleService.acceptOrDenyAppointmentSolicitation(props.id, decision);

      if (response.success) {
        toast(response.message);
        console.log(response.data);

        props.refresh && props.refresh();
        setConfirmDecision(false);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal.ConfirmAction
        title='Confirmar ação'
        loading={loading}
        visible={confirmDecison}
        onAccept={() => handleAcceptOrDenyAppointmentRequest(acceptOrDenyAppointmentDecision as SolicitationDecision)}
        message={acceptOrDenyAppointmentDecision === 'ACCEPTED'
          ? 'Tem certeza em aceitar essa solicitação ?'
          : 'Tem certeza em rejeitar essa solicitação ?'
        }
        onCloseRequest={() => {
          setAcceptOrDenyAppointmentDecision(null);
          setConfirmDecision(false);
        }}
      />

      <div className={`relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50`}>
        { !props.smVersion && 
          <>
            <div 
            ref={containerRef}
            className={`absolute top-2 right-2 flex gap-1 flex-col`}>
              { props.from === 'STUDENT' &&
                <button 
                onClick={() => setMoreOptions(prev => !prev)}
                className='text-orange-400 self-end mt-px text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1'
                >
                  <BsThreeDotsVertical />
                </button>
              }

              { moreOptions &&
                <div className='flex flex-col rounded-b-xl rounded-tl-xl'>
                  <button className='bg-yellow-50 border border-yellow-500 text-yellow-600 flex items-center gap-1 rounded-tl-lg px-5 p-1 justify-center cursor-pointer text-sm hover:brightness-95 active:brightness-90'>
                    <MdEdit />
                    Editar
                  </button>

                  <button className={`
                    bg-red-50 border border-red-300 text-red-500 flex items-center gap-1 px-5 p-1 cursor-pointer text-sm hover:brightness-95 active:brightness-90
                    ${props.from === 'STUDENT' ? 'rounded-b-lg' : 'rounded-lg'}
                  `}>
                    <TbCancel className='scale-[1.2]'/>
                    Cancelar
                  </button>
                </div>
              }  
            </div>
            
            <ExpansibleImage
              image={{
                name : user.name,
                uri  : user.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
                size : 'h-26 w-26'
              }}
            />
          </>
        }

        <div className='flex flex-col flex-1 gap-1'>
          <h3 className='font-bold text-orange-400 break-all w-[90%]'>
            { user.name }
          </h3>
          
          <div className='flex flex-col text-xs'>
            { props.from === 'STUDENT' && 
              <label className='text-orange-400 font-semibold'>
                Disciplina(s): <span className='text-cyan-500 font-normal'> { formatter.format(disciplines) } </span>   
              </label>
            }

            <label className='text-orange-400 font-semibold'>
              Data: <span className='text-cyan-500 font-normal'>{ formatDate(props.dateTime) }</span>
            </label>

            <label className='text-orange-400 font-semibold'>
              Horário: <span className='text-cyan-500 font-normal'>{ formatTime(props.dateTime) }</span>
            </label>

            { props.from === 'PROFESSOR' &&
              <label className='text-orange-400 font-semibold'>
                Motivo: <span className='text-gray-400 font-normal'>{ props.reason }</span>
              </label>
            }

            <span className={`
              border mb-1 mt-2 text-sm py-1 font-semibold items-center gap-2 flex justify-center w-fit px-3 rounded-lg
              ${statusTagStyle[props.status as Exclude<AppointmentStatus, 'DONE' | 'NO_SHOW'>].style}
            `}>
              { statusTagStyle[props.status as Exclude<AppointmentStatus, 'DONE' | 'NO_SHOW'>].icon }

              <span className='mb-px'>
                { APPOINTMENT_STATUS_MAP[props.status] }
              </span>
            </span>
          </div>
        </div> 
        
        <div className='self-end space-y-1'>
          <div className='flex flex-col'>
            <span className='text-[10px] italic text-cyan-400'>
              Solicitado em
            </span>

            <span className='text-xs text-orange-400'>
              { formatDateTime(props.createdAt) }
            </span>
          </div> 
          
          { props.updatedAt !== props.createdAt &&
            <div className='flex flex-col'>
              <span className='text-[10px] italic text-cyan-400'>
                Atualizado em
              </span>

              <span className='text-xs text-orange-400'>
                { formatDateTime(props.updatedAt) }
              </span>
            </div> 
          }
        </div>

        { (props.status === 'PENDING' && props.from === 'PROFESSOR') &&
          <div className='flex gap-2 self-end'>
            <Button.Default
              label='Aceitar'
              Icon={() => <FaCheck />}
              onClick={() => {
                setAcceptOrDenyAppointmentDecision('ACCEPTED');
                setConfirmDecision(true);
              }}
              customStyle={{ button: '!w-fit py-1 text-sm mt-2 mb-1 bg-green-50 text-green-500 border-green-500'}}
              />

            <Button.Default
              label='Recusar'
              Icon={() => <IoCloseSharp className='scale-[1.5]'/>}
              onClick={() => {
                setAcceptOrDenyAppointmentDecision('REJECTED');
                setConfirmDecision(true);
              }}
              customStyle={{ button: '!w-fit py-1 text-sm mt-2 mb-1 bg-red-50 text-red-500 border-red-500'}}
            />
          </div>
        }
      </div>
    </>
  );
}

export default Solicitation