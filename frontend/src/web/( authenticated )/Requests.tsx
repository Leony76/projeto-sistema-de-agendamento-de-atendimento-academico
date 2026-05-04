import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaFilter } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import '@frontend/css/calendar.css';
import { filterStudentSolicitations } from '@frontend/utils/filters/filterStudentSolicitations.util';
import NoContent from '@frontend/components/misc/NoContent';
import { STUDENT_SOLICITATIONS_FILTER_MAP, STUDENT_SOLICITATIONS_FILTER_VALUE_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/studentSolicitations.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { filterStudentSolicitationsFromProfessorView } from '@frontend/utils/filters/filterStudentSolicitationsFromProfessorView.util';
import { LOGGED_USER_DATA } from '@frontend/constants/mocks/loggedUserData.mock';
import type { StudentSolicitation, StudentSolicitationFromProfessorView } from '@shared/types/solicitation.type';
import { STUDENT_SOLICITATIONS } from '@frontend/constants/mocks/dto/student/solicitations.mock';
import { STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW } from '@frontend/constants/mocks/dto/professor/solicitations.mock';

type FilterValue = {
  student   : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'];
  professor : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'];
}

const Requests = ():React.JSX.Element => {

  const role = LOGGED_USER_DATA.role === 'PROFESSOR'
    ? 'PROFESSOR'
    : 'STUDENT'
  ;

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    professor : 'none',
    student   : 'none',
  });

  const [studentSolicitations, setStudentSolicitations] = useState<StudentSolicitation[]>([]);
  const [studentSolicitationsFromPRofessorView, setStudentSolicitationsFromProfessorView] = useState<StudentSolicitationFromProfessorView[]>([]);


  const filteredSolicitationsByRole = {
    STUDENT: filterStudentSolicitations(
      studentSolicitations,
      searchValue,
      filterValue.student
    ).map(rest => ({ ...rest, from: 'STUDENT' as const })), 

    PROFESSOR: filterStudentSolicitationsFromProfessorView(
      studentSolicitationsFromPRofessorView,
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
  
  const noContentFound = () => {

    const filterLabel = noHistoryFoundFilterByRoleMap[role];
    const hasSearch = !!searchValue;
    const hasFilter = filterValue && (
      filterValue.professor !== 'none' || 
      filterValue.student !== 'none'
    );
  
    const NoContentIcon = (hasSearch || hasFilter)
      ? <FaPersonCircleQuestion size={24}/>
      : <FaClipboardQuestion size={24}/>
    ;

    let message = 'Nenhuma solicitação no momento!';

    if (hasSearch && hasFilter) {
      message = `Nenhum resultado para "${searchValue}" com o filtro "${filterLabel}"`;
    } else if (hasSearch) {
      message = `Nenhum resultado para "${searchValue}"`;
    } else if (hasFilter) {
      message = filterLabel === 'Nenhum'
        ? 'Nenhuma solicitação no momento!'
        : `Nenhum resultado para o filtro "${filterLabel}"`;
    }

    return {
      message,
      Icon: NoContentIcon,
    }
  };

  useEffect(() => {
    (async() => {
      try {
        const [reponse1, response2] = [
          STUDENT_SOLICITATIONS,
          STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW,
        ];

        setStudentSolicitations(reponse1);
        setStudentSolicitationsFromProfessorView(response2);
      } catch (error:unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    })();
  }, []);

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
                optionsSchema={filterByRoleMap[role].schema}
                value={filterByRoleMap[role].value}
                onSelect={(value) => filterByRoleMap[role].setter(value as any)}
              />
            </div>

            <div className='flex-1 min-h-0 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              {filteredSolicitationsByRole[role].length > 0 ? (
                <div className={`
                  grid items-start gap-2 auto-rows-min 
                  ${ LOGGED_USER_DATA.role === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1' }
                `}>
                    {filteredSolicitationsByRole[role].map(( solicitation ) => (
                      <Card.Solicitation
                        key={solicitation.id}
                        { ...solicitation  }
                      />
                    ))}                
                </div>
              ) : (
                <NoContent
                  Icon={() => noContentFound().Icon}
                  message={noContentFound().message}
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