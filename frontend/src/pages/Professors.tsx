import { useEffect, useState } from "react";
import { dateTime } from "../utils/dateTime";
import { useToast } from "../contexts/ToastContext";
import { StudentListDTO } from "../types/dtos/studentListDTO";
import { FaClipboardQuestion, FaPlus } from "react-icons/fa6";
import { SearchProfessorsFilterValue } from "../maps/filters/searchProfessorsFilter";
import { ProfessorsListRegisteredTodayDTO } from "../types/dtos/professorsListRegisteredTodayDTO";

import NoAvailableContent from "../components/ui/NoAvailableContent";
import PaginationButtons from "../components/ui/PaginationButtons";
import { ProfessorForm } from "./components/Professors/form";
import ProfessorCard from "./components/Professors/ProfessorCard";
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/button/Button';
import Select from "../components/input/Select";
import Spinner from "../components/ui/Spinner";
import { Input } from "../components/input";

import style from './css/Professor.module.css';
import { StudentToBeEdited } from "../types/studentToBeEdited";
import { ProfessorService } from "../services/professor.service";
import { useLoadingState } from "../hooks/useLoadingState";
import { ProfessorPageModal } from "../types/modals/professorsPage.modal";
import { Modal } from "../components/modal";
import { StudentToBeRemoved } from "../types/studentToBeRemoved";

const Professors = () => {

  const { showToast } = useToast();
  const [pageLoading, setPageloading] = useState<boolean>(true); 
  const { loading, setLoading } = useLoadingState();

  // PROFESSORS LIST
  const [professors, setProfessors] = useState<StudentListDTO[]>([]);
  const [professorsListCount, setProfessorsListCount] = useState<number>(0);
  const [currentProfessorsListPage, setCurrentProfessorsListPage] = useState<number>(1);
  const [totalProfessorsListPages, setTotalProfessorsListPages] = useState<number>(1);

  // PROFESSORS REGISTERED TODAY LIST
  const [professorsRegisteredToday, setProfessorsRegisteredToday] = useState<ProfessorsListRegisteredTodayDTO[]>([]);
  const [registeredTodayProfessorsCount, setRegisteredTodayProfessorsCount] = useState<number>(0);
  const [currentProfessorsRegisteredTodayListPage, setCurrentProfessorsRegisteredTodayListPage] = useState<number>(1);
  const [totalProfessorsRegisteredTodayListPages, setTotalProfessorsRegisteredTodayListPages] = useState<number>(1);

  const [studentToBeEdited, setStudentToBeEdited] = useState<StudentToBeEdited | null>(null);
  const [studentToBeRemoved, setStudentToBeRemoved] = useState<StudentToBeRemoved | null>(null);

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<SearchProfessorsFilterValue>('unselected');

  const [studentForm, showStudentForm] = useState<"REGISTER" | "EDIT" | null>(null);
  const [activeModal, setActiveModal]  = useState<ProfessorPageModal | null>(null);

  const fetchAllData = async():Promise<void> => {
    setPageloading(true);

    try {
      const [
        professorsResponse,
        professorsRegisteredInTheDayResponse,
      ] = await Promise.all([
        ProfessorService.list(currentProfessorsListPage, search, filter),
        ProfessorService.registeredInTheDayList(currentProfessorsRegisteredTodayListPage),
      ]);
      
      setProfessors(professorsResponse.professorsList);
      setTotalProfessorsListPages(professorsResponse.totalPages);
      setProfessorsListCount(professorsResponse.total);

      setProfessorsRegisteredToday(professorsRegisteredInTheDayResponse.professorsRegisteredTodayList);
      setTotalProfessorsRegisteredTodayListPages(professorsRegisteredInTheDayResponse.totalProfessorsRegisteredTodayPages);
      setRegisteredTodayProfessorsCount(professorsRegisteredInTheDayResponse.totalProfessorsRegisteredTodayCount);
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Erro ao carregar listagem', 'ERROR');
    } finally {
      setPageloading(false); 
    }
  };

  const handleRemoveStudent = async(ra:string):Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await ProfessorService.remove(ra);
      fetchAllData();
      showToast(response, 'SUCCESS');
    } catch (error:any) {
      showToast(error.response?.data?.error || 'Houve um erro ao remover o usuário!', 'ERROR');
    } finally {
      setLoading(false);
      setActiveModal(null);
    }
  };

  useEffect(() => {
    fetchAllData();
  } , [
    currentProfessorsListPage, 
    currentProfessorsRegisteredTodayListPage, 
    filter, 
    search,
  ]);

  useEffect(() => {
    setCurrentProfessorsListPage(1);
  }, [filter, search]); 

  return (
    <AuthLayout tabSelected='PROFESSORS'>
      <div className={style.grid_container}>
        <div className={style.Professors_list_container}>  
          <h2>
            Professores
          </h2>

          <div className={style.search_filter_container}>
            <Button 
            className={style.add_student}
            buttonStyle={{
              fontSize: 'MD',
              border:   "XL",
              color:    'PRIMARY',
              filled:    true,
            }}
            icon={FaPlus}       
            onClick={() => showStudentForm('REGISTER')}
            >
              Cadastrar professor
            </Button>

            <Input.Search
              placeholder="Pesquisar por nome ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={style.search}
            />

            <Select 
              variant={"SEARCH"} 
              selectSchema={"SEARCH_PROFESSORS_FILTER"}
              value={filter}
              onChange={(e) => setFilter(e.target.value as SearchProfessorsFilterValue)}
              className={style.filter}
            />
          </div>

          <div className={style.Professors_list}>  
            <div className={style.overflow_container}>
              {pageLoading ? (
                <div className={style.loading_container}>
                  <Spinner
                    color="var(--secondary-color)"
                  />
                </div>
              ) : Professors.length > 0 ? (
                <>
                  {professors.map((professor) => (
                    <ProfessorCard
                      key={professor.ra}
                      variant={'MAIN_LIST'}
                      onClick={{ 
                        setActiveModal,
                        setStudentToBeEdited,
                        setStudentToBeRemoved,
                        showEditStudentInfoForm: () => showStudentForm('EDIT'),
                      }}
                      student={{
                        name:         professor.name,
                        email:        professor.email,
                        ra:           professor.ra,
                        registerDate: dateTime(professor.registeredAt),
                      }}
                    />
                  ))}

                  {(totalProfessorsListPages > 1) && (
                    <PaginationButtons
                      page={{
                        current:  currentProfessorsListPage,
                        total:    totalProfessorsListPages,
                        next:     setCurrentProfessorsListPage,
                        previous: setCurrentProfessorsListPage,
                      }}
                    />
                  )}
                </>
              ) : (
                <NoAvailableContent
                  icon={FaClipboardQuestion}
                  message={search 
                    ? `Nenhum resultado para '${search}'!` 
                    : "Nenhum professor cadastrado!"
                  }
                />
              )}
            </div>
          </div>
        </div>

        {studentForm === 'REGISTER' ? (
          <ProfessorForm.Register
            onClick={{ closeForm: () => showStudentForm(null)}}
            onSuccess={fetchAllData}
          />
        ) : (studentForm === 'EDIT' && studentToBeEdited) ? (
          <ProfessorForm.Edit
            onClick={{ closeForm: () => {
              showStudentForm(null);
              setStudentToBeEdited(null);
            }}}
            onSuccess={fetchAllData}
            initialData={studentToBeEdited}
          />
        ) : (
          <div className={style.registered_Professors_today_container}>
            <div className={style.registered_Professors_today}>
              <h3>
                Cadastrados hoje
              </h3>

              <div className={style.registered_Professors_today_list}>
                <div className={style.overflow_container}>
                  {pageLoading ? (
                    <div className={style.loading_container}>
                    <Spinner
                      color="var(--secondary-color)"
                    />
                  </div>
                  ) : professorsRegisteredToday.length > 0 ? (
                    <>
                      {ProfessorsRegisteredToday.map((student) => (
                        <ProfessorCard
                          key={student.ra}
                          variant="REGISTERED_TODAY"
                          student={{
                            name:  student.name,
                            email: student.email,
                            ra:    student.ra,
                          }}
                        />
                      ))}

                      {totalProfessorsRegisteredTodayListPages > 1 &&
                        <PaginationButtons
                          page={{
                            current:  currentProfessorsRegisteredTodayListPage,
                            total:    totalProfessorsRegisteredTodayListPages,
                            next:     setCurrentProfessorsRegisteredTodayListPage,
                            previous: setCurrentProfessorsRegisteredTodayListPage,
                          }}
                        />
                      }
                    </>              
                  ) : (
                    <NoAvailableContent
                      icon={FaClipboardQuestion}
                      message="Nenhum aluno cadastrado hoje!"
                    />
                  )}
                </div>         
              </div>
            </div>

            <div className={style.registered_Professors_count}>
              <h3>
                Estatísticas
              </h3>

              <div className={style.statistics_cards_container}>
                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Professores cadastrados hoje:
                    </label>
                    <span>
                      {registeredTodayProfessorsCount}
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Professores cadastrados:
                    </label>
                    <span>
                      {ProfessorsListCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {studentToBeRemoved && (
        <Modal.ConfimAction
          title={'Remover aluno'}
          message={`Tem certeza em remover ${studentToBeRemoved.name} do sistema?`}
          isOpen={activeModal === 'REMOVE_STUDENT'}
          loading={loading}
          onClick={{
            confirm    : () => handleRemoveStudent(studentToBeRemoved.ra),
            closeModal : () => {
              setActiveModal(null);
              setStudentToBeRemoved(null);
            }
          }}
        />
      )}
    </AuthLayout>
  )
}

export default Professors