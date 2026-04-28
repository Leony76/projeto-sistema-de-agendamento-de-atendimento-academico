import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpansibleImage from './ExpansibleImage';
import NoContent from './NoContent';
import type { UserDetails as UserDetailsType } from '@/types/userDetails.type';
import { USER_ROLES } from '@/constants/maps/userRoles.map';
import { formatDateTime } from '@/utils/formats/formatDateTime.util';
import { Select } from '../select';
import { Input } from '../input';
import { FaArrowCircleLeft, FaFilter, FaUserAltSlash } from 'react-icons/fa';
import { STUDENT_APPOINTMENTS_FILTER_MAP, STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentAppoitment.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { Card } from '../card';
import { filterProfessorAppointments } from '@/utils/filters/filterProfessorAppointments.util';
import { filterStudentAppointments } from '@/utils/filters/filterStudentAppointments.util';
import { filterStudentSolicitationsFromProfessorView } from '@/utils/filters/filterStudentSolicitationsFromProfessorView.util';
import { filterStudentSolicitations } from '@/utils/filters/filterStudentSolicitations.util';
import { PROFESSOR_APPOINTMENTS_FILTER_MAP, PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP } from '@/constants/maps/filters/professorAppointments.map.filter';
import { STUDENT_SOLICITATIONS_FILTER_MAP, STUDENT_SOLICITATIONS_FILTER_VALUE_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentSolicitations.map.filter';
import { Button } from '../button';

const REGISTERED_USERS_DATA: UserDetailsType[] = [
  {
    id            : 1,
    name          : 'Maria bonita 1',
    photo         : 'https://pbs.twimg.com/media/HGvGoDZXsAAC1bN?format=jpg&name=large',
    registeredAt  : '2026-04-20T15:32:20.000Z',
    appointments  : 2,
    solicitations : 12,
    role          : 'STUDENT',
    appointmentsList : [
      {
        id         :  1,
        dateTime   : '2026-10-05T15:00:00.000Z',
        reason     : 'Lorem ipsum dolor ',
        status     : 'CONFIRMED',
        room       : '1B',
        professor  : {
          name  : 'Cloud Strife',
          photo : 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop' ,
        },
      },
      {
        id         :  2,
        dateTime   : '2026-10-07T16:00:00.000Z',
        reason     : 'Lorem ipsum dolorem ',
        status     : 'UNCONFIRMED',
        room       : '1C',
        professor  : {
          name  : 'Madara Uchiha',
          photo : 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
        },
      },
    ],
    solicitationsList: [
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
        name: 'Sasuke Uchiha Mendes Souza da Silva Sampaio',
        discipline: 'CHEMISTRY',
        photo: 'https://pop.proddigital.com.br/wp-content/uploads/sites/8/2024/04/01-32.jpg',
        appoitmentDateTime: '2026-10-08T17:00:00.000Z',
        status: 'CANCELED',
      },
    ],
  },
  {
    id            : 2,
    name          : 'Mad Max',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    appointments  : 233,
    solicitations : 23,
    role          : 'PROFESSOR',
    discipline    : 'GEOGRAPHY',
    appointmentsList : [
      {
        id         :  1,
        dateTime   : '2026-10-05T15:00:00.000Z',
        reason     : 'Lorem ipsum dolor ',
        status     : 'CONFIRMED',
        room       : '1B',
        student  : {
          name  : 'Cloud Strife',
          photo : 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop' ,
        },
      },
      {
        id         :  2,
        dateTime   : '2026-10-07T16:00:00.000Z',
        student  : {
          name  : 'Maria Bonita Mendonça de Oliveira Lima',
          photo : 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
        },
        reason     : 'Lorem ipsum dolorem ',
        status     : 'UNCONFIRMED',
        room       : '1C'
      },
    ],
    solicitationsList: [
      {
        id: 1,
        name: 'Mad Max',
        photo: 'https://i0.wp.com/cinegrandiose.com/wp-content/uploads/2016/02/MadM-8.png?fit=960%2C540&ssl=1',
        appoitmentDateTime: '2026-10-05T15:00:00.000Z',
        reason: 'Lorem Ipsum Dolor Iurem Eclestas',
        status: 'UNCONFIRMED',
      }
    ],
  },
  {
    id            : 3,
    name          : 'Admin',
    photo         : 'https://www.shutterstock.com/image-vector/admin-stamp-watermark-scratched-style-600w-1138728377.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    role          : 'MANAGER',
  },
];

type SearchValue = {
  appointment  : string;
  solicitation : string;
};

type FilterValue = {
  student   : {
    appointments  : typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value'];
    solicitations : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'];
  };
  professor : {
    appointments  : typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'];
    solicitations : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'];
  }; 
};

export const UserDetails = (): React.JSX.Element => {
  const { id } = useParams();

  const [ user, setUser ] = useState<UserDetailsType | null>(null);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState<SearchValue>({
    appointment  : '',
    solicitation : '',
  });

  const [userDetailsFilter, setUserDetailsFilter] = useState<FilterValue>({
    student   : { appointments: 'none', solicitations: 'none' },
    professor : { appointments: 'none', solicitations: 'none' },
  });

  const appointmentsAndSolicitationsByRoleMap = {
    PROFESSOR: {
      appointments: filterProfessorAppointments(
        user?.role === 'PROFESSOR' ? user.appointmentsList : [],
        searchValue.appointment,
        userDetailsFilter.professor.appointments,
      ),
      solicitations: filterStudentSolicitationsFromProfessorView(
        user?.role === 'PROFESSOR' ? user.solicitationsList : [],
        searchValue.solicitation,
        userDetailsFilter.professor.solicitations,
      ),
    },
    STUDENT: {
      appointments: filterStudentAppointments(
        user?.role === 'STUDENT' ? user.appointmentsList : [],
        searchValue.appointment,
        userDetailsFilter.student.appointments,
      ),
      solicitations: filterStudentSolicitations(
        user?.role === 'STUDENT' ? user.solicitationsList : [],
        searchValue.solicitation,
        userDetailsFilter.student.solicitations,
      ),
    },
  };

  const userNotFoundByFilterByRoleMap = {
    STUDENT   : {
      appointments  : STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[userDetailsFilter.student.appointments],
      solicitations : STUDENT_SOLICITATIONS_FILTER_VALUE_MAP[userDetailsFilter.student.solicitations],
    },
    PROFESSOR : {
      appointments  : PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP[userDetailsFilter.professor.appointments],
      solicitations : STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP[userDetailsFilter.professor.solicitations],
    }
  } as const

  const filtersByRoleMap = {
    STUDENT: {
      appointments: {
        schema  : 'STUDENT_APPOINTMENT_FILTER',
        value   : userDetailsFilter.student.appointments,
        setter : (value: FilterValue['student']['appointments']) => setUserDetailsFilter(prev => ({
          ...prev, student: { ...prev.student, appointments: value }
        })),
      },
      solicitations: {
        schema : 'STUDENT_SOLICITATIONS_FILTER',
        value  : userDetailsFilter.student.solicitations,
        setter :(value: FilterValue['student']['solicitations']) => setUserDetailsFilter(prev => ({
          ...prev, student: { ...prev.student, solicitations: value }
        })),
      },
    },
    PROFESSOR: {
      appointments: {
        schema : 'PROFESSOR_APPOINTMENT_FILTER',
        value  : userDetailsFilter.professor.appointments,
        setter : (value: FilterValue['professor']['appointments']) => setUserDetailsFilter(prev => ({
          ...prev, professor: { ...prev.professor, appointments: value }
        })),
      },
      solicitations: {
        schema : 'STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER',
        value  : userDetailsFilter.professor.solicitations,
        setter : (value: FilterValue['professor']['solicitations']) => setUserDetailsFilter(prev => ({
          ...prev, professor: { ...prev.professor, solicitations: value }
        })),
      },
    }
  } as const;
  
  useEffect(() => {
    if (!id) return;

    const getUserSelected = async(id:number):Promise<void> => {
      try {
        const response = REGISTERED_USERS_DATA.find((user) => user.id === id);
  
        setUser(response ?? null);
      } catch (error:unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    };

    getUserSelected(Number(id));
  },[id]);

  const hasFilter =
    userDetailsFilter.student.appointments !== 'none'   ||
    userDetailsFilter.student.solicitations !== 'none'  ||
    userDetailsFilter.professor.appointments !== 'none' ||
    userDetailsFilter.professor.solicitations !== 'none'
  ;

  if (!user) return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <div>
        <NoContent 
          message='Usuário não encontrado' 
          Icon={() => <FaUserAltSlash size={24}/>}
        />
      </div>
  
      <Button.Default
        label=''
        Icon={() => <FaArrowCircleLeft/>}
        onClick={() => navigate('/home')}
        customStyle={{ button: 'w-fit!' }}
      />
    </div>
  );

  return (
    <div className='relative overflow-y-auto flex flex-col items-center gap-2 p-4 border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      onClick={() => navigate('/home')}
      className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'>
        <FaArrowCircleLeft size={22}/>
      </button>
      
      <ExpansibleImage
        image={{
          name : user.name,
          uri  : user.photo,
          size : 'h-35 w-35', 
        }}
      />

      <div className='flex flex-col items-center'>
        <h3 className='text-orange-500 text-xl font-bold'>
          { user.name }
        </h3>

        <label className='text-sm text-cyan-400'>
          { USER_ROLES[user.role] }
        </label>
      </div>
      
      <div className='w-full'>
        { user.role !== 'MANAGER' &&
          <div className='flex justify-between'>
            <label className='text-sm text-orange-400 font-semibold'>
              Agendamentos: <span className='text-cyan-500 font-normal'>{ user.appointments }</span>
            </label>

            <label className='text-sm text-orange-400 font-semibold'>
              Solicitações: <span className='text-cyan-500 font-normal'>{ user.appointments }</span>
            </label>
          </div>
        }

        <label className='text-sm text-orange-400 font-semibold'>
          Data de cadastro: <span className='text-cyan-500 font-normal'>{ formatDateTime(user.registeredAt) }</span>
        </label>

        { user.role !== 'MANAGER' &&  
          <>
            <div className='flex flex-col items-center mt-2 gap-3'>
              <h3 className='text-cyan-500 text-lg font-semibold'>
                Agendamentos
              </h3>

              <div className='flex gap-2 w-full'>
                <Input.Search
                  onChange={(e) => setSearchValue(prev => ({ ...prev, appointment: e.target.value }))}
                  onClear={() => setSearchValue(prev => ({ ...prev, appointment: '' }))}
                  placeholder='Pesquisar por professor, status, sala ou motivo'
                  value={searchValue.appointment}
                  customStyle={{ input: 'flex-2' }}
                />

                <Select.Default
                  Icon={() => <FaFilter size={13}/>}
                  placeholder='Filtro'
                  optionsSchema={filtersByRoleMap[user.role].appointments.schema}
                  customStyle={{ container: '', options: { button: 'text-xs' } }}
                  value={filtersByRoleMap[user.role].appointments.value}
                  onSelect={(value) => filtersByRoleMap[user.role].appointments.setter(value as any)}
                />
              </div>

              <div className='flex-1 min-h-0 max-h-57 flex w-full flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
                { appointmentsAndSolicitationsByRoleMap[user.role].appointments.length > 0 ? (
                  user.role === 'STUDENT' ? (
                    appointmentsAndSolicitationsByRoleMap[user.role].appointments.map(( appointment ) => (
                      <Card.SMAppointment
                        from='STUDENT'
                        key={appointment.id}
                        { ...appointment }
                      />
                    ))
                  ) : (
                    appointmentsAndSolicitationsByRoleMap[user.role].appointments.map(( appointment ) => (
                      <Card.SMAppointment
                        from='PROFESSOR'
                        key={appointment.id}
                        { ...appointment }
                      />                 
                    ))
                  )
                ) : (
                  <NoContent
                    Icon={(searchValue.appointment || hasFilter) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                    message={
                      searchValue.appointment && hasFilter
                        ? `Nenhum resultado para "${searchValue.appointment}" com o filtro "${userNotFoundByFilterByRoleMap[user.role].appointments}"`
                        : searchValue.appointment
                        ? `Nenhum resultado para "${searchValue.appointment}"`
                        : userDetailsFilter
                        ? `Nenhum resultado para o filtro "${userNotFoundByFilterByRoleMap[user.role].appointments}"`
                        : `Nenhum agendamento disponível no momento para esse(a) ${USER_ROLES[user.role].toLocaleLowerCase()}!`
                    }
                  />
                )}
              </div>
            </div>

            <div className='flex flex-col items-center mt-2 gap-3'>
              <h3 className='text-cyan-500 text-lg font-semibold'>
                Solicitações
              </h3>

              <div className='flex gap-2 w-full'>
                <Input.Search
                  onChange={(e) => setSearchValue(prev => ({ ...prev, solicitation: e.target.value}))}
                  onClear={() => setSearchValue(prev => ({ ...prev, solicitation: ''}))}
                  placeholder='Pesquisar por professor, status, sala ou motivo'
                  value={searchValue.solicitation}
                  customStyle={{ input: 'flex-2' }}
                />

                <Select.Default
                  Icon={() => <FaFilter size={13}/>}
                  placeholder='Filtro'
                  optionsSchema={filtersByRoleMap[user.role].solicitations.schema}
                  customStyle={{ container: '', options: { button: 'text-xs' } }}
                  value={filtersByRoleMap[user.role].solicitations.value}
                  onSelect={(value) => filtersByRoleMap[user.role].solicitations.setter(value as any)}
                />
              </div>

              <div className='flex-1 grid grid-cols-1 min-h-0 max-h-57 w-full flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
                { appointmentsAndSolicitationsByRoleMap[user.role].solicitations.length > 0 ? (
                  user.role === 'STUDENT' ? (
                    appointmentsAndSolicitationsByRoleMap[user.role].solicitations.map(( solicitation ) => (
                      <Card.SMSolicitation
                        from='STUDENT'
                        key={solicitation.id}
                        { ...solicitation }
                      />
                    ))
                  ) : (
                    appointmentsAndSolicitationsByRoleMap[user.role].solicitations.map(( solicitation ) => (
                      <Card.SMSolicitation
                        from='PROFESSOR'
                        key={solicitation.id}
                        { ...solicitation }
                      />                 
                    ))
                  )
                ) : (
                  <NoContent
                    Icon={(searchValue.solicitation || (hasFilter)) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                    message={
                      searchValue.solicitation && hasFilter
                        ? `Nenhum resultado para "${searchValue.solicitation}" com o filtro "${userNotFoundByFilterByRoleMap[user.role].solicitations}"`
                        : searchValue.solicitation
                        ? `Nenhum resultado para "${searchValue.solicitation}"`
                        : hasFilter
                        ? `Nenhum resultado para o filtro "${userNotFoundByFilterByRoleMap[user.role].solicitations}"`
                        : `Nenhuma solicitação disponível no momento para esse(a) ${USER_ROLES[user.role].toLocaleLowerCase()}!`
                    }
                  />
                )}
              </div>
            </div>          
          </>
        }
      </div>
    </div>
  );
};