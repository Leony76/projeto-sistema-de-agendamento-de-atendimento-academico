import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpansibleImage from './ExpansibleImage';
import NoContent from './NoContent';
import type { UserGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';
import { USER_ROLES } from '@frontend/constants/maps/userRoles.map';
import { Select } from '../select';
import { Input } from '../input';
import { FaArrowCircleLeft, FaCalendarAlt, FaExclamation, FaFilter, FaUserAltSlash } from 'react-icons/fa';
import { STUDENT_APPOINTMENTS_FILTER_MAP, STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/userAppointments.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { Card } from '../card';
import { filterProfessorAppointments, filterStudentAppointments } from '@frontend/utils/filters/filterUserAppointments.filter.util';
import { Button } from '../button';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import { PROFESSOR_APPOINTMENTS_FILTER_MAP, PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/userAppointments.map.filter';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import { TiInfoLarge } from 'react-icons/ti';
import { UserService } from '@frontend/services/user.service';
import type { UserRole } from '@shared/types/userRole.type';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { useToast } from '@frontend/contexts/ToastContext';
import { STUDENT_SOLICITATIONS_FILTER_VALUE_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP, type STUDENT_SOLICITATIONS_FILTER_MAP, type STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP } from '@frontend/constants/maps/filters/userSolicitations.map.filter';
import { filterStudentSolicitations, filterStudentSolicitationsFromProfessorView } from '@frontend/utils/filters/filterUserSolicitations.filter.util';
import type { SelectOptionsSchema } from '@shared/types/selectOptionsSchema.type';

type SearchValue = {
  appointment   : string;
  solicitation  : string;
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

type FiltersByRole = Record<
  Exclude<UserRole, 'MANAGER'>, {
    appointments: {
      schema : SelectOptionsSchema,
      value  : string,
      setter : (value: any) => void;
    },
    solicitations: {
      schema : SelectOptionsSchema,
      value  : string,
      setter : (value: any) => void;
    },
  }
>;

type UserAppointmentsAndSolicitations<T> = Record<
  Exclude<UserRole, 'MANAGER'>, { appointments: T, solicitations: T }
>;

export const UserDetails = (): React.JSX.Element => {

  const { id, role } = useParams();
  const { toast } = useToast();

  const [ user, setUser ] = useState<UserGeneralInfosResponse | null>(null);
  const navigate = useNavigate();

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

  const [searchValue, setSearchValue] = useState<SearchValue>({
    appointment   : '',
    solicitation  : '',
  });

  const [userDetailsFilter, setUserDetailsFilter] = useState<FilterValue>({
    student   : { appointments: 'none', solicitations: 'none' },
    professor : { appointments: 'none', solicitations: 'none' },
  });

  const APPOINTMENTS_AND_SOLICITATIONS_BY_ROLE_MAP: UserAppointmentsAndSolicitations<any[]> = {
    STUDENT: {
      appointments: filterStudentAppointments(
        user?.role === 'STUDENT' ? user.appointments : [],
        searchValue.appointment,
        userDetailsFilter.student.appointments,
      ).map((rest) => ({ ...rest, from: 'STUDENT' as const })),

      solicitations: filterStudentSolicitations(
        user?.role === 'STUDENT' ? user.solicitations : [],
        searchValue.solicitation,
        userDetailsFilter.student.solicitations,
      ).map((rest) => ({ ...rest, from: 'STUDENT' as const })),
    },

    PROFESSOR: {
      appointments: filterProfessorAppointments(
        user?.role === 'PROFESSOR' ? user.appointments : [],
        searchValue.appointment,
        userDetailsFilter.professor.appointments,
      ).map((rest) => ({ ...rest, from: 'PROFESSOR' as const })),

      solicitations: filterStudentSolicitationsFromProfessorView(
        user?.role === 'PROFESSOR' ? user.solicitations : [],
        searchValue.solicitation,
        userDetailsFilter.professor.solicitations,
      ).map((rest) => ({ ...rest, from: 'PROFESSOR' as const })),
    },
  };

  const USER_NOT_FOUND_BY_FILTER_BY_ROLE_MAP: UserAppointmentsAndSolicitations<string> = {
    STUDENT   : {
      appointments  : STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[userDetailsFilter.student.appointments],
      solicitations : STUDENT_SOLICITATIONS_FILTER_VALUE_MAP[userDetailsFilter.student.solicitations],
    },

    PROFESSOR : {
      appointments  : PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP[userDetailsFilter.professor.appointments],
      solicitations : STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP[userDetailsFilter.professor.solicitations],
    }
  };

  const FILTERS_BY_ROLE_MAP: FiltersByRole = {
    STUDENT: {
      appointments: {
        schema : 'STUDENT_APPOINTMENTS_FILTER',
        value  : userDetailsFilter.student.appointments,
        setter : (value: FilterValue['student']['appointments']) => setUserDetailsFilter(prev => ({
          ...prev, student: { ...prev.student, appointments: value }
        })),
      },
      
      solicitations: {
        schema : 'STUDENT_SOLICITATIONS_FILTER',
        value  : userDetailsFilter.student.solicitations,
        setter : (value: FilterValue['student']['solicitations']) => setUserDetailsFilter(prev => ({
          ...prev, student: { ...prev.student, solicitations: value }
        })),
      },
    },

    PROFESSOR: {
      appointments: {
        schema : 'PROFESSOR_APPOINTMENTS_FILTER',
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
  };
  
  useEffect(() => {
    if (!id || !role) return;

    (async(id: number):Promise<void> => {
      try {
        const userRole = role.toLocaleUpperCase() as UserRole;

        const response = await UserService.getUserGeneralInfosById(
          userRole === 'MANAGER'     ? 'manager'
          : userRole === 'PROFESSOR' ? 'professor'
          : 'student', 
          id
        );
         
        setUser(response);
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })(Number(id));
  },[id]);

  let noAppointmentsContent  = undefined;

  if (user?.role && user.role !== 'MANAGER') {
    noAppointmentsContent = noContentFound(
      `Nenhum agendamento disponível no momento para esse(a) ${USER_ROLES[user.role].toLocaleLowerCase()}!`,
      USER_NOT_FOUND_BY_FILTER_BY_ROLE_MAP[user.role].appointments,
      searchValue.appointment,
      (
        userDetailsFilter.student.appointments !== 'none'   ||
        userDetailsFilter.professor.appointments !== 'none'
      ),
      {
        notFound   : FaPersonCircleQuestion,
        notContent : FaClipboardQuestion
      },
    );
  }

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
          uri  : user.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
          size : 'h-35 w-35', 
        }}
      />

      <div className='flex flex-col items-center'>
        <h3 className='text-orange-500 text-xl font-bold text-center break-all'>
          { user.name }
        </h3>        

        <label className='text-sm text-cyan-400 font-semibold tracking-wide'>
          { user.role === 'STUDENT' ? user.ra : user.email }
        </label>

        <label className='text-sm text-cyan-400'>
          { USER_ROLES[user.role] }
        </label>
      </div>
        
      <div className='w-full'>
        <div className='flex flex-col space-y-2'>
          <h3 className='flex self-center items-center text-cyan-500 text-lg font-semibold'>
            <TiInfoLarge size={22}/>
            Informações gerais
          </h3>

          <ul className='list-inside list-disc'>
            { user.role !== 'MANAGER' &&
              <>
                <li className='text-sm text-orange-400 font-semibold'>
                  Agendamentos: <span className='text-cyan-500 font-normal'>{ user.appointments.length ?? 'Nenhuma' }</span>
                </li>

                <li className='text-sm text-orange-400 font-semibold'>
                  Solicitações: <span className='text-cyan-500 font-normal'>{ user.appointments.filter((appointment) => appointment.status === 'PENDING').length || 'Nenhuma' }</span>
                </li>
              </>
            }

            { user.role === 'STUDENT' &&
              <li className='text-sm text-orange-400 font-semibold'>
                E-mail: <span className='text-cyan-500 font-normal'>{ user.email }</span>
              </li>
            }

            { user.role === 'PROFESSOR' &&
              <li className='text-sm text-orange-400 font-semibold'>
                Diciplina(s): <span className='text-cyan-500 font-normal'>{ formatter.format(user.disciplines) || 'Nenhuma' }</span>
              </li>
            }

            <li className='text-sm text-orange-400 font-semibold'>
              Data de cadastro: <span className='text-cyan-500 font-normal'>{ formatDateTime(user.registeredAt) }</span>
            </li>
          </ul>
        </div>

        { user.role !== 'MANAGER' &&  
          <>
            <div className='flex flex-col items-center mt-2 gap-3'>
              <h3 className='text-cyan-500 text-lg font-semibold flex items-center gap-1.5'>
                <FaCalendarAlt size={16}/>
                Agendamentos
              </h3>

              <div className='flex gap-2 w-full'>
                <Input.Search
                  onChange={(e) => setSearchValue(prev => ({ ...prev, appointment: e.target.value }))}
                  onClear={() => setSearchValue(prev => ({ ...prev, appointment: '' }))}
                  placeholder='Pesquisar...'
                  value={searchValue.appointment}
                  customStyle={{ input: 'flex-2' }}
                />

                <Select.Default
                  Icon={() => <FaFilter size={13}/>}
                  placeholder='Filtro'
                  optionsSchema={FILTERS_BY_ROLE_MAP[user.role].appointments.schema}
                  customStyle={{ options: { button: 'text-xs' } }}
                  value={FILTERS_BY_ROLE_MAP[user.role].appointments.value}
                  onSelect={(value) => FILTERS_BY_ROLE_MAP[user.role].appointments.setter(value as any)}
                />
              </div>

              <div className='flex-1 min-h-0 max-h-74 flex w-full flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
                { APPOINTMENTS_AND_SOLICITATIONS_BY_ROLE_MAP[user.role].appointments.length > 0 ? (
                  APPOINTMENTS_AND_SOLICITATIONS_BY_ROLE_MAP[user.role].appointments.map(( appointment ) => (
                    <Card.Appointment
                      smVersion
                      key={appointment.id}
                      { ...appointment }
                    />
                  ))
                ) : (
                  <NoContent
                    Icon={noAppointmentsContent?.Icon}
                    message={noAppointmentsContent?.message ?? 'Indisponível'}
                  />
                )}
              </div>
            </div>     

            <div className='flex flex-col items-center mt-2 gap-3'>
              <h3 className='text-cyan-500 text-lg font-semibold flex items-center gap-1.5'>
                <FaExclamation size={16}/>
                Solicitações
              </h3>

              <div className='flex gap-2 w-full'>
                <Input.Search
                  onChange={(e) => setSearchValue(prev => ({ ...prev, solicitation: e.target.value }))}
                  onClear={() => setSearchValue(prev => ({ ...prev, solicitation: '' }))}
                  placeholder='Pesquisar...'
                  value={searchValue.solicitation}
                  customStyle={{ input: 'flex-2' }}
                />

                <Select.Default
                  Icon={() => <FaFilter size={13}/>}
                  placeholder='Filtro'
                  optionsSchema={FILTERS_BY_ROLE_MAP[user.role].solicitations.schema}
                  customStyle={{ options: { button: 'text-xs' } }}
                  value={FILTERS_BY_ROLE_MAP[user.role].solicitations.value}
                  onSelect={(value) => FILTERS_BY_ROLE_MAP[user.role].solicitations.setter(value as any)}
                />
              </div>

              <div className='flex-1 min-h-0 max-h-74 flex w-full flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
                { APPOINTMENTS_AND_SOLICITATIONS_BY_ROLE_MAP[user.role].solicitations.length > 0 ? (
                  APPOINTMENTS_AND_SOLICITATIONS_BY_ROLE_MAP[user.role].solicitations.map(( solicitation ) => (
                    <Card.Solicitation
                      smVersion
                      key={solicitation.id}
                      { ...solicitation }
                    />
                  ))
                ) : (
                  <NoContent
                    Icon={noAppointmentsContent?.Icon}
                    message={noAppointmentsContent?.message ?? 'Indisponível'}
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