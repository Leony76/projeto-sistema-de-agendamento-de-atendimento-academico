import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaChalkboardTeacher, FaClipboardList, FaFilter, FaRegClock, FaTrashAlt, FaUserPlus } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import Calendar from 'react-calendar';
import '@/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import NoContent from '@/components/misc/NoContent';
import type { UserRole } from '@/types/userRole.type';
import { PiStudentBold } from 'react-icons/pi';
import type { RegisteredManager, RegisteredProfessor, RegisteredStudent } from '@/types/registeredUsers.type';
import { USERS_LIST_BY_ROLE_FILTER_REVERSE_TYPE_VALUE_MAP, USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP } from '@/constants/maps/filters/usersListByRole.map.filter';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { filterRegisteredStudents } from '@/utils/filters/filterRegisteredStudents.util';
import { REGISTERED_MANAGERS_FILTER_VALUE_MAP, REGISTERED_PROFESSORS_FILTER_VALUE_MAP, REGISTERED_STUDENTS_FILTER_VALUE_MAP, type REGISTERED_MANAGERS_FILTER_MAP, type REGISTERED_PROFESSORS_FILTER_MAP, type REGISTERED_STUDENTS_FILTER_MAP } from '@/constants/maps/filters/registeredUsers.map.filter';
import { filterRegisteredProfessors } from '@/utils/filters/filterRegisteredProfessors.util';
import { filterRegisteredManagers } from '@/utils/filters/filterRegisteredManagers.util';
import { USER_ROLES } from '@/constants/maps/userRoles.map';
import { Button } from '@/components/button';
import { useForm } from 'react-hook-form';
import { newStudentSchema, type NewStudentFormData } from '@/schemas/newUser.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export const LOGGED_USER_DATA: { role: Exclude<UserRole, 'MANAGER'> } = {
  role: 'STUDENT',
}

const REGISTERED_STUDENTS_DATA: RegisteredStudent[] = [
  {
    id            : 1,
    name          : 'Maria bonita 1',
    photo         : 'https://pbs.twimg.com/media/HGvGoDZXsAAC1bN?format=jpg&name=large',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    appointments  : 12,
    solicitations : 123,
  },
];

const REGISTERED_PROFESSORS_DATA: RegisteredProfessor[] = [
  {
    id            : 2,
    name          : 'Mad Max',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    appointments  : 2,
    solicitations : 12,
    discipline    : 'CHEMISTRY' 
  },
  {
    id            : 4,
    name          : 'Fred Mercury',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-23T15:32:20.000Z',
    appointments  : 20,
    solicitations : 15,
    discipline    : 'ARTS' 
  },
  {
    id            : 5,
    name          : 'Indiana Jones',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-24T15:32:20.000Z',
    appointments  : 25,
    solicitations : 10,
    discipline    : 'PHYSICS' 
  },
];

const REGISTERED_MANAGERS_DATA: RegisteredManager[] = [
  {
    id            : 3,
    name          : 'Admin',
    photo         : 'https://www.shutterstock.com/image-vector/admin-stamp-watermark-scratched-style-600w-1138728377.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
  },
  {
    id            : 6,
    name          : 'Admin 2',
    photo         : 'https://www.shutterstock.com/image-vector/admin-stamp-watermark-scratched-style-600w-1138728377.jpg',
    registeredAt  : '2026-04-23T15:32:20.000Z',
  },
  {
    id            : 7,
    name          : 'Admin 3',
    photo         : 'https://www.shutterstock.com/image-vector/admin-stamp-watermark-scratched-style-600w-1138728377.jpg',
    registeredAt  : '2026-04-24T15:32:20.000Z',
  },
];

const BRIEF_INFOS_DATA = {
  appointments  : 3,
  solicitations : 5,
  students      : 67,
  professors    : 12,
};

type FilterValue = {
  student   : typeof REGISTERED_STUDENTS_FILTER_MAP[number]['value'];
  professor : typeof REGISTERED_PROFESSORS_FILTER_MAP[number]['value'];
  manager   : typeof REGISTERED_MANAGERS_FILTER_MAP[number]['value'];
};

const Manager = (): React.JSX.Element => {

  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewStudentFormData>({
    resolver: zodResolver(newStudentSchema),
    defaultValues: {
      email : '',
      name  : '',
      ra    : '',
    },
  });

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={24}/>             , label: 'Agendamentos'  , value: BRIEF_INFOS_DATA.appointments  },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações' , value: BRIEF_INFOS_DATA.solicitations },
    { icon: <PiStudentBold className='text-cyan-500' size={28}/> ,  label: 'Alunos'       , value: BRIEF_INFOS_DATA.students      },
    { icon: <FaChalkboardTeacher className='text-cyan-500' size={28}/> ,  label: 'Professores'  , value: BRIEF_INFOS_DATA.professors    },
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    student   : 'none',
    professor : 'none',
    manager   : 'none',
  });

  const [generalActions, setGeneralActions] = useState<
    | 'NEW_USER'
    | 'DELETE_USERS'
    | 'REPORTS'
    | 'USER_DETAILS'
    | null
  >(null);

  const [newUserRole, setNewUserRole] = useState<UserRole>('STUDENT');

  const [userRoleList, setUserRoleList] = useState<UserRole>('STUDENT');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  
  const navigate = useNavigate();
  const location = useLocation();

  const filteredUsersListDataByRoleMap = {
    STUDENT: filterRegisteredStudents(
      REGISTERED_STUDENTS_DATA,
      searchValue,
      filterValue.student,
    ),
    PROFESSOR: filterRegisteredProfessors(
      REGISTERED_PROFESSORS_DATA,
      searchValue,
      filterValue.professor,
    ),
    MANAGER: filterRegisteredManagers(
      REGISTERED_MANAGERS_DATA,
      searchValue,
      filterValue.manager,
    ),
  } as const; 

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
    STUDENT   : 'Pesquisar por aluno, data de cadastro, agendamentos ou solicitações',
    PROFESSOR : 'Pesquisar por professor, disciplina, data de cadastro, agendamentos ou solicitações',
    MANAGER   : 'Pesquisar por gestor ou data de cadastro',
  };

  const hasFilter =
    filterValue.student   !== 'none' ||
    filterValue.professor !== 'none' ||
    filterValue.manager   !== 'none'
  ;

  useEffect(() => {
    if (location.pathname === '/home') {
      setGeneralActions(null);
    }
  }, [location.pathname]);

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
              <div className='flex border justify-evenly items-center border-cyan-400 rounded-lg bg-cyan-100/20 flex-1'>
                { item.icon }
                
                <div className='flex flex-col'>
                  <h4 className=' text-cyan-500 text-sm'>
                    { item.label }
                  </h4>

                  <span className='text-lg font-semibold -mt-1 text-orange-500/50'>
                    { item.value }
                  </span>
                </div>
              </div>
            )) }
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
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
                userRoleList === 'STUDENT' ? (
                  filteredUsersListDataByRoleMap[userRoleList].map(( user ) => (
                    <Card.UserGeneralInfo
                      from='STUDENT'
                      onClick={() => {
                        navigate(`/home/student/${user.id}`);
                        setGeneralActions('USER_DETAILS');
                      }}
                      key={user.id}
                      { ...user }
                    />
                  )) 
                ) : userRoleList === 'PROFESSOR' ? (
                  filteredUsersListDataByRoleMap[userRoleList].map(( user ) => (
                    <Card.UserGeneralInfo
                      from='PROFESSOR'
                      onClick={() => {
                        navigate(`/home/professor/${user.id}`);
                        setGeneralActions('USER_DETAILS');
                      }}
                      key={user.id}
                      { ...user }
                    />
                  ))
                ) : (
                  filteredUsersListDataByRoleMap[userRoleList].map(( user ) => (
                    <Card.UserGeneralInfo
                      from='MANAGER'
                      onClick={() => {
                        navigate(`/home/manager/${user.id}`);
                        setGeneralActions('USER_DETAILS');
                      }}
                      key={user.id}
                      { ...user }
                    />
                  ))
                )
              ) : (
                <NoContent
                  Icon={(searchValue || filterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && hasFilter
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${userNotFoundByFilterByRoleMap[userRoleList]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : hasFilter
                      ? `Nenhum resultado para o filtro "${userNotFoundByFilterByRoleMap[userRoleList]}"`
                      : `Nenhum ${USER_ROLES[userRoleList].toLocaleLowerCase()} cadastrado no momento!`
                  }
                />
              )}
            </div>
          </div>
        </div>
        
        <div className={`
          grid gap-y-3 min-h-0
          ${ (generalActions === 'USER_DETAILS' || generalActions === 'NEW_USER') ? 'grid-rows-1' : 'grid-rows-[2fr_1fr]' }
        `}>
          { generalActions === 'USER_DETAILS' ? (
            <Outlet />
          ) : generalActions === 'NEW_USER' ? (
            <div className='flex flex-col gap-2 py-3 px-4 items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
              <h3 className='font-semibold text-lg text-cyan-500'>
                Novo usuário
              </h3>

              <p className='text-xs text-orange-500'>
                Selecione qual tipo de usuário vai cadastrar
              </p>

              <div className='flex w-full h-7 gap-2'>
                <Button.Default
                  label='Aluno'
                  customStyle={{ button: 'text-sm' }}
                  selected={newUserRole === 'STUDENT'}
                  onClick={() => setNewUserRole('STUDENT')}
                />

                <Button.Default
                  label='Professor'
                  customStyle={{ button: 'text-sm' }}
                  selected={newUserRole === 'PROFESSOR'}
                  onClick={() => setNewUserRole('PROFESSOR')}
                />

                <Button.Default
                  label='Gestor'
                  customStyle={{ button: 'text-sm' }}
                  selected={newUserRole === 'MANAGER'}
                  onClick={() => setNewUserRole('MANAGER')}
                />
              </div>

              <Input.Default
                label='Nome'
                customStyle={{ input: 'h-8' }}
                placeholder='Insira o RA do novo aluno'
                { ...register('ra') }
                error={errors.ra?.message}
              />

              <Input.Default
                label='RA'
                customStyle={{ input: 'h-8' }}
                placeholder='Insira o RA do novo aluno'
                { ...register('ra') }
                error={errors.ra?.message}
              />
            </div>
          ) : (
            <>
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

              <div className='flex flex-col items-center p-2 gap-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
                <h3 className='font-semibold text-lg text-cyan-500'>
                  Ações gerais
                </h3>

                <div className='flex-1 min-h-0 w-full grid grid-cols-2 border gap-2 overflow-auto bg-white p-2 rounded-xl border-cyan-300'>
                  <Button.Default
                    label='Novo usuário'
                    Icon={() => <FaUserPlus />}
                    onClick={() => setGeneralActions('NEW_USER')}
                    customStyle={{ button: 'py-1 text-xs text-green-500 border-green-500 bg-green-100 font-semibold' }}
                  />  

                  <Button.Default
                    label='Relatórios'
                    Icon={() => <FaClipboardList />}
                    onClick={() => setGeneralActions('REPORTS')}
                    customStyle={{ button: 'py-1 text-sm text-cyan-600 border-cyan-700 bg-cyan-200 font-semibold' }}
                  />  

                  <Button.Default
                    label='Excluir usuários'
                    Icon={() => <FaTrashAlt />}
                    onClick={() => setGeneralActions('DELETE_USERS')}
                    customStyle={{ button: 'py-1 text-xs text-red-600 border-red-700 bg-red-100 font-semibold' }}
                  />  
                </div>  
              </div>
            </>
          ) }
        </div>
      </div>
    </Layout>
  )
}

export default Manager