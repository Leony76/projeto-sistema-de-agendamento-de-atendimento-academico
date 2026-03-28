import { dateTime } from "../utils/dateTime";
import { FaClipboardQuestion, FaPlus } from "react-icons/fa6";
import { SearchProfessorsFilterValue } from "../maps/filters/searchProfessorsFilter";
import { ProfessorsListRegisteredTodayDTO } from "../types/dtos/professorsListRegisteredTodayDTO";

import NoAvailableContent from "../components/ui/NoAvailableContent";
import PaginationButtons from "../components/ui/PaginationButtons";
import { ProfessorForm } from "./components/Professors/form";
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/button/Button';
import { Select } from "../components/select";
import Spinner from "../components/ui/Spinner";
import { Input } from "../components/input";

import style from './css/Professor.module.css';
import { ProfessorPageModal } from "../types/modals/professorsPage.modal";
import { Modal } from "../components/modal";
import { ProfessorListDTO } from "../types/dtos/professorListDTO";
import { ProfessorToBeEdited } from "../types/professorToBeEdited";
import { ProfessorToBeRemoved } from "../types/professorToBeRemoved";
import ListCard from "../components/ui/ListCard";
import { PROFESSOR_DISCIPLINES_MAP } from "../maps/professorDisciplinesMap";
import { UsersService } from "../services/users.service";
import { useUsersList } from "../hooks/useUsersList";

const Professors = () => {

  const ProfessorService = new UsersService<ProfessorListDTO, ProfessorsListRegisteredTodayDTO, "PROFESSOR">("PROFESSOR");

  const { 
    search,
    filter,
    loading,
    activeModal,
    pageLoading,
    setActiveModal,
    fetchAllData,
    setSearch,
    setFilter,
    overall               : professors,
    entityForm            : professorForm,
    entityToBeEdited      : professorToBeEdited,
    entityToBeRemoved     : professorToBeRemoved,
    registeredInTheDay    : professorsRegisteredInTheDay,
    setRegisteredInTheDay : setProfessorsRegisteredInTheDay,
    setEntityToBeRemoved  : setProfessorToBeRemoved,
    setEntityToBeEdited   : setProfessorToBeEdited,
    handleRemove          : handleRemoveProfessor,
    showEntityForm        : showProfessorForm,
    setOverall            : setProfessors,
  } = useUsersList<
    ProfessorListDTO,
    ProfessorsListRegisteredTodayDTO,
    ProfessorToBeEdited,
    ProfessorToBeRemoved,
    SearchProfessorsFilterValue,
    ProfessorPageModal
  >(ProfessorService, "PROFESSOR");

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

            <Select.Default 
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
              ) : professors.list.length > 0 ? (
                <>
                  {professors.list.map((professor) => (
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
                          setProfessorToBeRemoved({id: professor.id, name: professor.name});
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

                  {(professors.paginationTotalCount > 1) && (
                    <PaginationButtons
                      page={{
                        current  : professors.currentPaginationCount,
                        total    : professors.paginationTotalCount,
                        next     : () => setProfessors(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount + 1})),
                        previous : () => setProfessors(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount - 1})),
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
                  ) : professorsRegisteredInTheDay.list.length > 0 ? (
                    <>
                      {professorsRegisteredInTheDay.list.map((professor) => (
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

                      {professorsRegisteredInTheDay.paginationTotalCount > 1 &&
                        <PaginationButtons
                          page={{
                            current  : professorsRegisteredInTheDay.currentPaginationCount,
                            total    : professorsRegisteredInTheDay.paginationTotalCount,
                            next     : () => setProfessorsRegisteredInTheDay(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount + 1})),
                            previous : () => setProfessorsRegisteredInTheDay(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount - 1})),
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
                      {professorsRegisteredInTheDay.totalCount}
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Cadastrados:
                    </label>
                    <span>
                      {professors.totalCount}
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
              professorToBeRemoved.id, 
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