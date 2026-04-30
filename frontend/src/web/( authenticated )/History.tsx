import React, { useState } from 'react'
import Layout from './Layout'
import { FaFilter } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import '@/css/calendar.css';
import { filterStudentAppointmentsHistory } from '@/utils/filters/filterStudentAppointmentsHistory.util';
import NoContent from '@/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP, STUDENT_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentAppointmentsHistory.map.filter';
import { FaClipboardQuestion } from 'react-icons/fa6';
import { filterProfessorAppointmentsHistory } from '@/utils/filters/filterProfessorAppointmentsHistory.util';
import { LOGGED_USER_DATA } from '@/constants/mocks/loggedUserData.mock';
import { PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP, PROFESSOR_APPOINTMENTS_HISTORY_FILTER_VALUE_MAP } from '@/constants/maps/filters/professorAppointmentsHistory.map.filter';
import { PROFESSOR_APPOINTMENT_HISTORY_DATA } from '@/constants/mocks/users/professor/professorAppointmentsHistoryData.mock';
import { STUDENT_APPOINTMENT_HISTORY_DATA } from '@/constants/mocks/users/student/studentAppointmentsHistoryData.mock';

type FilterValue = {
  student   : typeof STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'];
  professor : typeof PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'];
}

const History = ():React.JSX.Element => {

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    professor : 'none',
    student   : 'none',
  });

  const filteredAppointmentHistoryByRole = {
    STUDENT: filterStudentAppointmentsHistory(
      STUDENT_APPOINTMENT_HISTORY_DATA,
      searchValue,
      filterValue.student,
    ), 
    PROFESSOR: filterProfessorAppointmentsHistory(
      PROFESSOR_APPOINTMENT_HISTORY_DATA,
      searchValue,
      filterValue.professor,
    ),
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
  
  const hasFilter = filterValue.student !== 'none' || filterValue.professor !== 'none';

  return (
    <Layout 
    selectedTab='HISTORY'
    from={LOGGED_USER_DATA.role}
    >
      <div className={`grid gap-x-3 h-full min-h-0 grid-cols-1 mx-15`}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Histórico
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por professor, disciplina, data, horário ou motivo'
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema={filterByRoleMap[LOGGED_USER_DATA.role].schema}
                value={filterByRoleMap[LOGGED_USER_DATA.role].value}
                onSelect={(value) => filterByRoleMap[LOGGED_USER_DATA.role].setter(value as any)}
              />
            </div>
              
            <div className='flex-1 min-h-0 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              {filteredAppointmentHistoryByRole[LOGGED_USER_DATA.role].length > 0 ? (
                <div className='grid gap-2 auto-rows-min grid-cols-1 md:grid-cols-2'>
                  { filteredAppointmentHistoryByRole[LOGGED_USER_DATA.role].map(( history ) => (
                    <Card.History
                      from={LOGGED_USER_DATA.role}
                      key={ history.id }
                      { ...history as any }
                    />
                  ))}
                </div>
              ) : (
                <NoContent
                  Icon={() => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && hasFilter
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${noHistoryFoundFilterByRoleMap[LOGGED_USER_DATA.role]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${noHistoryFoundFilterByRoleMap[LOGGED_USER_DATA.role]}"`
                      : `Nenhuma histórico no momento!`
                  }
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