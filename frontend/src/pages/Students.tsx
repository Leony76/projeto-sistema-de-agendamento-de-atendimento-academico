import { FaChevronLeft, FaPlus } from "react-icons/fa6";
import Button from '../components/button/Button';
import Input from '../components/input/Input';
import AuthLayout from '../components/layout/AuthLayout';
import style from './css/Students.module.css';
import { useState } from "react";
import Select from "../components/input/Select";
import StudentCard from "./components/Students/StudentCard";
import AddStudentForm from "./components/Students/AddStudentForm";

const Students = () => {

  const [addStudentForm, showAddStudentForm] = useState<boolean>(false);

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
              Adicionar aluno
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
              {[0,1,2,3,4,5].map((index) => (
                <StudentCard
                  variant={'MAIN_LIST'}
                  student={{
                    name: 'Leony Leandro Barros',
                    email: 'leonyleandrobarros@aluno.unifapce.edu.br',
                    ra: '20241180209',
                    registerDate: '09/03/26, 09:31'
                  }}
                />
              ))}
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
                  {[0,1,2,3,4].map((index) => (
                    <StudentCard
                      variant="REGISTERED_TODAY"
                      student={{
                        name: 'Leony Leandro Barros',
                        email: 'leonyleandrobarros@aluno.unifapce.edu.br',
                        ra: '20241180209',
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
                      232
                    </span>
                  </div>
                </div>

                <div className={style.statistic_card}>
                  <div>
                    <label>
                      Alunos cadastrados:
                    </label>
                    <span>
                      2322
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