import Button from '../components/button/Button';
import Input from '../components/input/Input';
import AuthLayout from '../components/layout/AuthLayout';
import style from './css/Students.module.css';

const Students = () => {

  return (
    <AuthLayout tabSelected='STUDENTS'>
      <div className={style.grid_container}>
        <div className={style.students_list_container}>

        </div>
        <div className={style.add_student_container}>
          <h3>
            Cadastrar aluno
          </h3>

          <p>
            Insira as informações que os campos abaixo pedem para cadastrar um aluno no sistema!
          </p>

          <form>
            <Input 
              label={'Nome do aluno'}
              placeholder='hradsffs'
            />
            <Input 
              label={'E-mail institucional'}
              placeholder='hradsffs'
            />
            <Input 
              label={'Resgistro Acandêmico (RA)'}
              placeholder='hradsffs'
            />

            <Button 
            buttonType={'mainButton'}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Students