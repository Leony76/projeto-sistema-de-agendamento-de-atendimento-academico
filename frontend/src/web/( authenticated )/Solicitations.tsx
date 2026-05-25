import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaExclamation, FaFilter } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import '@frontend/css/calendar.css';
import { filterStudentSolicitations, filterStudentSolicitationsFromProfessorView } from '@frontend/utils/filters/filterUserSolicitations.filter.util';
import NoContent from '@frontend/components/misc/NoContent';
import { STUDENT_SOLICITATIONS_FILTER_MAP, STUDENT_SOLICITATIONS_FILTER_VALUE_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/userSolicitations.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ScheduleService } from '@frontend/services/schedule.service';
import type { ProfessorAppointmentSolicitationResponse as ProfessorAppointmentSolicitation, StudentAppointmentSolicitationResponse as StudentAppointmentSolicitation } from '@shared/types/dtos/appointmentSolicitation.dto';

type FilterValue = {
  student   : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'];
  professor : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'];
}

const Requests = ():React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>;

  const { toast } = useToast();

  const role = user.role === 'PROFESSOR'
    ? 'PROFESSOR'
    : 'STUDENT'
  ;

  const [refresh, setRefresh] = useState(0);

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    professor : 'none',
    student   : 'none',
  });

  const [pendingAppointments, setPendingAppointments] = useState<{
    fromStudent   : StudentAppointmentSolicitation[],
    fromProfessor : ProfessorAppointmentSolicitation[],
  }>({
    fromProfessor : [],
    fromStudent   : [],
  });

  const filteredSolicitationsByRole = {
    STUDENT: filterStudentSolicitations(
      pendingAppointments.fromStudent,
      searchValue,
      filterValue.student
    ).map(rest => ({ ...rest, from: 'STUDENT' as const })), 

    PROFESSOR: filterStudentSolicitationsFromProfessorView(
      pendingAppointments.fromProfessor,
      searchValue,
      filterValue.professor
    ).map(rest => ({ ...rest, from: 'PROFESSOR' as const })), 
  };

  const filterByRoleMap = {
    STUDENT: {
      schema : 'STUDENT_SOLICITATIONS_FILTER',
      value  : filterValue.student,
      setter : (value: FilterValue['student']) => setFilterValue(
        prev => ({ ...prev, student: value }),
      ),
    },
    PROFESSOR: {
      schema : 'STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER',
      value  : filterValue.professor,
      setter : (value: FilterValue['professor']) => setFilterValue(
        prev => ({ ...prev, professor: value }),
      ),
    }
  } as const;

  const noHistoryFoundFilterByRoleMap = {
    STUDENT   : STUDENT_SOLICITATIONS_FILTER_VALUE_MAP[filterValue.student],
    PROFESSOR : STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP[filterValue.professor],
  } as const;

  const labelsByRoleMap = {
    STUDENT: {
      mainTitle        : 'Minhas solicitações',
      searchBarMessage : 'Pesquisar por professor, disciplina(s), data, horário, motivo ou status da solicitação',
    },
    PROFESSOR: {
      mainTitle: 'Solicitações dos alunos',
      searchBarMessage: 'Pesquisar por aluno, data, horário, motivo ou status da solicitação',
    }
  } as const;
  
  const noContent = noContentFound(
    'Nenhuma solicitação no momento!',
    noHistoryFoundFilterByRoleMap[role],
    searchValue,
    filterValue && (
      filterValue.professor !== 'none' || 
      filterValue.student !== 'none'
    ),
    {
      notFound   : FaPersonCircleQuestion,
      notContent : FaClipboardQuestion
    },
  );

  useEffect(() => {
    (async() => {
      try {
        switch (role) {
          case 'STUDENT':
            const studentSolicitations = await ScheduleService.getUserAppointmentSolicitations('STUDENT', user.id);
            setPendingAppointments(prev => ({ ...prev, fromStudent: studentSolicitations }))
            break;
          default:
            const professorSolicitations = await ScheduleService.getUserAppointmentSolicitations('PROFESSOR', user.id);
            setPendingAppointments(prev => ({ ...prev, fromProfessor: professorSolicitations }))
            break;
        }      
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();
  }, [refresh]);

  return (
    <Layout 
    selectedTab='REQUESTS'
    from={user.role}
    >
      <div className={`grid gap-x-3 h-full min-h-0 grid-cols-1 mx-15`}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='flex items-center gap-1 self-center font-semibold text-lg text-cyan-500'>
              <FaExclamation />
              { labelsByRoleMap[role].mainTitle }
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder={labelsByRoleMap[role].searchBarMessage}
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema={filterByRoleMap[role].schema}
                value={filterByRoleMap[role].value}
                onSelect={(value) => filterByRoleMap[role].setter(value as any)}
              />
            </div>

            <div className='flex-1 min-h-0 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              {filteredSolicitationsByRole[role].length > 0 ? (
                <div className={`
                  grid items-start gap-2 auto-rows-min 
                  ${ user.role === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1' }
                `}>
                    {filteredSolicitationsByRole[role].map(( solicitation ) => (
                      <Card.Solicitation
                        refresh={() => setRefresh(prev => prev + 1)}
                        key={solicitation.id}
                        { ...solicitation  }            
                      />
                    ))}                
                </div>
              ) : (
                <NoContent
                  Icon={noContent.Icon}
                  message={noContent.message}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Requests