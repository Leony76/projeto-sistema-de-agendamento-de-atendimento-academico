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
import { filterRegisteredStudents, filterRegisteredManagers, filterRegisteredProfessors } from '@frontend/utils/filters/filterRegisteredUser.filter.util';
import { REGISTERED_MANAGERS_FILTER_VALUE_MAP, REGISTERED_PROFESSORS_FILTER_VALUE_MAP, REGISTERED_STUDENTS_FILTER_VALUE_MAP, type REGISTERED_MANAGERS_FILTER_MAP, type REGISTERED_PROFESSORS_FILTER_MAP, type REGISTERED_STUDENTS_FILTER_MAP } from '@frontend/constants/maps/filters/registeredUsers.map.filter';
import { USER_ROLES } from '@frontend/constants/maps/userRoles.map';
import { Form } from '@frontend/components/form';
import { Section } from '@frontend/components/section';
import type { SystemReports } from '@shared/types/reports.type';
import type { ManagerGeneralActions } from '@shared/types/managerGeneralActions.type';
import HomeBrief from '@frontend/components/misc/HomeBrief';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import type { Room } from '@shared/types/room.type';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import type { ActiveStudentsToManagerList, ActiveManagersToManagerList, ActiveProfessorsToManagerList } from '@shared/types/dtos/managerUsersList.dto';
import type { ManagerHomeBriefInfosResponse as ManagerHomeBriefInfos } from '@shared/types/dtos/userHomeBriefInfos.dto';
import { UserService } from '@frontend/services/user.service';
import { MiscService } from '@frontend/services/misc.service';
import { RoomService } from '@frontend/services/room.service';
import type { SelectOptionsSchema } from '@shared/types/selectOptionsSchema.type';

type FilterValue = {
  student   : typeof REGISTERED_STUDENTS_FILTER_MAP[number]['value'];
  professor : typeof REGISTERED_PROFESSORS_FILTER_MAP[number]['value'];
  manager   : typeof REGISTERED_MANAGERS_FILTER_MAP[number]['value'];
};

const Manager = (): React.JSX.Element => {
  
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState<string>('');
  
  const [filterValue, setFilterValue] = useState<FilterValue>({
    student   : 'none',
    professor : 'none',
    manager   : 'none',
  });
  
  const [systemReports, setSystemReports] = useState<SystemReports | null>(null);
  const [refreshData, setRefreshData] = useState(0);

  const [ systemGeneralMetrics, setSystemGeneralMetrics ] = useState<ManagerHomeBriefInfos | null>(null);

  const [ activeProfessors, setActiveProfessors ] = useState<ActiveProfessorsToManagerList[]>([]);
  const [ activeStudents,   setActiveStudents ] = useState<ActiveStudentsToManagerList[]>([]);
  const [ activeManagers,   setActiveManagers ] = useState<ActiveManagersToManagerList[]>([]);

  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  const [generalActions, setGeneralActions] = useState<ManagerGeneralActions | null>(null);
  const [userRoleList, setUserRoleList] = useState<UserRole>('STUDENT');

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={24}/>          , label: 'Agendamentos' , value: systemGeneralMetrics?.appointments ?? '0'  },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>          , label: 'Solicitações' , value: systemGeneralMetrics?.solicitations ?? '0' },
    { icon: <PiStudentBold className='text-cyan-500' size={28}/>       , label: 'Alunos'       , value: systemGeneralMetrics?.students ?? '0'       },
    { icon: <FaChalkboardTeacher className='text-cyan-500' size={28}/> , label: 'Professores'  , value: systemGeneralMetrics?.professors ?? '0'    },
  ];

  const filteredUsersListDataByRoleMap = {
    STUDENT: filterRegisteredStudents(
      activeStudents,
      searchValue,
      filterValue.student,
    ).map((rest) => ({ ...rest, from: 'STUDENT' as const })),

    PROFESSOR: filterRegisteredProfessors(
      activeProfessors,
      searchValue,
      filterValue.professor,
    ).map((rest) => ({ ...rest, from: 'PROFESSOR' as const })),

    MANAGER: filterRegisteredManagers(
      activeManagers,
      searchValue,
      filterValue.manager,
    ).map((rest) => ({ ...rest, from: 'MANAGER' as const })),
  } as const; 

  const filtersByRoleMap: Record<UserRole, {
    schema : SelectOptionsSchema,
    value  : string,
    setter : (value: string) => void,
  }> = {
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
  };

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
    `Nenhum ${USER_ROLES[userRoleList].toLocaleLowerCase()} cadastrado(a) no momento!`,
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
        switch (userRoleList) {
          case 'STUDENT':
            const students: ActiveStudentsToManagerList[] = await UserService.getActiveStudentsToManagerList();
            setActiveStudents(students);
            break;
          case 'PROFESSOR':
            const professors: ActiveProfessorsToManagerList[] = await UserService.getActiveProfessorsToManagerList();
            setActiveProfessors(professors);
            break;
          case 'MANAGER':
            const managers: ActiveManagersToManagerList[] = await UserService.getActiveManagersToManagerList();
            setActiveManagers(managers);
            break;
          default: 
            throw new Error('Permissão de usuário inválido');
        }
        // EDIÇÃO DE INFORMAÇÕES
        const [ systemReports, managerBriefInfos, rooms ] = await Promise.all([
          MiscService.getSystemReports(),
          UserService.getManagerHomeBriefInfos(),
          RoomService.getRooms(),
        ]);

        setSystemReports(systemReports);
        setSystemGeneralMetrics(managerBriefInfos);
        setRooms(rooms);
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();
  }, [userRoleList, refreshData]);

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
            ))}
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
                    key={ user.id }
                    { ...user }
                    onClick={{
                      exclude     : () => setRefreshData(prev => prev + 1),
                      userDetails : () => {
                        navigate(`/home/${user.from.toLowerCase()}/${user.id}`);
                        setGeneralActions('USER_DETAILS');
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
        
        <div className={`
          grid gap-y-3 min-h-0
          ${ (generalActions) ? 'grid-rows-1' : 'grid-rows-[300px_1fr]' }
        `}>
          { generalActions === 'USER_DETAILS' ? (
            <Outlet />
          ) : generalActions === 'NEW_USER' ? (
            <Form.NewUser
              onBack={() => setGeneralActions(null)}
              refreshUsers={() => setRefreshData(prev => prev + 1)}
            />
          ) : generalActions === 'REPORTS' ? (
            <Section.ManagerReports
              reports={systemReports}
              onBack={() => setGeneralActions(null)}
            />
          ) : generalActions === 'DELETE_USERS' ? (
            <Section.DeleteUsers
              filteredUsersListDataByRoleMap={filteredUsersListDataByRoleMap[userRoleList]}
              userRoleList={userRoleList}
              onBack={() => {
                setGeneralActions(null)
                setRefreshData(prev => prev + 1);
              }}
            />            
          ) : (
            <>
              { generalActions === 'ROOMS' ? (     
                <Section.RoomsDetails
                  rooms={rooms}
                  refresh={() => setRefreshData(prev => prev + 1)}
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