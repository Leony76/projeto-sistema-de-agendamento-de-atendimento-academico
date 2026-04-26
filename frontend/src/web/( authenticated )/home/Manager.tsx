import React, { useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaChalkboardTeacher, FaClipboardList, FaFilter, FaRegClock } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import Calendar from 'react-calendar';
import '@/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import NoContent from '@/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentAppoitment.map.filter';
import type { UserRole } from '@/types/userRole.type';
import { PiStudentBold } from 'react-icons/pi';
import type { RegisteredManager, RegisteredProfessor, RegisteredStudent } from '@/types/registeredUsers.type';
import { USERS_LIST_BY_ROLE_FILTER_REVERSE_TYPE_VALUE_MAP, USERS_LIST_BY_ROLE_FILTER_TYPE_VALUE_MAP } from '@/constants/maps/filters/usersListByRole.map.filter';
import { Outlet, useNavigate } from 'react-router-dom';

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
    discipline    : 'ARTS' 
  },
];

const REGISTERED_MANAGERS_DATA: RegisteredManager[] = [
  {
    id            : 3,
    name          : 'Admin',
    photo         : 'https://www.shutterstock.com/image-vector/admin-stamp-watermark-scratched-style-600w-1138728377.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
  },
];

const BRIEF_INFOS_DATA = {
  appointments  : 3,
  solicitations : 5,
  students      : 67,
  professors    : 12,
};

const Manager = (): React.JSX.Element => {

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={24}/>             , label: 'Agendamentos'  , value: BRIEF_INFOS_DATA.appointments  },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações' , value: BRIEF_INFOS_DATA.solicitations },
    { icon: <PiStudentBold className='text-cyan-500' size={28}/> ,  label: 'Alunos'       , value: BRIEF_INFOS_DATA.students      },
    { icon: <FaChalkboardTeacher className='text-cyan-500' size={28}/> ,  label: 'Professores'  , value: BRIEF_INFOS_DATA.professors    },
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  const [userRoleList, setUserRoleList] = useState<UserRole>('STUDENT');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  const navigate = useNavigate();

  // const filteredStudentAppointmentsData = filterStudentAppointments(
  //   STUDENT_APPOITMENTS_DATA,
  //   searchValue,
  //   filterValue,
  // );

  
  const filteredUsersData: Record<UserRole, any[]> = {
    STUDENT   : REGISTERED_STUDENTS_DATA,
    PROFESSOR : REGISTERED_PROFESSORS_DATA,
    MANAGER   : REGISTERED_MANAGERS_DATA, 
  };
  
  const filterSchema = {
    STUDENT   : 'REGISTERED_STUDENTS_FILTER',
    PROFESSOR : 'REGISTERED_PROFESSORS_FILTER',
    MANAGER   : 'REGISTERED_MANAGERS_FILTER',
  } as const;

  const searchInputPlaceholder: Record<UserRole, string> = {
    STUDENT   : 'Pesquisar por aluno, data de cadastro, agendamentos ou solicitações',
    PROFESSOR : 'Pesquisar por professor, disciplina, data de cadastro, agendamentos ou solicitações',
    MANAGER   : 'Pesquisar por gestor ou data de cadastro',
  };

  return (
    <Layout 
    selectedTab='HOME'
    from='MANAGER'
    >
      <div className={`
        grid gap-x-3 h-full min-h-0
        ${ showUserInfo ? 'grid-cols-[1fr_400px]' : 'grid-cols-[1fr_300px]' }   
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
                optionsSchema={filterSchema[userRoleList]}
                value={filterValue}
                onSelect={setFilterValue}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredUsersData[userRoleList].length > 0 ? (
                userRoleList === 'STUDENT' ? (
                  filteredUsersData[userRoleList].map(( user ) => (
                    <Card.UserGeneralInfo
                      from='STUDENT'
                      onClick={() => {
                        navigate(`/home/student/${user.id}`);
                        setShowUserInfo(true);
                      }}
                      key={user.id}
                      { ...user }
                    />
                  )) 
                ) : userRoleList === 'PROFESSOR' ? (
                  filteredUsersData[userRoleList].map(( user ) => (
                    <Card.UserGeneralInfo
                      from='PROFESSOR'
                      onClick={() => {
                        navigate(`/home/professor/${user.id}`);
                        setShowUserInfo(true);
                      }}
                      key={user.id}
                      { ...user }
                    />
                  ))
                ) : (
                  filteredUsersData[userRoleList].map(( user ) => (
                    <Card.UserGeneralInfo
                      from='MANAGER'
                      onClick={() => {
                        navigate(`/home/manager/${user.id}`);
                        setShowUserInfo(true);
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
                    searchValue && filterValue
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_APPOINTMENTS_FILTER_VALUE_MAP]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_APPOINTMENTS_FILTER_VALUE_MAP]}"`
                      : `Nenhum agendamento disponível no momento!`
                  }
                />
              )}
            </div>
          </div>
        </div>
        
        <div className={`
          grid gap-y-3 min-h-0
          ${ showUserInfo ? 'grid-rows-1' : 'grid-rows-[2fr_1fr]' }
        `}>
          { showUserInfo ? (
            <Outlet />
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
          ) }
        </div>
      </div>
    </Layout>
  )
}

export default Manager