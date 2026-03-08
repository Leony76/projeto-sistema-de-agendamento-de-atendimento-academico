import { FaChevronLeft, FaPlus } from "react-icons/fa6";
import Button from '../components/button/Button';
import Input from '../components/input/Input';
import AuthLayout from '../components/layout/AuthLayout';
import style from './css/Students.module.css';
import { useState } from "react";
import Select from "../components/input/Select";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

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
              border: "XL",
              color: 'SECONDARY',
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
   
            <div className={style.student}>
              <div className={style.left_container}>
                <span className={style.name}>
                  Leony Leandro Barros
                </span>

                <span className={style.ra}>
                  RA: <span className={style.value}> 20241180209</span>
                </span>

                <span className={style.email}>
                  E-mail institucional: <span className={style.value}> leonyleandrobarros@aluno.unifapce.edu.br</span>
                </span>

                <span className={style.register_data}>
                  Data de cadastro: <span className={style.value}> 08/03/26, 17:00</span>
                </span>
              </div>

              <div className={style.right_container}>
                <Button
                buttonStyle={{
                  border: "MD",
                  color: 'SECONDARY',
                  filled: true,
                }}
                icon={MdEdit}>
                  Editar informações
                </Button>

                <Button
                buttonStyle={{
                  border: "MD",
                  color: 'SECONDARY',
                  filled: true,
                }}
                icon={FaTrashAlt}>
                  Remover aluno
                </Button>
              </div>
            </div>
          </div>
        </div>

        {addStudentForm ? (
          <div className={style.add_student_container}>
            <div className={style.title_switch_show_form_container}>
              <h3>
                Cadastrar aluno
              </h3>

              <FaChevronLeft onClick={() => showAddStudentForm(false)}/> 
            </div>

            <p>
              Insira as informações que os campos abaixo pedem para cadastrar um aluno no sistema!
            </p>

            <form>
              <Input 
                label={'Nome do aluno'}
                placeholder='hradsffs'
                variant="FORM"
              />
              <Input 
                label={'E-mail institucional'}
                placeholder='hradsffs'
                variant="FORM"
              />
              <Input 
                label={'Resgistro Acandêmico (RA)'}
                placeholder='hradsffs'
                variant="FORM"
              />

              <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px'
              }}>
                <Button 
                buttonStyle={{
                  border: "XL",
                  color: 'PRIMARY',
                  filled: true,
                }}>
                  Cadastrar
                </Button>

                <p style={{fontSize: '11px'}}>
                  Após o cadastro, o aluno cadastrado receberá um e-mail do primeiro acesso ao sistema e poderá acessá-lo com o RA cadastrado e uma senha provisória aleatóriamente gerada.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className={style.registered_students_today_container}>
            <div className={style.registered_students_today}>

            </div>
            <div className={style.registered_students_count}>

            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default Students