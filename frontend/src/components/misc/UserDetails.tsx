import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExpansibleImage from './ExpansibleImage';
import NoContent from './NoContent';
import type { UserDetails as UserDetailsType } from '@/types/userDetails.type';
import { USER_ROLES } from '@/constants/maps/userRoles.map';
import { formatDateTime } from '@/utils/formats/formatDateTime.util';
import { Select } from '../select';
import { Input } from '../input';
import { FaFilter } from 'react-icons/fa';
import { STUDENT_APPOINTMENT_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentAppoitment.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { Card } from '../card';
import { filterProfessorAppointments } from '@/utils/filters/filterProfessorAppointments.util';
import { filterStudentAppointments } from '@/utils/filters/filterStudentAppointments.util';
import { filterStudentSolicitationsFromProfessorView } from '@/utils/filters/filterStudentSolicitationsFromProfessorView.util';
import { filterStudentSolicitations } from '@/utils/filters/filterStudentSolicitations.util';

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


export const UserDetails = (): React.JSX.Element => {
  const { id } = useParams();

  const [ user, setUser ] = useState<UserDetailsType | null>(null);

  const [appoitmentSearchValue, setAppoitmentSearchValue] = useState<string>('');
  const [appoitmentFilterValue, setAppoitmentFilterValue] = useState<string>('');

  const [solicitationSearchValue, setSolicitationSearchValue] = useState<string>('');
  const [solicitationFilterValue, setSolicitationFilterValue] = useState<string>('');

  const appointmentsByRole = {
    PROFESSOR: {
      appoitments: filterProfessorAppointments(
        user?.role === 'PROFESSOR' ? user.appointmentsList : [],
        appoitmentSearchValue,
        appoitmentFilterValue
      ),
      solicitations: filterStudentSolicitationsFromProfessorView(
        user?.role === 'PROFESSOR' ? user.solicitationsList : [],
        solicitationSearchValue,
        solicitationFilterValue,
      )
    },
    STUDENT: {
      appoitments: filterStudentAppointments(
        user?.role === 'STUDENT' ? user.appointmentsList : [],
        appoitmentSearchValue,
        appoitmentFilterValue
      ),
      solicitations: filterStudentSolicitations(
        user?.role === 'STUDENT' ? user.solicitationsList : [],
        solicitationSearchValue,
        solicitationFilterValue,
      ),
    },
  }
  
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

  if (!user) return <NoContent message='Usuário não encontrado'/>;

  return (
    <div className='overflow-y-auto flex flex-col items-center gap-2 p-4 border border-cyan-400 rounded-lg bg-cyan-100/20'>
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
                  onChange={(e) => setAppoitmentSearchValue(e.target.value)}
                  onClear={() => setAppoitmentSearchValue('')}
                  placeholder='Pesquisar por professor, status, sala ou motivo'
                  value={appoitmentSearchValue}
                  customStyle={{ input: 'flex-2' }}
                />

                <Select.Default
                  Icon={() => <FaFilter size={13}/>}
                  placeholder='Filtro'
                  optionsSchema='STUDENT_APPOINTMENT_FILTER'
                  customStyle={{ container: '', options: { button: 'text-xs' } }}
                  value={appoitmentFilterValue}
                  onSelect={setAppoitmentFilterValue}
                />
              </div>

              <div className='flex-1 min-h-0 max-h-57 flex w-full flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
                { appointmentsByRole[user.role].appoitments.length > 0 ? (
                  user.role === 'STUDENT' ? (
                    appointmentsByRole[user.role].appoitments.map(( appointment ) => (
                      <Card.SMAppointment
                        from='STUDENT'
                        key={appointment.id}
                        { ...appointment }
                      />
                    ))
                  ) : (
                    appointmentsByRole[user.role].appoitments.map(( appointment ) => (
                      <Card.SMAppointment
                        from='PROFESSOR'
                        key={appointment.id}
                        { ...appointment }
                      />                 
                    ))
                  )
                ) : (
                  <NoContent
                    Icon={(appoitmentSearchValue || appoitmentFilterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                    message={
                      appoitmentSearchValue && appoitmentFilterValue
                        ? `Nenhum resultado para "${appoitmentSearchValue}" com o filtro "${STUDENT_APPOINTMENT_FILTER_VALUE_MAP[appoitmentFilterValue as keyof typeof STUDENT_APPOINTMENT_FILTER_VALUE_MAP]}"`
                        : appoitmentSearchValue
                        ? `Nenhum resultado para "${appoitmentSearchValue}"`
                        : appoitmentFilterValue
                        ? `Nenhum resultado para o filtro "${STUDENT_APPOINTMENT_FILTER_VALUE_MAP[appoitmentFilterValue as keyof typeof STUDENT_APPOINTMENT_FILTER_VALUE_MAP]}"`
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
                  onChange={(e) => setSolicitationSearchValue(e.target.value)}
                  onClear={() => setSolicitationSearchValue('')}
                  placeholder='Pesquisar por professor, status, sala ou motivo'
                  value={solicitationSearchValue}
                  customStyle={{ input: 'flex-2' }}
                />

                <Select.Default
                  Icon={() => <FaFilter size={13}/>}
                  placeholder='Filtro'
                  optionsSchema='STUDENT_SOLICITATIONS_FILTER'
                  customStyle={{ container: '', options: { button: 'text-xs' } }}
                  value={solicitationFilterValue}
                  onSelect={setSolicitationFilterValue}
                />
              </div>

              <div className='flex-1 grid grid-cols-1 min-h-0 max-h-57 w-full flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
                { appointmentsByRole[user.role].solicitations.length > 0 ? (
                  user.role === 'STUDENT' ? (
                    appointmentsByRole[user.role].solicitations.map(( solicitation ) => (
                      <Card.SMSolicitation
                        from='STUDENT'
                        key={solicitation.id}
                        { ...solicitation }
                      />
                    ))
                  ) : (
                    appointmentsByRole[user.role].solicitations.map(( solicitation ) => (
                      <Card.SMSolicitation
                        from='PROFESSOR'
                        key={solicitation.id}
                        { ...solicitation }
                      />                 
                    ))
                  )
                ) : (
                  <NoContent
                    Icon={(appoitmentSearchValue || appoitmentFilterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                    message={
                      solicitationSearchValue && solicitationFilterValue
                        ? `Nenhum resultado para "${solicitationSearchValue}" com o filtro "${STUDENT_APPOINTMENT_FILTER_VALUE_MAP[solicitationFilterValue as keyof typeof STUDENT_APPOINTMENT_FILTER_VALUE_MAP]}"`
                        : solicitationSearchValue
                        ? `Nenhum resultado para "${solicitationSearchValue}"`
                        : solicitationSearchValue
                        ? `Nenhum resultado para o filtro "${STUDENT_APPOINTMENT_FILTER_VALUE_MAP[solicitationFilterValue as keyof typeof STUDENT_APPOINTMENT_FILTER_VALUE_MAP]}"`
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