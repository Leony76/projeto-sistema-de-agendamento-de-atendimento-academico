import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaFilter, FaHistory } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import '@frontend/css/calendar.css';
import { filterStudentAppointmentsHistory } from '@frontend/utils/filters/filterStudentAppointmentsHistory.util';
import NoContent from '@frontend/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP, STUDENT_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/studentAppointmentsHistory.map.filter';
import { FaClipboardQuestion } from 'react-icons/fa6';
import { filterProfessorAppointmentsHistory } from '@frontend/utils/filters/filterProfessorAppointmentsHistory.util';
import { LOGGED_USER_DATA } from '@frontend/constants/mocks/loggedUserData.mock';
import { PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP, PROFESSOR_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/professorAppointmentsHistory.map.filter';
import type { ProfessorAppointmentHistory, StudentAppointmentHistory } from '@shared/types/appointmentHistory.type';
import { PROFESSOR_APPOINTMENTS_HISTORY } from '@frontend/constants/mocks/dto/professor/history.mock';
import { STUDENT_APPOINTMENTS_HISTORY } from '@frontend/constants/mocks/dto/student/history.mock';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';

type FilterValue = {
  student   : typeof STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'];
  professor : typeof PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'];
}

const History = ():React.JSX.Element => {

  const role = LOGGED_USER_DATA.role === 'PROFESSOR' 
   ? 'PROFESSOR'
   : 'STUDENT'
  ;

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    professor : 'none',
    student   : 'none',
  });

  const [studentAppointmentHistory, setStudentAppointmentHistory] = useState<StudentAppointmentHistory[]>([]);
  const [professorAppointmentHistory, setProfessorAppointmentHistory] = useState<ProfessorAppointmentHistory[]>([]);

  const filteredAppointmentHistoryByRole = {
    STUDENT: filterStudentAppointmentsHistory(
      studentAppointmentHistory,
      searchValue,
      filterValue.student,
    ).map((rest) => ({ ...rest, from: 'STUDENT' as const })), 
    PROFESSOR: filterProfessorAppointmentsHistory(
      professorAppointmentHistory,
      searchValue,
      filterValue.professor,
    ).map((rest) => ({ ...rest, from: 'PROFESSOR' as const })),
  }

  const filterByRoleMap = {
    STUDENT: {
      schema : 'STUDENT_APPOINTMENTS_HISTORY_FILTER',
      value  : filterValue.student,
      setter : (value: FilterValue['student']) => setFilterValue(
        prev => ({ ...prev, student: value }),
      ),
    },
    PROFESSOR: {
      schema : 'PROFESSOR_APPOINTMENTS_HISTORY_FILTER',
      value  : filterValue.professor,
      setter : (value: FilterValue['professor']) => setFilterValue(
        prev => ({ ...prev, professor: value }),
      ),
    }
  } as const;

  const noHistoryFoundFilterByRoleMap = {
    STUDENT   : STUDENT_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP[filterValue.student],
    PROFESSOR : PROFESSOR_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP[filterValue.professor],
  } as const;

  const labelsByRoleMap = {
    STUDENT: {
      searchBarMessage : 'Pesquisar por professor, disciplina(s), data, horário ou motivo',
    },
    PROFESSOR: {
      searchBarMessage: 'Pesquisar por aluno, data, horário ou motivo',
    }
  } as const;

  const noContent = noContentFound(
    'Nenhum histórico de agendamentos no momento!',
    noHistoryFoundFilterByRoleMap[role],
    searchValue,
    filterValue && (
      filterValue.professor !== 'none' || 
      filterValue.student !== 'none'
    ),
    {
      notFound   : FaClipboardQuestion,
      notContent : FaClipboardQuestion
    },
  );

  useEffect(() => {
    (async() => {
      try {
        const [ response1, response2 ] = [
          STUDENT_APPOINTMENTS_HISTORY,
          PROFESSOR_APPOINTMENTS_HISTORY,
        ];

        setStudentAppointmentHistory(response1);
        setProfessorAppointmentHistory(response2);
      } catch (error:unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    })();
  },[]);

  return (
    <Layout 
    selectedTab='HISTORY'
    from={LOGGED_USER_DATA.role}
    >
      <div className={`grid gap-x-3 h-full min-h-0 grid-cols-1 mx-15`}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='flex items-center gap-1.5 self-center font-semibold text-lg text-cyan-500'>
              <FaHistory />
              Histórico de atendimentos
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
              {filteredAppointmentHistoryByRole[role].length > 0 ? (
                <div className='grid gap-2 auto-rows-min grid-cols-1 md:grid-cols-2'>
                  { filteredAppointmentHistoryByRole[role].map(( history ) => (
                    <Card.History
                      key={ history.id }
                      { ...history  }
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

export default History