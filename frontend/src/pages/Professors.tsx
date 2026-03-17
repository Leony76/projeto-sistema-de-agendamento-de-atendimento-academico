import { useEffect, useState } from "react";
import { dateTime } from "../utils/dateTime";
import { useToast } from "../contexts/ToastContext";
import { FaClipboardQuestion, FaPlus } from "react-icons/fa6";
import { SearchProfessorsFilterValue } from "../maps/filters/searchProfessorsFilter";
import { ProfessorsListRegisteredTodayDTO } from "../types/dtos/professorsListRegisteredTodayDTO";

import NoAvailableContent from "../components/ui/NoAvailableContent";
import PaginationButtons from "../components/ui/PaginationButtons";
import { ProfessorForm } from "./components/Professors/form";
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/button/Button';
import Select from "../components/select/Select";
import Spinner from "../components/ui/Spinner";
import { Input } from "../components/input";

import style from './css/Professor.module.css';
import { ProfessorService } from "../services/professor.service";
import { useLoadingState } from "../hooks/useLoadingState";
import { ProfessorPageModal } from "../types/modals/professorsPage.modal";
import { Modal } from "../components/modal";
import { ProfessorListDTO } from "../types/dtos/professorListDTO";
import { ProfessorToBeEdited } from "../types/professorToBeEdited";
import { ProfessorToBeRemoved } from "../types/professorToBeRemoved";
import ListCard from "../components/ui/ListCard";
import { PROFESSOR_DISCIPLINES_MAP } from "../maps/professorDisciplinesMap";

const Professors = () => {

  const { showToast } = useToast();
  const [pageLoading, setPageloading] = useState<boolean>(true); 
  const { loading, setLoading } = useLoadingState();

  // PROFESSORS LIST
  const [professors, setProfessors] = useState<ProfessorListDTO[]>([]);
  const [professorsListCount, setProfessorsListCount] = useState<number>(0);
  const [currentProfessorsListPage, setCurrentProfessorsListPage] = useState<number>(1);
  const [totalProfessorsListPages, setTotalProfessorsListPages] = useState<number>(1);

  // PROFESSORS REGISTERED TODAY LIST
  const [professorsRegisteredToday, setProfessorsRegisteredToday] = useState<ProfessorsListRegisteredTodayDTO[]>([]);
  const [registeredTodayProfessorsCount, setRegisteredTodayProfessorsCount] = useState<number>(0);
  const [currentProfessorsRegisteredTodayListPage, setCurrentProfessorsRegisteredTodayListPage] = useState<number>(1);
  const [totalProfessorsRegisteredTodayListPages, setTotalProfessorsRegisteredTodayListPages] = useState<number>(1);

  const [professorToBeEdited, setProfessorToBeEdited] = useState<ProfessorToBeEdited | null>(null);
  const [professorToBeRemoved, setProfessorToBeRemoved] = useState<ProfessorToBeRemoved | null>(null);

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<SearchProfessorsFilterValue>('unselected');

  const [professorForm, showProfessorForm] = useState<"REGISTER" | "EDIT" | null>(null);
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
      
      setProfessors(professorsResponse.professors.list);
      setTotalProfessorsListPages(professorsResponse.professors.pages.total);
      setProfessorsListCount(professorsResponse.professors.totalCount);

      setProfessorsRegisteredToday(professorsRegisteredInTheDayResponse.professors.list);
      setTotalProfessorsRegisteredTodayListPages(professorsRegisteredInTheDayResponse.professors.pages.total);
      setRegisteredTodayProfessorsCount(professorsRegisteredInTheDayResponse.professors.totalCount);
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Erro ao carregar listagem', 'ERROR');
    } finally {
      setPageloading(false); 
    }
  };

  const handleRemoveProfessor = async(
    email : string,
  ):Promise<void> => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await ProfessorService.remove(email);
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
        <div className={style.students_list_container}>  
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
            onClick={() => showProfessorForm('REGISTER')}
            >
              Cadastrar
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

          <div className={style.students_list}>  
            <div className={style.overflow_container}>
              {pageLoading ? (
                <div className={style.loading_container}>
                  <Spinner
                    color="var(--secondary-color)"
                  />
                </div>
              ) : professors.length > 0 ? (
                <>
                  {professors.map((professor) => (
                    <ListCard
                      smTexts={false}
                      crudActions
                      key={professor.email}
                      onClick={{
                        toEdit: () => { 
                          setProfessorToBeEdited(professor);
                          showProfessorForm('EDIT');
                        }, 
                        toRemove: () => {
                          setActiveModal('REMOVE_PROFESSOR');
                          setProfessorToBeRemoved({email: professor.email, name: professor.name});
                        }
                      }}
                      title={professor.name}
                      items={[
                        {label: 'Diciplina'        , value: PROFESSOR_DISCIPLINES_MAP[professor.discipline]},
                        {label: 'E-mail'           , value: professor.email},
                        {label: 'Data de cadastro' , value: dateTime(professor.registeredAt)},
                      ]}
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

        {professorForm === 'REGISTER' ? (
          <ProfessorForm.Register
            onClick={{ closeForm: () => showProfessorForm(null)}}
            onSuccess={fetchAllData}
          />
        ) : (professorForm === 'EDIT' && professorToBeEdited) ? (
          <ProfessorForm.Edit
            onClick={{ closeForm: () => {
              showProfessorForm(null);
              setProfessorToBeEdited(null);
            }}}
            onSuccess={fetchAllData}
            initialData={professorToBeEdited}
          />
        ) : (
          <div className={style.registered_students_today_container}>
            <div className={style.registered_students_today}>
              <h3>
                Cadastrados hoje
              </h3>

              <div className={style.registered_students_today_list}>
                <div className={style.overflow_container}>
                  {pageLoading ? (
                    <div className={style.loading_container}>
                    <Spinner
                      color="var(--secondary-color)"
                    />
                  </div>
                  ) : professorsRegisteredToday.length > 0 ? (
                    <>
                      {professorsRegisteredToday.map((professor) => (
                        <ListCard
                          key={professor.email}
                          title={professor.name} 
                          crudActions={false} 
                          smTexts                        
                          items={[
                            {label: 'E-mail'     , value: professor.email},
                            {label: 'Disciplina' , value: PROFESSOR_DISCIPLINES_MAP[professor.discipline]},
                          ]} 
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
                      message="Nenhum professor cadastrado hoje!"
                    />
                  )}
                </div>         
              </div>
            </div>

            <div className={style.registered_students_count}>
              <h3>
                Estatísticas
              </h3>

              <div className={style.statistics_cards_container}>
                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Cadastrados hoje:
                    </label>
                    <span>
                      {registeredTodayProfessorsCount}
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Cadastrados:
                    </label>
                    <span>
                      {professorsListCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {professorToBeRemoved && (
        <Modal.ConfimAction
          title={'Remover professor'}
          message={`Tem certeza em remover ${professorToBeRemoved.name} do sistema?`}
          isOpen={activeModal === 'REMOVE_PROFESSOR'}
          loading={loading}
          onClick={{
            confirm : () => handleRemoveProfessor(
              professorToBeRemoved.email, 
            ),
            closeModal : () => {
              setActiveModal(null);
              setProfessorToBeRemoved(null);
            }
          }}
        />
      )}
    </AuthLayout>
  )
}

export default Professors