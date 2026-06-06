import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { FaCalendarAlt, FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import Calendar from 'react-calendar';
import '@frontend/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { PROFESSOR_APPOINTMENTS_FILTER_MAP, PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/userAppointments.map.filter';
import NoContent from '@frontend/components/misc/NoContent';
import { filterProfessorAppointments } from '@frontend/utils/filters/filterUserAppointments.filter.util';
import HomeBrief from '@frontend/components/misc/HomeBrief';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import type { ProfessorAvailability } from '@shared/types/professorAvailability.type';
import type { ProfessorHomeBriefInfosResponse as ProfessorHomeBriefInfos } from '@shared/types/dtos/userHomeBriefInfos.dto';
import { Section } from '@frontend/components/section';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import { UserService } from '@frontend/services/user.service';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { ProfessorService } from '@frontend/services/professor.service';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import type { ProfessorAppointmentResponse as ProfessorAppointment } from '@shared/types/dtos/appointment.dto';
import { ScheduleService } from '@frontend/services/schedule.service';
import { Modal } from '@frontend/components/modal';

type ConfirmModals =
| 'CONFIRM_MARK_AS_DONE' 
| 'CONFIRM_MARK_AS_NO_SHOW' 
| 'CONFIRM_CANCEL'
;

type Modals = ConfirmModals;

const Professor = (): React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>

  const { toast } = useToast();

  const [modal, setModal] = useState<Modals | null>(null);
  

  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [refresh , setRefresh] = useState(0);
  const [filterValue, setFilterValue] = useState<typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  
  const [markAppointmentAsNoShowId, setMarkAppointmentAsNoShowId] = useState<number | null>(null);
  const [markAppointmentAsDoneId, setMarkAppointmentAsDoneId] = useState<number | null>(null);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<number | null>(null);
  

  const [ availability, setAvailability ] = useState<ProfessorAvailability[]>([]);
  
  const [ professorAppointments, setProfessorAppointments ] = useState<ProfessorAppointment[]>([]);
  const [ professorBriefInfos, setProfessorBriefInfos ] = useState<ProfessorHomeBriefInfos | null>(null);

  const BRIEF_RENDER = [
    { id: 1, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Agendas confirmados'  , value: professorBriefInfos?.appointmentsConfirmed ?? 0 },
    { id: 2, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: professorBriefInfos?.pendingSolicitations ?? 0 },
    { id: 3, icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próxima agenda'     , value: professorBriefInfos?.nextAppointmentDateTime ? formatDateTime(professorBriefInfos.nextAppointmentDateTime) : '--/--/--, --:--'},
  ];

  const filteredStudentAppointmentsData = filterProfessorAppointments(
    professorAppointments,
    searchValue,
    filterValue,
  );

  const noContent = noContentFound(
    'Nenhum agendamento no momento!',
    PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP],
    searchValue,
    filterValue && filterValue !== 'none',
    {
      notFound   : FaPersonCircleQuestion,
      notContent : FaClipboardQuestion
    },
  );

  const MODAL_CONFIRM_ACTION_CONFIG: Record<ConfirmModals, {
    message  : string,
    onAccept : () => void,
    onReject : () => void,
    visible  : boolean,
  }> = {
    CONFIRM_CANCEL: {
      message  : 'Tem certeza em cancelar esse agendamento confirmado?',
      visible  :  modal === 'CONFIRM_CANCEL',
      onAccept : () => {
        if (!cancelAppointmentId) return;
        handleCancelAppointment(cancelAppointmentId);
      },
      onReject : () => {
        setCancelAppointmentId(null);
        setModal(null);
      },
    },

    CONFIRM_MARK_AS_DONE: {
      message  : 'Tem certeza em marcar esse atendimento como concluído?',
      visible  :  modal === 'CONFIRM_MARK_AS_DONE',
      onAccept : () => {
        if (!markAppointmentAsDoneId) return;
        handleMarkAppointmentAsDone(markAppointmentAsDoneId);
      },
      onReject : () => {
        setMarkAppointmentAsDoneId(null);
        setModal(null);
      },
    },
    
    CONFIRM_MARK_AS_NO_SHOW: {
      message  : 'Tem certeza em marcar esse atendimento como não realizado por falta do aluno?',
      visible  :  modal === 'CONFIRM_MARK_AS_NO_SHOW',
      onAccept : () => {
        if (!markAppointmentAsNoShowId) return;
        handleMarkAppointmentAsNoShow(markAppointmentAsNoShowId);
      },
      onReject : () => {
        setModal(null);
      },
    }
  };


  const handleCancelAppointment = async(solicitationId: number): Promise<void> => {
    try {
      setLoading(false);

      const response = await ScheduleService.cancelAppointment(solicitationId);

      if (response.success) {
        toast(response.message);
        console.log(response.data);
        setModal(null); 

        setRefresh(prev => prev + 1);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAppointmentAsNoShow = async(appointmentId: number): Promise<void> => {
    try {
      setLoading(true);

      const response = await ScheduleService.markAppointmentAsNoShow(appointmentId);

      if (response.success) {
        toast(response.message);
        console.log(response.data);

        setProfessorAppointments(prev =>
          prev.filter((appointment) => appointment.id !== appointmentId)
        );

        setModal(null);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAppointmentAsDone = async(appointmentId: number): Promise<void> => {
    try {
      setLoading(true);

      const response = await ScheduleService.markAppointmentAsDone(appointmentId);

      if (response.success) {
        toast(response.message);
        console.log(response.data);

        setProfessorAppointments(prev =>
          prev.filter((appointment) => appointment.id !== appointmentId)
        );
        
        setModal(null);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    (async() => {
      try {
        const [ availability, appointments, professorBriefInfos ] = await Promise.all([
          ProfessorService.getAvailability(),
          ScheduleService.getUserAppointments<'PROFESSOR'>(),
          UserService.getUserHomeBriefInfos<'PROFESSOR'>(),
        ]); 
        
        setAvailability(availability);
        setProfessorBriefInfos(professorBriefInfos);
        setProfessorAppointments(appointments);
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();
  },[refresh]);

  return (
    <Layout 
    selectedTab='HOME'
    from='PROFESSOR'
    >
      { modal && 
        <Modal.ConfirmAction
          title='Confirmar ação'
          loading={loading}
          message={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].message}
          visible={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].visible}
          onAccept={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].onAccept}
          onCloseRequest={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].onReject}
        />
      }

      <div className='grid grid-cols-[1fr_300px] gap-x-3 h-full min-h-0'>
        <div className='grid gap-y-3 grid-rows-[60px_1fr] min-h-0'>
          <div className='flex gap-5 max-w-200 mx-auto w-full justify-center'>
            { BRIEF_RENDER.map((item) => (
              <HomeBrief
                key={item.id}
                Icon={() => item.icon}
                label={item.label}
                value={item.value ?? '?'}
                customStyle={{ value: `${item.id === 3 ? 'text-[15px] mt-[1px]' : ''}` }}
              />       
            ))}
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='flex items-center gap-1.5 self-center font-semibold text-lg text-cyan-500'>
              <FaCalendarAlt />
              Agenda
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por data, aluno, sala ou motivo'
                value={searchValue}
                customStyle={{ input: 'flex-1' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='PROFESSOR_APPOINTMENTS_FILTER'
                value={filterValue}
                onSelect={(value) => setFilterValue(value as typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'])}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredStudentAppointmentsData.length > 0 ? (
                filteredStudentAppointmentsData.map((appointment) => (
                  <Card.Appointment
                    key={appointment.id}
                    { ...appointment }
                    onClick={{
                      cancel: (appointmentId) => {
                        setModal('CONFIRM_CANCEL');
                        setCancelAppointmentId(appointmentId);
                      },
                      markAsDone   : (appointmentId) => {
                        setModal('CONFIRM_MARK_AS_DONE');
                        setMarkAppointmentAsDoneId(appointmentId);
                      },
                      markAsNoShow : (appointmentId) => {
                        setModal('CONFIRM_MARK_AS_NO_SHOW');
                        setMarkAppointmentAsNoShowId(appointmentId);
                      }
                    }}
                  />
                ))
              ) : (
                <NoContent
                  Icon={noContent.Icon}
                  message={noContent.message}
                />
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-rows-[300px_1fr] gap-y-3 min-h-0'>
          <div className='flex items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <Calendar
              onChange={(value) => setDateSelected(value as Date)}
              value={dateSelected}
              className="custom-calendar"
              prevLabel={<FaCircleChevronLeft/>}
              nextLabel={<FaCircleChevronRight/>}
              prev2Label={null}
              next2Label={null}
            />
          </div>

          <div className='relative flex self-start flex-col gap-1 border border-cyan-400 p-2 pt-1 rounded-lg bg-cyan-100/20 min-h-0'>
            <Section.EditProfessorAvailability
              availability={availability}
              refresh={() => setRefresh(prev => prev + 1) }
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Professor
