import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { FaCalendarAlt, FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill, RiShieldCheckFill } from 'react-icons/ri';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import Calendar from 'react-calendar';
import '@frontend/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { PROFESSOR_APPOINTMENTS_FILTER_MAP, PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/professorAppointments.map.filter';
import NoContent from '@frontend/components/misc/NoContent';
import { filterProfessorAppointments } from '@frontend/utils/filters/filterProfessorAppointments.util';
import HomeBrief from '@frontend/components/misc/HomeBrief';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import type { ProfessorAvailability } from '@shared/types/professorAvailability.type';
import type { ProfessorHomeBriefInfosResponse as ProfessorHomeBriefInfos } from '@shared/types/dtos/userHomeBriefInfos.dto';
import { Section } from '@frontend/components/section';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import type { Appointment } from '@shared/types/appointment.type';
import type { Student } from '@shared/types/userBasicInfos.type';
import { UserService } from '@frontend/services/user.service';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { ProfessorService } from '@frontend/services/professor.service';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { Modal } from '@frontend/components/modal';
import { useForm } from 'react-hook-form';
import { newPasswordSchema, type NewPasswordFormData } from '@shared/schemas/newPassword.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@frontend/components/button';

const Professor = (): React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>

  const { toast } = useToast();

  const [searchValue, setSearchValue] = useState<string>('');
  const [refresh , setRefresh] = useState({ availability: 0 });
  const [filterValue, setFilterValue] = useState<typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  
  const [ availability, setAvailability ] = useState<ProfessorAvailability[]>([]);
  
  const [ professorAppointments, setProfessorAppointments ] = useState<Appointment<Pick<Student, 'name' | 'photo'>>[]>([]);
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

  useEffect(() => {
    (async(id: number) => {
      try {
        const [ professorBriefInfos, availability ] = await Promise.all([
          UserService.getProfessorHomeBriefInfos(id),
          ProfessorService.getAvailability(id),
        ]);

        setProfessorBriefInfos(professorBriefInfos);
        setAvailability(availability)
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })(user.id);
  },[]);

  useEffect(() => {
    (async(id: number) => {
      try {
        const availability = await ProfessorService.getAvailability(id);

        setAvailability(availability)
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })(user.id);
  },[refresh.availability]);

  return (
    <Layout 
    selectedTab='HOME'
    from='PROFESSOR'
    >
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
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='PROFESSOR_APPOINTMENT_FILTER'
                value={filterValue}
                onSelect={(value) => setFilterValue(value as typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'])}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredStudentAppointmentsData.length > 0 ? (
                filteredStudentAppointmentsData.map((appointment) => (
                  <Card.Appointment
                    from='PROFESSOR'
                    key={appointment.id}
                    { ...appointment }
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
              refresh={() => setRefresh(prev => ({ ...prev, availability: prev.availability + 1 })) }
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Professor