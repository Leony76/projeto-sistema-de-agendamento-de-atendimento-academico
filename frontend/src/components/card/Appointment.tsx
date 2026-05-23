import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { TbCancel } from 'react-icons/tb';
import { Button } from '../button';
import { FaCheck } from 'react-icons/fa';
import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { UserAppointmentResponse } from '@shared/types/dtos/appointment.dto';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { Modal } from '../modal';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ScheduleService } from '@frontend/services/schedule.service';

type Props = {
  smVersion? : boolean;
  onDone?    : (appointmentId: number) => void;
} & UserAppointmentResponse;

const Appointment = (props:Props): React.JSX.Element => {

  const { user } = useAuth();

  if (!user) return <Navigate to={'/'}/>

  const { toast } = useToast();

  const [modal, setModal] = useState<'MARK_AS_DONE_CONFIRM' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedReason, setExpandedReason] = useState<boolean>(false);
  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  const reason: string = (props.reason.length > 80 && !expandedReason) 
    ? props.reason.slice(0, 80) + '...'
    : props.reason
  ;

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
  const disciplines = props.from === 'STUDENT' 
    ? props.professor.disciplines.map(name => name) 
    : []
  ;

  const entity = props.from === 'PROFESSOR'
    ? props.student
    : props.professor
  ;

  const handleMarkAppointmentAsDone = async(appointmentId: number): Promise<void> => {
    try {
      setLoading(true);

      const response = await ScheduleService.markAppointmentAsDone(appointmentId);

      if (response.success) {
        toast(response.message);
        console.log(response.data);

        props.onDone && props.onDone(appointmentId);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (   
    <>
      <Modal.ConfirmAction
        title='Confirmar ação'
        message='Tem certeza em marcar esse atendimento como concluído?'
        loading={loading}
        onAccept={() => handleMarkAppointmentAsDone(props.id)}
        visible={modal === 'MARK_AS_DONE_CONFIRM'}
        onCloseRequest={() => {
          setLoading(false);
          setModal(null);
        }}
      />

      <div className='relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
        { !props.smVersion &&
          <>
            <div 
            ref={containerRef}
            className={`
              absolute top-2 right-2 flex gap-1
              ${ props.from === 'STUDENT' ? 'flex-row-reverse' : 'flex-col' }
            `}>
              <button 
              onClick={() => setMoreOptions(prev => !prev)}
              className={`
                text-orange-400 self-start text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1
                ${ props.from === 'STUDENT' ? 'self-start' : 'ml-auto' }
              `}
              >
                <BsThreeDotsVertical />
              </button>

              { moreOptions &&
                <div className='flex flex-col rounded-b-xl rounded-tl-xl'>
                  { props.from === 'STUDENT' && 
                    <button className='bg-yellow-50 border border-yellow-500 text-yellow-600 flex items-center gap-1 rounded-tl-lg px-5 p-1 justify-center cursor-pointer text-sm hover:brightness-95 active:brightness-90'>
                      <MdEdit />
                      Editar
                    </button>
                  }

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
                name : entity.name,
                uri  : entity.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
                size: props.from === 'STUDENT' ? 'h-25 w-25' : 'h-30 w-30'
              }}
            />       
          </>
        }
        
        <div className='flex flex-col gap-1 flex-1'>
          <h3 className='font-bold text-orange-400'>
            { formatDateTime(props.dateTime) }
          </h3>

          <div className={`
            flex flex-col
            ${ props.from === 'PROFESSOR' ? 'text-xs' : 'text-[13px]' }
          `}>
            <label className='text-orange-400 font-semibold'>
              { props.from === 'PROFESSOR' ? 'Aluno:' : 'Professor:'} <span className='text-cyan-500 font-normal'>
                { entity.name }
              </span>
            </label>

            { props.from === 'STUDENT' && 
              <label className='text-orange-400 font-semibold'>
                Disciplina(s): <span className='text-cyan-500 font-normal'> { formatter.format(disciplines) } </span>   
              </label>
            }

            <label className='text-orange-400 font-semibold'>
              Sala: <span className='text-cyan-500 font-normal'>{ props.room }</span>
            </label>

            <label className='text-orange-400 font-semibold'>
              Motivo: <span className='text-gray-400 font-normal'>{ reason } { props.reason.length > 80 && 
                <button 
                onClick={() => setExpandedReason(prev => !prev)}
                className='text-gray-400 w-fit font-semibold italic hover:underline cursor-pointer'
                > 
                  { expandedReason ? 'Ler menos' : 'Ler mais' }
                </button> 
              }</span>
            </label>
          </div>

          { user.role === 'PROFESSOR' &&
            <Button.Default
              label='Marcar como concluído'
              Icon={() => <FaCheck />}
              onClick={() => setModal('MARK_AS_DONE_CONFIRM')}
              customStyle={{ button: '!w-fit py-1 text-sm mt-2 mb-1 bg-green-100 text-green-500 border-green-500'}}
            />
          }
        </div>
      </div>
    </>
  )
}

export default Appointment