import React, { useState } from 'react'
import Layout from './Layout'
import { FaFilter } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import '@/css/calendar.css';
import type { StudentSolicitation, StudentSolicitationFromProfessorView } from '@/types/solicitation.type';
import { filterStudentSolicitations } from '@/utils/filters/filterStudentSolicitations.util';
import NoContent from '@/components/misc/NoContent';
import { STUDENT_SOLICITATIONS_FILTER_MAP, STUDENT_SOLICITATIONS_FILTER_VALUE_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentSolicitations.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { filterStudentSolicitationsFromProfessorView } from '@/utils/filters/filterStudentSolicitationsFromProfessorView.util';
import { LOGGED_USER_DATA } from './home/Student';

const STUDENT_SOLICITATIONS_DATA: StudentSolicitation[] = [
  {
    id: 1,
    name: 'Cloud Strife',
    photo: 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop',
    discipline: 'ENGLISH',
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    status: 'UNCONFIRMED',
  },
  {
    id: 2,
    name: 'Madara Uchiha',
    discipline: 'GEOGRAPHY',
    photo: 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CONFIRMED',
  },
  {
    id: 3,
    name: 'Sasuke Uchiha',
    discipline: 'CHEMISTRY',
    photo: 'https://pop.proddigital.com.br/wp-content/uploads/sites/8/2024/04/01-32.jpg',
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CANCELED',
  },
];

const STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_DATA: StudentSolicitationFromProfessorView[] = [
  {
    id: 1,
    name: 'Mad Max',
    photo: 'https://i0.wp.com/cinegrandiose.com/wp-content/uploads/2016/02/MadM-8.png?fit=960%2C540&ssl=1',
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    reason: 'Lorem Ipsum Dolor Iurem Eclestas',
    status: 'UNCONFIRMED',
  },
  {
    id: 2,
    name: 'Maria Bonita Mendonça de Oliveira Lima',
    photo: 'https://pbs.twimg.com/media/HGF5_JeX0AArbDa?format=jpg&name=large',
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    reason: 'Lorem Ipsum Dolor Iure Eclestas Joramentia caestus',
    status: 'CONFIRMED',
  },
];

type FilterValue = {
  student   : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'];
  professor : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'];
}

const Requests = ():React.JSX.Element => {

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    professor : 'none',
    student   : 'none',
  });

  const filteredSolicitationsByRole = {
    STUDENT: filterStudentSolicitations(
      STUDENT_SOLICITATIONS_DATA,
      searchValue,
      filterValue.student,
    ),
    PROFESSOR: filterStudentSolicitationsFromProfessorView(
      STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_DATA,
      searchValue,
      filterValue.professor,
    ),
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

  const hasFilter = filterValue.student !== 'none' || filterValue.professor !== 'none';

  return (
    <Layout 
    selectedTab='REQUESTS'
    from={LOGGED_USER_DATA.role}
    >
      <div className={`grid gap-x-3 h-full min-h-0 grid-cols-1 mx-15`}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Solicitações
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por professor, disciplina, data, horário ou status da solicitação'
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
              {filteredSolicitationsByRole[LOGGED_USER_DATA.role].length > 0 ? (
                <div className={`
                  grid items-start gap-2 auto-rows-min 
                  ${ LOGGED_USER_DATA.role === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1' }
                `}>
                  {LOGGED_USER_DATA.role === 'STUDENT' ? (
                    filteredSolicitationsByRole[LOGGED_USER_DATA.role].map(( solicitation ) => (
                      <Card.Solicitation
                        from={'STUDENT'}
                        key={solicitation.id}
                        { ...solicitation }
                      />
                    ))             
                  ) : (
                    filteredSolicitationsByRole[LOGGED_USER_DATA.role].map(( solicitation ) => (
                      <Card.Solicitation
                        from={'PROFESSOR'}
                        key={solicitation.id}
                        { ...solicitation }
                      />
                    ))
                  )}
                </div>
              ) : (
                <NoContent
                  Icon={(searchValue || filterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && hasFilter
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${noHistoryFoundFilterByRoleMap[LOGGED_USER_DATA.role]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${noHistoryFoundFilterByRoleMap[LOGGED_USER_DATA.role]}"`
                      : `Nenhuma solicitação no momento!`
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

export default Requests