import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaChalkboardTeacher, FaClipboardList, FaFilter, FaRegClock, FaUsers } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import Calendar from 'react-calendar';
import '@frontend/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import NoContent from '@frontend/components/misc/NoContent';
import type { UserRole } from '@shared/types/userRole.type';
import { PiStudentBold } from 'react-icons/pi';
import { USERS_LIST_BY_ROLE_FILTER_REVERSE_TYPE_VALUE_MAP, USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP } from '@frontend/constants/maps/filters/usersListByRole.map.filter';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { filterRegisteredStudents } from '@frontend/utils/filters/filterRegisteredStudents.util';
import { REGISTERED_MANAGERS_FILTER_VALUE_MAP, REGISTERED_PROFESSORS_FILTER_VALUE_MAP, REGISTERED_STUDENTS_FILTER_VALUE_MAP, type REGISTERED_MANAGERS_FILTER_MAP, type REGISTERED_PROFESSORS_FILTER_MAP, type REGISTERED_STUDENTS_FILTER_MAP } from '@frontend/constants/maps/filters/registeredUsers.map.filter';
import { filterRegisteredProfessors } from '@frontend/utils/filters/filterRegisteredProfessors.util';
import { filterRegisteredManagers } from '@frontend/utils/filters/filterRegisteredManagers.util';
import { USER_ROLES } from '@frontend/constants/maps/userRoles.map';
import { Form } from '@frontend/components/form';
import { Section } from '@frontend/components/section';
import type { Reports } from '@shared/types/reports.type';
import type { ManagerGeneralActions } from '@shared/types/managerGeneralActions.type';
import HomeBrief from '@frontend/components/misc/HomeBrief';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import { SYSTEM_GENERAL_METRICS } from '@frontend/constants/mocks/dto/manager/systemGeneralMetrics.mock';
import type { SystemGeneralMetrics } from '@shared/types/systemGeneralMetrics.type';
import type { RegisteredManager, RegisteredProfessor, RegisteredStudent } from '@shared/types/registeredUsers.type';
import { REGISTERED_PROFESSORS } from '@frontend/constants/mocks/dto/manager/registeredProfessor.mock';
import { REGISTERED_STUDENTS } from '@frontend/constants/mocks/dto/manager/registeredStudents.mock';
import { REGISTERED_MANAGERS } from '@frontend/constants/mocks/dto/manager/registeredManagers.mock';
import { ROOMS_DETAILS } from '@frontend/constants/mocks/dto/manager/rooms.mock';
import type { Room } from '@shared/types/room.type';
import { SYSTEM_REPORTS } from '@frontend/constants/mocks/dto/manager/systemReports.mock';

type FilterValue = {
  student   : typeof REGISTERED_STUDENTS_FILTER_MAP[number]['value'];
  professor : typeof REGISTERED_PROFESSORS_FILTER_MAP[number]['value'];
  manager   : typeof REGISTERED_MANAGERS_FILTER_MAP[number]['value'];
};

const Manager = (): React.JSX.Element => {
    
  const navigate = useNavigate();
  const location = useLocation();

  
  const [searchValue, setSearchValue] = useState<string>('');
  
  const [filterValue, setFilterValue] = useState<FilterValue>({
    student   : 'none',
    professor : 'none',
    manager   : 'none',
  });
  
  const [systemReports, setSystemReports] = useState<Reports | null>(null);

  const [ systemGeneralMetrics, setSystemGeneralMetrics ] = useState<SystemGeneralMetrics['count'] | null>(null);

  const [ registeredProfessors, setRegisteredProfessors ] = useState<RegisteredProfessor[]>([]);
  const [ registeredStudents,   setRegisteredStudents ] = useState<RegisteredStudent[]>([]);
  const [ registeredManagers,   setRegisteredManagers ] = useState<RegisteredManager[]>([]);

  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  const [generalActions, setGeneralActions] = useState<ManagerGeneralActions | null>(null);
  const [userRoleList, setUserRoleList] = useState<UserRole>('STUDENT');

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={24}/>          , label: 'Agendamentos' , value: systemGeneralMetrics?.appointments ?? '?'  },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>          , label: 'Solicitações' , value: systemGeneralMetrics?.solicitations ?? '?' },
    { icon: <PiStudentBold className='text-cyan-500' size={28}/>       , label: 'Alunos'       , value: systemGeneralMetrics?.student ?? '?'       },
    { icon: <FaChalkboardTeacher className='text-cyan-500' size={28}/> , label: 'Professores'  , value: systemGeneralMetrics?.professors ?? '?'    },
  ];

  const filteredUsersListDataByRoleMap = {
    STUDENT: filterRegisteredStudents(
      registeredStudents,
      searchValue,
      filterValue.student,
    ).map((rest) => ({ ...rest, from: 'STUDENT' as const })),
    PROFESSOR: filterRegisteredProfessors(
      registeredProfessors,
      searchValue,
      filterValue.professor,
    ).map((rest) => ({ ...rest, from: 'PROFESSOR' as const })),
    MANAGER: filterRegisteredManagers(
      registeredManagers,
      searchValue,
      filterValue.manager,
    ).map((rest) => ({ ...rest, from: 'MANAGER' as const })),
  }; 

  const filtersByRoleMap = {
    STUDENT: {
      schema  : 'REGISTERED_STUDENTS_FILTER',
      value   : filterValue.student,
      setter : (value: FilterValue['student']) => setFilterValue(
        prev => ({ ...prev, student: value
      })),
    },
    PROFESSOR: {
      schema : 'REGISTERED_PROFESSORS_FILTER',
      value  : filterValue.professor,
      setter : (value: FilterValue['professor']) => setFilterValue(
        prev => ({ ...prev, professor: value
      })),
    },
    MANAGER: {
      schema : 'REGISTERED_MANAGERS_FILTER',
      value  : filterValue.manager,
      setter : (value: FilterValue['manager']) => setFilterValue(
        prev => ({ ...prev, manager: value
      })),
    }
  } as const;

  const userNotFoundByFilterByRoleMap = {
    STUDENT   : REGISTERED_STUDENTS_FILTER_VALUE_MAP[filterValue.student],
    PROFESSOR : REGISTERED_PROFESSORS_FILTER_VALUE_MAP[filterValue.professor],
    MANAGER   : REGISTERED_MANAGERS_FILTER_VALUE_MAP[filterValue.manager],
  } as const

  const searchInputPlaceholder: Record<UserRole, string> = {
    STUDENT   : 'Pesquisar por aluno, identificador, data de cadastro, quantidade de agendamentos ou solicitações',
    PROFESSOR : 'Pesquisar por professor, identificador, disciplina(s), data de cadastro, agendamentos ou solicitações',
    MANAGER   : 'Pesquisar por gestor, identificador ou data de cadastro',
  };

  const noContent = noContentFound(
    `Nenhum ${USER_ROLES[userRoleList]} cadastrado(a) no momento!`,
    userNotFoundByFilterByRoleMap[userRoleList],
    searchValue,
    filterValue && (
      filterValue.manager   !== 'none' ||
      filterValue.professor !== 'none' ||
      filterValue.student   !== 'none' 
    ),
    {
      notFound   : FaPersonCircleQuestion,
      notContent : FaClipboardQuestion
    },
  );
  

  useEffect(() => {
    if (location.pathname === '/home') {
      setGeneralActions(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    (async() => {
      try {
        const [ response1, response2, response3, response4, response5, response6 ] = [
          SYSTEM_GENERAL_METRICS,
          REGISTERED_STUDENTS,
          REGISTERED_PROFESSORS,
          REGISTERED_MANAGERS,
          ROOMS_DETAILS,
          SYSTEM_REPORTS,
        ]; 

        setSystemGeneralMetrics(response1);
        setRegisteredProfessors(response3);
        setRegisteredStudents(response2);
        setRegisteredManagers(response4);
        setSystemReports(response6);
        setRooms(response5);
      } catch (error:unknown) {
        if (error instanceof Error) console.error(error.message);
      } 
    })();
  },[]);

  return (
    <Layout 
    selectedTab='HOME'
    from='MANAGER'
    >
      <div className={`
        grid gap-x-3 h-full min-h-0
        ${ generalActions === 'USER_DETAILS' ? 'grid-cols-[1fr_400px]' : 'grid-cols-[1fr_300px]' }   
      `}>
        <div className='grid gap-y-3 grid-rows-[60px_1fr] min-h-0'>
          <div className='flex gap-5 max-w-200 mx-auto w-full'>
            { BRIEF_RENDER.map((item) => (
              <HomeBrief
                Icon={() => item.icon}
                label={item.label}
                value={item.value}
              />  
            )) }
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500 flex items-center gap-2'>
              <FaUsers size={21}/>
              Usuários do sistema
            </h3>

            <div className='w-full flex gap-2'>
              <Select.Default
                Icon={() => <FaClipboardList />}
                placeholder='Listagem'
                optionsSchema='USERS_LIST_BY_ROLE_FILTER'
                value={USERS_LIST_BY_ROLE_FILTER_REVERSE_TYPE_VALUE_MAP[userRoleList]}
                onSelect={(value) => {
                  const actualValue = USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP[value as keyof typeof USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP];
                  setUserRoleList(actualValue);
                }}
              />

              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder={searchInputPlaceholder[userRoleList]}
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                customStyle={{ container: 'flex-[1.3]', options: { button: 'text-xs' } }}
                optionsSchema={filtersByRoleMap[userRoleList].schema}
                value={filtersByRoleMap[userRoleList].value}
                onSelect={(value) => filtersByRoleMap[userRoleList].setter(value as any)}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredUsersListDataByRoleMap[userRoleList].length > 0 ? (
                filteredUsersListDataByRoleMap[userRoleList].map(( user ) => (
                  <Card.UserGeneralInfo
                    key={user.id}
                    { ...user }
                    onClick={() => {
                      navigate(`/home/student/${user.id}`);
                      setGeneralActions('USER_DETAILS');
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
        
        <div className={`
          grid gap-y-3 min-h-0
          ${ (generalActions) ? 'grid-rows-1' : 'grid-rows-[300px_140px]' }
        `}>
          { generalActions === 'USER_DETAILS' ? (
            <Outlet />
          ) : generalActions === 'NEW_USER' ? (
            <Form.NewUser
              onBack={() => setGeneralActions(null)}
            />
          ) : generalActions === 'REPORTS' ? (
            <Section.ManagerReports
              {...systemReports!}
              onBack={() => setGeneralActions(null)}
            />
          ) : generalActions === 'DELETE_USERS' ? (
            <Section.DeleteUsers
              filteredUsersListDataByRoleMap={filteredUsersListDataByRoleMap[userRoleList]}
              userRoleList={userRoleList}
              onBack={() => setGeneralActions(null)}
            />            
          ) : (
            <>
              { generalActions === 'ROOMS' ? (     
                <Section.RoomsDetails
                  rooms={rooms}
                  onBack={() => setGeneralActions(null)}
                />         
              ) : (
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
              )}

              { !generalActions &&       
                <Section.ManagerGeneralActions
                  onNewUser={     () => setGeneralActions('NEW_USER'     )}
                  onReports={     () => setGeneralActions('REPORTS'      )}
                  onUsersDelete={ () => setGeneralActions('DELETE_USERS' )}
                  onViewRooms={   () => setGeneralActions('ROOMS'        )}
                />
              }
            </>
          ) }
        </div>
      </div>
    </Layout>
  )
}

export default Manager