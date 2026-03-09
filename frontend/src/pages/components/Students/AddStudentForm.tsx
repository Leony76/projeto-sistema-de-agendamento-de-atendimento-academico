import { FaChevronLeft } from 'react-icons/fa6';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import style from '../../css/Students.module.css';

type Props = {
  onClick: {
    toggleShowForm: () => void;
  };
}

const AddStudentForm = ({ onClick }:Props) => {
  return (
    <div className={style.add_student_container}>
      <div className={style.title_switch_show_form_container}>
        <h3>
          Cadastrar aluno
        </h3>

        <FaChevronLeft onClick={onClick.toggleShowForm}/> 
      </div>

      <p>
        Insira as informações que os campos abaixo pedem para cadastrar um aluno no sistema!
      </p>

      <form>
        <Input 
          label={'Nome do aluno'}
          placeholder='hradsffs'
          variant="FORM"
          className={style.add_student_form}
        />
        <Input 
          label={'E-mail institucional'}
          placeholder='hradsffs'
          variant="FORM"
          className={style.add_student_form}
        />
        <Input 
          label={'Resgistro Acandêmico (RA)'}
          placeholder='hradsffs'
          variant="FORM"
          className={style.add_student_form}
        />

        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px'
        }}>
          <Button 
          buttonStyle={{
            fontSize: 'XL',
            border: "XL",
            color: 'SECONDARY',
            filled: false,
          }}>
            Cadastrar
          </Button>

          <p style={{fontSize: '11px'}}>
            Após o cadastro, o aluno cadastrado receberá um e-mail do primeiro acesso ao sistema e poderá acessá-lo com o RA cadastrado e uma senha provisória aleatóriamente gerada.
          </p>
        </div>
      </form>
    </div>
  )
}

export default AddStudentForm