import { dateTime } from "../utils/dateTime";
import { StudentListDTO } from "../types/dtos/studentListDTO";
import { FaClipboardQuestion, FaPlus } from "react-icons/fa6";
import { SearchStudentsFilterValue } from "../maps/filters/searchStudentsFilter";
import { StudentListRegisteredTodayDTO } from "../types/dtos/studentsListRegisteredTodayDTO";

import NoAvailableContent from "../components/ui/NoAvailableContent";
import PaginationButtons from "../components/ui/PaginationButtons";
import { StudentForm } from "./components/Students/form";
import  ListCard from "../components/ui/ListCard";
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/button/Button';
import { Select } from "../components/select";
import Spinner from "../components/ui/Spinner";
import { Input } from "../components/input";

import style from './css/Students.module.css';
import { StudentToBeEdited } from "../types/studentToBeEdited";
import { StudentsPageModal } from "../types/modals/studentsPage.modal";
import { Modal } from "../components/modal";
import { StudentToBeRemoved } from "../types/studentToBeRemoved";
import { useUsersList } from "../hooks/useUsersList";
import { UsersService } from "../services/users.service";

const Students = () => {

  const StudentService = new UsersService<StudentListDTO, StudentListRegisteredTodayDTO, "STUDENT">("STUDENT");

  const { 
    filter,
    search,
    activeModal,
    pageLoading,
    setActiveModal,
    fetchAllData,
    setFilter,
    setSearch,
    loading,
    overall               : students,
    entityForm            : studentForm,
    entityToBeEdited      : studentToBeEdited,
    entityToBeRemoved     : studentToBeRemoved,
    registeredInTheDay    : studentsRegisteredInTheDay,
    setRegisteredInTheDay : setStudentsRegisteredInTheDay,
    setEntityToBeRemoved  : setStudentToBeRemoved,
    setEntityToBeEdited   : setStudentToBeEdited,
    handleRemove          : handleRemoveStudent,
    showEntityForm        : showStudentForm,
    setOverall            : setStudents,
  } = useUsersList<
    StudentListDTO,
    StudentListRegisteredTodayDTO,
    StudentToBeEdited,
    StudentToBeRemoved,
    SearchStudentsFilterValue,
    StudentsPageModal
  >(StudentService, "STUDENT");

  return (
    <AuthLayout tabSelected='STUDENTS'>
      <div className={style.grid_container}>
        <div className={style.students_list_container}>  
          <h2>
            Alunos
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
              Cadastrar
            </Button>

            <Input.Search
              placeholder="Pesquisar por nome ou RA"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={style.search}
            />

            <Select.Default 
              selectSchema={"SEARCH_STUDENTS_FILTER"}
              value={filter}
              onChange={(e) => setFilter(e.target.value as SearchStudentsFilterValue)}
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
              ) : students.list.length > 0 ? (
                <>
                  {students.list.map((student) => (
                    <ListCard
                      smTexts={false}
                      crudActions
                      key={student.ra}
                      onClick={{
                        toEdit: () => { 
                          setStudentToBeEdited(student);
                          showStudentForm('EDIT');
                        }, 
                        toRemove: () => {
                          setActiveModal('REMOVE_STUDENT');
                          setStudentToBeRemoved({id: student.id, name: student.name});
                        }
                      }}
                      title={student.name}
                      items={[
                        {label: 'RA'               , value: student.ra           },
                        {label: 'E-mail'           , value: student.email        },
                        {label: 'Data de cadastro' , value: dateTime(student.registeredAt) },
                      ]}
                    />
                  ))}

                  {(students.paginationTotalCount > 1) && (
                    <PaginationButtons
                      page={{
                        current  : students.currentPaginationCount,
                        total    : students.paginationTotalCount,
                        next     : () => setStudents(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount + 1})),
                        previous : () => setStudents(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount - 1})),
                      }}
                    />
                  )}
                </>
              ) : (
                <NoAvailableContent
                  icon={FaClipboardQuestion}
                  message={search 
                    ? `Nenhum resultado para '${search}'!` 
                    : "Nenhum aluno cadastrado!"
                  }
                />
              )}
            </div>
          </div>
        </div>

        {studentForm === 'REGISTER' ? (
          <StudentForm.Register
            onClick={{ closeForm: () => showStudentForm(null)}}
            onSuccess={fetchAllData}
          />
        ) : (studentForm === 'EDIT' && studentToBeEdited) ? (
          <StudentForm.Edit
            onClick={{ closeForm: () => {
              showStudentForm(null);
              setStudentToBeEdited(null);
            }}}
            onSuccess={fetchAllData}
            initialData={studentToBeEdited}
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
                  ) : studentsRegisteredInTheDay.list.length > 0 ? (
                    <>
                      {studentsRegisteredInTheDay.list.map((student) => (
                        <ListCard
                          smTexts
                          crudActions={false}
                          key={student.ra}
                          title={student.name}
                          items={[
                            {label : 'E-mail', value: student.email},
                            {label : 'RA', value: student.ra},
                          ]}
                        />
                      ))}

                      {studentsRegisteredInTheDay.paginationTotalCount > 1 &&
                        <PaginationButtons
                          page={{
                            current  : studentsRegisteredInTheDay.currentPaginationCount,
                            total    : studentsRegisteredInTheDay.paginationTotalCount,
                            next     : () => setStudentsRegisteredInTheDay(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount + 1})),
                            previous : () => setStudentsRegisteredInTheDay(prev => ({...prev, currentPaginationCount: prev.currentPaginationCount - 1})),
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
                      {studentsRegisteredInTheDay.totalCount}
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Cadastrados:
                    </label>
                    <span>
                      {students.totalCount}
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
            confirm    : () => handleRemoveStudent(studentToBeRemoved.id),
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

export default Students