import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaCalendarAlt, FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import Calendar from 'react-calendar';
import '@frontend/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import { filterStudentAppointments } from '@frontend/utils/filters/filterUserAppointments.filter.util';
import NoContent from '@frontend/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_FILTER_MAP, STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/userAppointments.map.filter'; 
import HomeBrief from '@frontend/components/misc/HomeBrief';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import type { Appointment } from '@shared/types/appointment.type';
import type { Professor } from '@shared/types/userBasicInfos.type';
import type { StudentHomeBriefInfosResponse as StudentHomeBriefInfos } from '@shared/types/dtos/userHomeBriefInfos.dto';
import { UserService } from '@frontend/services/user.service';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import type { StudentAppointmentResponse as StudentAppointment } from '@shared/types/dtos/appointment.dto';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ScheduleService } from '@frontend/services/schedule.service';
import { Section } from '@frontend/components/section';
import { type EditAppointmentSolicitationFormData as EditAppointmentFormData } from '@shared/schemas/appointmentSolicitation.schema';

import { Modal } from '@frontend/components/modal';
import { formatTime } from '@frontend/utils/formats/formatTime.util';
import { formatMergeDateWithTime } from '@frontend/utils/formats/formatMergeDateWithTime.util';
import type { EditAppointmentSolicitationResponse as EditAppointmentResponse } from '@shared/types/dtos/appointmentSolicitation.dto';

type ConfirmModals =
| 'CONFIRM_EDIT' 
| 'CONFIRM_CANCEL'
;

type Modals = ConfirmModals | 'EDIT';

const Student = (): React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>

  const { toast } = useToast();

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<Modals | null>(null);
  
  const [refresh, setRefresh] = useState(0);
  
  const [studentAppointments, setStudentAppointments] = useState<StudentAppointment[]>([]);

  const [cancelAppointmentId, setCancelAppointmentId] = useState<number | null>(null);
  const [editStudentAppointment, setEditStudentAppointment] = useState<StudentAppointment | null>(null);
  const [editedStudentAppointmentData, setEditedStudentAppointmentData] = useState<EditAppointmentFormData | null>(null);

  const [briefInfos, setBriefInfos] = useState<StudentHomeBriefInfos | null>(null);
  const [lastAppointment, setLastAppointment] = useState<Appointment<Pick<Professor, 'name'>> | null>(null);

  const filteredStudentAppointmentsData = filterStudentAppointments(
    studentAppointments,
    searchValue,
    filterValue,
  );

  const BRIEF_RENDER = [
    { id: 1, icon: <GrSchedule className='text-cyan-500' size={28}/>             , label: 'Agendamentos feitos'      , value: briefInfos?.appointmentsMade ?? 0     },
    { id: 2, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: briefInfos?.pendingSolicitations ?? 0 },
    { id: 3, icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próximo agendamento'     , value: briefInfos?.nextAppointmentDateTime ? formatDateTime(briefInfos?.nextAppointmentDateTime) : '--/--/--, --:--'},
  ];

  const noContent = noContentFound(
    'Nenhum agendamento no momento!',
    STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_APPOINTMENTS_FILTER_VALUE_MAP],
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

    CONFIRM_EDIT: {
      message  : 'Tem certeza em fazer essa edição nesse agendamento confirmado?',
      visible  :  modal === 'CONFIRM_EDIT',
      onAccept : () => {
        if (!editedStudentAppointmentData) return;
        handleEditAppointment(editedStudentAppointmentData);
      },
      onReject : () => {
        setEditedStudentAppointmentData(null);
        setModal('EDIT');
      },
    },
  };

  const handleEditAppointment = async(data: EditAppointmentFormData): Promise<void> => {
    try {
      setLoading(true);

      const dateTime = formatMergeDateWithTime(data.appointmentDate, data.hour);

      const payload: EditAppointmentResponse = {
        appointmentId : data.appointmentId,
        reason        : data.reason,
        dateTime,
      };

      const response = await ScheduleService.editAppointment(payload);

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

  useEffect(() => {
    (async(): Promise<void> => {
      try {
        const [ studentBriefInfos, appointments, lastAppointment ] = await Promise.all([
          UserService.getUserHomeBriefInfos<'STUDENT'>(),
          ScheduleService.getUserAppointments<'STUDENT'>(),
          UserService.getStudentLastAppointment(),
        ]);

        setBriefInfos(studentBriefInfos);
        setStudentAppointments(appointments);
        setLastAppointment(lastAppointment);
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();
  }, [refresh]);

  return (
    <Layout 
    selectedTab='HOME'
    from='STUDENT'
    >
      { modal && modal !== 'EDIT' &&
        <Modal.ConfirmAction
          title='Confirmar ação'
          loading={loading}
          message={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].message}
          visible={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].visible}
          onAccept={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].onAccept}
          onCloseRequest={MODAL_CONFIRM_ACTION_CONFIG[modal as ConfirmModals].onReject}
        />
      }

      { editStudentAppointment &&  
        <Modal.EditAppointment
          title="Editar agendamento"
          visible={modal === 'EDIT'}
          initialData={{
            appointmentId   : editStudentAppointment.id,
            appointmentDate : editStudentAppointment.dateTime,
            reason          : editStudentAppointment.reason,
            hour            : formatTime(editStudentAppointment.dateTime),
          }}
          professor={{
            id            : editStudentAppointment.professor.id,
            availableDays : editStudentAppointment.professor.availableDays,
          }}
          onRequestClose={() => {
            setEditStudentAppointment(null);
            setModal(null);
          }}
          onEdit={(data) => {
            setEditedStudentAppointmentData({...data, appointmentId: editStudentAppointment.id });
            setModal('CONFIRM_EDIT');
          }}
        />
      }

      <div className='grid grid-cols-[1fr_300px] gap-x-3 h-full min-h-0'>
        <div className='grid gap-y-3 grid-rows-[60px_1fr] min-h-0'>
          <div className='flex gap-5 max-w-200 mx-auto w-full'>
            { BRIEF_RENDER.map((item) => (
              item.id === 3 ? (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value!}
                  customStyle={{ value: 'text-[15px] mt-[1px]' }}
                />     
              ) : (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value!}
                />     
              )     
            ))}
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='flex items-center gap-1.5 self-center font-semibold text-lg text-cyan-500'>
              <FaCalendarAlt />
              Agendamentos
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por data, professor, sala ou motivo'
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='STUDENT_APPOINTMENTS_FILTER'
                value={filterValue}
                onSelect={(value) => setFilterValue(value as typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value'])}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredStudentAppointmentsData.length > 0 ? (
                filteredStudentAppointmentsData.map((appointment) => (
                  <Card.Appointment
                  key={appointment.id}
                  { ...appointment }
                  onClick={{
                    edit : (appointment) => {
                      setEditStudentAppointment(appointment);
                      setModal('EDIT');
                    }, 
                    cancel : (appointmentId) => {
                      setCancelAppointmentId(appointmentId);
                      setModal('CONFIRM_CANCEL');
                    },
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

        <div className='grid grid-rows-[300px_140px] gap-y-3 min-h-0'>
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

          <Section.StudentLastAppointment 
            lastAppointment={lastAppointment}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Student;