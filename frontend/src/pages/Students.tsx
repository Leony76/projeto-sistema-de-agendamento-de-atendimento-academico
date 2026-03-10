import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa6";
import Button from '../components/button/Button';
import Input from '../components/input/Input';
import AuthLayout from '../components/layout/AuthLayout';
import style from './css/Students.module.css';
import { useEffect, useState } from "react";
import Select from "../components/input/Select";
import StudentCard from "./components/Students/StudentCard";
import AddStudentForm from "./components/Students/AddStudentForm";
import { StudentListDTO } from "../types/dtos/studentListDTO";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";
import { dateTime } from "../utils/DateTime";

const Students = () => {

  const [addStudentForm, showAddStudentForm] = useState<boolean>(false);
  const [students, setStudents] = useState<StudentListDTO[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { showToast } = useToast();

  useEffect(() => {
    const getRegisteredStudentsList = async () => {
      try {
        const response = await axios.get<{
          studentsList: StudentListDTO[], 
          totalPages: number 
        }>(`http://localhost:3000/students-list?page=${currentPage}`);
        
        setStudents(response.data.studentsList);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        showToast('Erro ao carregar listagem', 'ERROR');
      }
    };

    getRegisteredStudentsList();
  }, [currentPage]); 

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
              border: "XL",
              color: 'PRIMARY',
              filled: true,
            }}
            icon={FaPlus}       
            onClick={() => showAddStudentForm(true)}
            >
              Cadastrar aluno
            </Button>

            <Input 
              label={"Perquisar"} 
              variant="SEARCH"
              placeholder="Pesquisar"
              className={style.search}
            />

            <Select 
              variant={"SEARCH"} 
              selectSchema={"SEARCH_STUDENTS_FILTER"}
              className={style.filter}
            />
          </div>

          <div className={style.students_list}>  
            <div className={style.overflow_container}>
              {students.map((student) => (
                <StudentCard
                  variant={'MAIN_LIST'}
                  student={{
                    name:         student.name,
                    email:        student.email,
                    ra:           student.ra,
                    registerDate: dateTime(student.registeredAt),
                  }}
                />
              ))}

              {(totalPages > 1) && (
                <div className={style.pagination_container}>
                  {currentPage !== 1 &&
                    <Button 
                    className={style.return}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    buttonStyle={{
                      border: "MD",
                      fontSize: "MD",
                      color: "PRIMARY",
                      filled: false
                    }}
                    >
                      <FaArrowLeft />
                      Anterior
                    </Button>
                  }
                  
                  <span>
                    {currentPage} / {totalPages}
                  </span>

                  <Button
                  className={style.proceed}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)} 
                  buttonStyle={{
                    border: "MD",
                    fontSize: "MD",
                    color: "PRIMARY",
                    filled: false
                  }}
                  >
                    Próximo
                    <FaArrowRight />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {addStudentForm ? (
          <AddStudentForm
            onClick={{ toggleShowForm: () => showAddStudentForm(false) }}
          />
        ) : (
          <div className={style.registered_students_today_container}>
            <div className={style.registered_students_today}>
              <h3>
                Registrados hoje
              </h3>

              <div className={style.registered_students_today_list}>
                <div className={style.overflow_container}>
                  {students.map((student) => (
                    <StudentCard
                      variant="REGISTERED_TODAY"
                      student={{
                        name:  student.name,
                        email: student.email,
                        ra:    student.ra,
                      }}
                    />
                  ))}
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
                      {students.length}
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Alunos cadastrados:
                    </label>
                    <span>
                      {students.length}
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