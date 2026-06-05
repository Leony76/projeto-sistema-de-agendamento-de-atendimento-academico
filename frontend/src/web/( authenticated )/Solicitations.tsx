import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaExclamation, FaFilter } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import '@frontend/css/calendar.css';
import { filterStudentSolicitations, filterStudentSolicitationsFromProfessorView } from '@frontend/utils/filters/filterUserSolicitations.filter.util';
import NoContent from '@frontend/components/misc/NoContent';
import { STUDENT_SOLICITATIONS_FILTER_MAP, STUDENT_SOLICITATIONS_FILTER_VALUE_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP, STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/userSolicitations.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ScheduleService } from '@frontend/services/schedule.service';
import type { EditAppointmentSolicitationResponse, ProfessorAppointmentSolicitationResponse as ProfessorAppointmentSolicitation, StudentAppointmentSolicitationResponse as StudentAppointmentSolicitation } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { SolicitationDecision } from '@shared/types/solicitationDecision.type';
import { Modal } from '@frontend/components/modal';
import { type EditAppointmentSolicitationFormData } from '@shared/schemas/appointmentSolicitation.schema';
import { formatTime } from '@frontend/utils/formats/formatTime.util';
import { formatMergeDateWithTime } from '@frontend/utils/formats/formatMergeDateWithTime.util';

type ConfirmModals =
| 'CONFIRM_EDIT' 
| 'CONFIRM_PROFESSOR_DECISION' 
| 'CONFIRM_CANCEL'
| 'CONFIRM_REMOVE'
;

type Modals = ConfirmModals | 'EDIT';

type FilterValue = {
  student   : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'];
  professor : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'];
}

const Requests = ():React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>;

  const { toast } = useToast();

  const role = user.role === 'PROFESSOR'
    ? 'PROFESSOR'
    : 'STUDENT'
  ;

  const [refresh, setRefresh] = useState(0);

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<FilterValue>({
    professor : 'none',
    student   : 'none',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<Modals | null>(null);

  const [acceptOrDenyAppointmentDecision, setAcceptOrDenyAppointmentDecision] = useState<SolicitationDecision | null>(null);

  const [acceptOrDenyAppointmentId, setAcceptOrDenyAppointmentId] = useState<number | null>(null);
  const [editSolicitation, setEditSolicitation] = useState<StudentAppointmentSolicitation | null>(null);
  const [editedSolicitationData, setEditedSolicitationData] = useState<EditAppointmentSolicitationFormData | null>(null);
  const [cancelSolicitationId, setCancelSolicitationId] = useState<number | null>(null);
  const [removeSolicitationId, setRemoveSolicitationId] = useState<number | null>(null);
  
  const [pendingAppointments, setPendingAppointments] = useState<{
    fromStudent   : StudentAppointmentSolicitation[],
    fromProfessor : ProfessorAppointmentSolicitation[],
  }>({
    fromProfessor : [],
    fromStudent   : [],
  });

  const filteredSolicitationsByRole = {
    STUDENT: filterStudentSolicitations(
      pendingAppointments.fromStudent,
      searchValue,
      filterValue.student
    ).map(rest => ({ ...rest, from: 'STUDENT' as const })), 

    PROFESSOR: filterStudentSolicitationsFromProfessorView(
      pendingAppointments.fromProfessor,
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

  const labelsByRoleMap = {
    STUDENT: {
      mainTitle        : 'Minhas solicitações',
      searchBarMessage : 'Pesquisar por professor, disciplina(s), data, horário, motivo ou status da solicitação',
    },
    PROFESSOR: {
      mainTitle: 'Solicitações dos alunos',
      searchBarMessage: 'Pesquisar por aluno, data, horário, motivo ou status da solicitação',
    }
  } as const;
  
  const noContent = noContentFound(
    'Nenhuma solicitação no momento!',
    noHistoryFoundFilterByRoleMap[role],
    searchValue,
    filterValue && (
      filterValue.professor !== 'none' || 
      filterValue.student !== 'none'
    ),
    {
      notFound   : FaPersonCircleQuestion,
      notContent : FaClipboardQuestion
    },
  );

  const handleAcceptOrDenyAppointmentRequest = async(decision: SolicitationDecision, appointmentId: number): Promise<void> => {
    try {
      setLoading(true);

      const response = await ScheduleService.acceptOrDenyAppointmentSolicitation(appointmentId, decision);

      if (response.success) {
        toast(response.message);
        console.log(response.data);
        
        setRefresh(prev => prev + 1);
        setModal(null);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveAppointmentSolicitation = async(appointmentId: number): Promise<void> => {
    try {
      setLoading(true);

      const response = await ScheduleService.removeSolicitation(appointmentId);

      if (response.success) {
        toast(response.message);
        console.log(response.data);
        
        setRefresh(prev => prev + 1);
        setModal(null);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleEditAppointmentSolicitation = async(data: EditAppointmentSolicitationFormData): Promise<void> => {
    try {
      setLoading(true);

      const dateTime = formatMergeDateWithTime(data.appointmentDate, data.hour);

      const payload: EditAppointmentSolicitationResponse = {
        appointmentId : data.appointmentId,
        reason        : data.reason,
        dateTime,
      };

      const response = await ScheduleService.editAppointment(payload);

      if (response.success) {
        toast(response.message);
        console.log(response.data);
        setModal(null); 

        setRefresh(prev => prev + 1);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleCancelAppointmentSolicitation = async(solicitationId: number): Promise<void> => {
    try {
      setLoading(false);

      const response = await ScheduleService.cancelAppointment(solicitationId);

      if (response.success) {
        toast(response.message);
        console.log(response.data);
        setModal(null); 

        setRefresh(prev => prev + 1);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  const MODAL_CONFIRM_MAP: Record<ConfirmModals, {
    message        : string,
    visible        : boolean,
    onCloseRequest : () => void,
    onAccept       : () => void,
  }> = {
    CONFIRM_PROFESSOR_DECISION: {
      visible        : modal === 'CONFIRM_PROFESSOR_DECISION',
      onAccept       : () => {
        if (!acceptOrDenyAppointmentId) return;
        handleAcceptOrDenyAppointmentRequest(acceptOrDenyAppointmentDecision as SolicitationDecision, acceptOrDenyAppointmentId)
      },
      onCloseRequest : () => {
        setAcceptOrDenyAppointmentDecision(null);
        setModal(null);
      },
      message : acceptOrDenyAppointmentDecision === 'ACCEPTED'
        ? 'Tem certeza em aceitar essa solicitação ?'
        : 'Tem certeza em rejeitar essa solicitação ?'       
    },

    CONFIRM_CANCEL: {
      visible        : modal === 'CONFIRM_CANCEL',
      message        : 'Tem certeza em cancelar essa solicitação?',
      onAccept       : () => {
        if (!cancelSolicitationId) return;
        handleCancelAppointmentSolicitation(cancelSolicitationId);
      },
      onCloseRequest : () => {
        setCancelSolicitationId(null);
        setModal(null);
      },
    },

    CONFIRM_EDIT: {
      visible        : modal === 'CONFIRM_EDIT',
      message        : 'Tem certeza em editar essa solicitação?',
      onAccept: () => {
        if (!editedSolicitationData) return;
        handleEditAppointmentSolicitation(editedSolicitationData);
      },
      onCloseRequest : () => {
        setEditedSolicitationData(null);
        setModal('EDIT');
      },
    },

    CONFIRM_REMOVE: {
      visible        : modal === 'CONFIRM_REMOVE',
      message        : 'Tem certeza em apagar essa solicitação?',
      onAccept       : () => {
        if (!removeSolicitationId) return;
        handleRemoveAppointmentSolicitation(removeSolicitationId);
      },
      onCloseRequest : () => {
        setRemoveSolicitationId(null);
        setModal(null);
      },
    },
  };


  useEffect(() => {
    (async() => {
      try {
        switch (role) {
          case 'STUDENT':
            const studentSolicitations = await ScheduleService.getUserAppointmentSolicitations<'STUDENT'>();
            setPendingAppointments(prev => ({ ...prev, fromStudent: studentSolicitations }))
            break;
          default:
            const professorSolicitations = await ScheduleService.getUserAppointmentSolicitations<'PROFESSOR'>();
            setPendingAppointments(prev => ({ ...prev, fromProfessor: professorSolicitations }))
            break;
        }      
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();
  }, [refresh]);

  return (
    <Layout 
    selectedTab='REQUESTS'
    from={user.role}
    >
      {modal && modal !== 'EDIT' &&
        <Modal.ConfirmAction
          title='Confirmar ação'
          loading={loading}
          visible={MODAL_CONFIRM_MAP[modal as ConfirmModals].visible}
          message={MODAL_CONFIRM_MAP[modal as ConfirmModals].message}
          onAccept={MODAL_CONFIRM_MAP[modal as ConfirmModals].onAccept}
          onCloseRequest={MODAL_CONFIRM_MAP[modal as ConfirmModals].onCloseRequest}
        />
      }

      { editSolicitation &&  
        <Modal.EditAppointment
          title="Editar solicitação"
          visible={modal === 'EDIT'}
          initialData={{
            appointmentId   : editSolicitation.id,
            appointmentDate : editSolicitation.dateTime,
            hour            : formatTime(editSolicitation.dateTime),
            reason          : editSolicitation.reason,
          }}
          professor={{
            id            : editSolicitation.professor.id,
            availableDays : editSolicitation.professor.availableDays,
          }}
          onRequestClose={() => {
            setEditSolicitation(null);
            setModal(null);
          }}
          onEdit={(data) => {
            setEditedSolicitationData({...data, appointmentId: editSolicitation.id });
            setModal('CONFIRM_EDIT');
          }}
        />
      }

      <div className={`grid gap-x-3 h-full min-h-0 grid-cols-1 mx-15`}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='flex items-center gap-1 self-center font-semibold text-lg text-cyan-500'>
              <FaExclamation />
              { labelsByRoleMap[role].mainTitle }
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder={labelsByRoleMap[role].searchBarMessage}
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
                  ${ user.role === 'STUDENT' ? 'grid-cols-2' : 'grid-cols-1' }
                `}>
                    {filteredSolicitationsByRole[role].map(( solicitation ) => (
                      <Card.Solicitation
                        key={solicitation.id}
                        { ...solicitation  }            
                        onClick={{
                          remove: (appointmentId) => {
                            setModal('CONFIRM_REMOVE');
                            setRemoveSolicitationId(appointmentId);
                          },
                          cancel: (appointmentId) => {
                            setModal('CONFIRM_CANCEL');
                            setCancelSolicitationId(appointmentId);
                          },
                          edit: (appointmentId) => {
                            const solicitation = pendingAppointments.fromStudent.find(
                              solicitation => solicitation.id === appointmentId
                            );

                            if (!solicitation) return;

                            setEditSolicitation(solicitation);

                            setModal('EDIT');
                          },
                          professorDecision: {
                            accept: (appointmentId) => {
                              setModal('CONFIRM_PROFESSOR_DECISION');
                              setAcceptOrDenyAppointmentDecision('ACCEPTED');
                              setAcceptOrDenyAppointmentId(appointmentId);
                            },
                            reject: (appointmentId) => {
                              setModal('CONFIRM_PROFESSOR_DECISION');
                              setAcceptOrDenyAppointmentDecision('REJECTED');
                              setAcceptOrDenyAppointmentId(appointmentId);
                            }
                          }
                        }}
                      />
                    ))}                
                </div>
              ) : (
                <NoContent
                  Icon={noContent.Icon}
                  message={noContent.message}
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