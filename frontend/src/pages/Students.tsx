import { useEffect, useState } from "react";
import { dateTime } from "../utils/dateTime";
import { useToast } from "../contexts/ToastContext";
import { StudentListDTO } from "../types/dtos/studentListDTO";
import { FaClipboardQuestion, FaPlus } from "react-icons/fa6";
import { StudentListPromise } from "../types/promises/studentsListPromise";
import { SearchStudentsFilterValue } from "../maps/filters/searchStudentsFilter";
import { StudentListRegisteredTodayDTO } from "../types/dtos/studentsListRegisteredTodayDTO";
import { RegisteredTodayStudentsListPromise } from "../types/promises/registeredTodayStudentsListPromise";

import NoAvailableContent from "../components/ui/NoAvailableContent";
import PaginationButtons from "../components/ui/PaginationButtons";
import { StudentForm } from "./components/Students/form";
import StudentCard from "./components/Students/StudentCard";
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/button/Button';
import Select from "../components/input/Select";
import Spinner from "../components/ui/Spinner";
import Input from '../components/input/Input';
import axios from "axios";

import style from './css/Students.module.css';
import { StudentToBeEdited } from "../types/studentToBeEdited";

const Students = () => {

  const { showToast } = useToast();
  const [pageLoading, setPageloading] = useState<boolean>(true); 

  // STUDENTS LIST
  const [students, setStudents] = useState<StudentListDTO[]>([]);
  const [studentsListCount, setStudentsListCount] = useState<number>(0);
  const [currentStudentsListPage, setCurrentStudentsListPage] = useState<number>(1);
  const [totalStudentsListPages, setTotalStudentsListPages] = useState<number>(1);

  // STUDENTS REGISTERED TODAY LIST
  const [studentsRegisteredToday, setStudentsRegisteredToday] = useState<StudentListRegisteredTodayDTO[]>([]);
  const [registeredTodayStudentsCount, setRegisteredTodayStudentsCount] = useState<number>(0);
  const [currentStudentsRegisteredTodayListPage, setCurrentStudentsRegisteredTodayListPage] = useState<number>(1);
  const [totalStudentsRegisteredTodayListPages, setTotalStudentsRegisteredTodayListPages] = useState<number>(1);

  const [studentToBeEdited, setStudentToBeEdited] = useState<StudentToBeEdited | null>(null);

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<SearchStudentsFilterValue>('unselected');

  const [studentForm, showStudentForm] = useState<'REGISTER' | 'EDIT' | null>(null);

  const fetchAllData = async():Promise<void> => {
    setPageloading(true);

    const studentsListFetchURL = `http://localhost:3000/api/students/list?page=${currentStudentsListPage}&search=${search}&filter=${filter}`;
    const registeredTodaystudentsListFetchURL = `http://localhost:3000/api/students/registered-today-list?page=${currentStudentsRegisteredTodayListPage}`;

    try {
      const [
        studentsResponse,
        studentsRegisteredTodayResponse,
      ] = await Promise.all([
        axios.get<StudentListPromise>(studentsListFetchURL),
        axios.get<RegisteredTodayStudentsListPromise>(registeredTodaystudentsListFetchURL),
      ]);
      
      setStudents(studentsResponse.data.studentsList);
      setTotalStudentsListPages(studentsResponse.data.totalPages);
      setStudentsListCount(studentsResponse.data.total);

      setStudentsRegisteredToday(studentsRegisteredTodayResponse.data.studentsRegisteredTodayList);
      setTotalStudentsRegisteredTodayListPages(studentsRegisteredTodayResponse.data.totalStudentsRegisteredTodayPages);
      setRegisteredTodayStudentsCount(studentsRegisteredTodayResponse.data.totalStudentsRegisteredTodayCount);
    } catch (error: any) {
      showToast('Erro ao carregar listagem', 'ERROR');
    } finally {
      setPageloading(false); 
    }
  };

  const handleRemoveStudent = async(ra:string):Promise<void> => {

    const fetchURL = `http://localhost:3000/api/students/remove/${ra}`;

    try {
      const response = await axios.put(fetchURL, ra);

      showToast(response.data.success, 'SUCCESS');
    } catch (error:any) {
      showToast(error.response?.data?.error || 'Houve um erro ao remover o usuário!', 'ERROR');
    }
  };

  useEffect(() => {
    fetchAllData();
  } , [
    currentStudentsListPage, 
    currentStudentsRegisteredTodayListPage, 
    filter, 
    search,
  ]);

  useEffect(() => {
    setCurrentStudentsListPage(1);
  }, [filter, search]); 

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
              Cadastrar aluno
            </Button>

            <Input 
              variant="SEARCH"
              placeholder="Pesquisar por nome ou RA"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={style.search}
            />

            <Select 
              variant={"SEARCH"} 
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
              ) : students.length > 0 ? (
                <>
                  {students.map((student) => (
                    <StudentCard
                      key={student.ra}
                      variant={'MAIN_LIST'}
                      onClick={{ 
                        setStudentToBeEdited,
                        showEditStudentInfoForm: () => showStudentForm('EDIT'),
                        handleRemoveStudent,
                      }}
                      student={{
                        name:         student.name,
                        email:        student.email,
                        ra:           student.ra,
                        registerDate: dateTime(student.registeredAt),
                      }}
                    />
                  ))}

                  {(totalStudentsListPages > 1) && (
                    <PaginationButtons
                      page={{
                        current:  currentStudentsListPage,
                        total:    totalStudentsListPages,
                        next:     setCurrentStudentsListPage,
                        previous: setCurrentStudentsListPage,
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
                  ) : studentsRegisteredToday.length > 0 ? (
                    <>
                      {studentsRegisteredToday.map((student) => (
                        <StudentCard
                          key={student.ra}
                          variant="REGISTERED_TODAY"
                          student={{
                            name:  student.name,
                            email: student.email,
                            ra:    student.ra,
                          }}
                        />
                      ))}

                      {totalStudentsRegisteredTodayListPages > 1 &&
                        <PaginationButtons
                          page={{
                            current:  currentStudentsRegisteredTodayListPage,
                            total:    totalStudentsRegisteredTodayListPages,
                            next:     setCurrentStudentsRegisteredTodayListPage,
                            previous: setCurrentStudentsRegisteredTodayListPage,
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
                      Alunos cadastrados hoje:
                    </label>
                    <span>
                      {registeredTodayStudentsCount}
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Alunos cadastrados:
                    </label>
                    <span>
                      {studentsListCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default Students