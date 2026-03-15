import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import Button from '../../../components/button/Button';
import style from '../../css/Students.module.css';
import { StudentToBeEdited } from '../../../types/studentToBeEdited';
import { StudentsPageModal } from '../../../types/modals/studentsPage.modal';
import { StudentToBeRemoved } from '../../../types/studentToBeRemoved';

type RegistedStudentsTodayListProps = {
  name: string;
  ra: string;
  email: string;
}

type MainStudentsListProps = | RegistedStudentsTodayListProps & {
  registerDate: string;
}

type Props = {
  variant: 'MAIN_LIST';
  student: MainStudentsListProps;
  onClick: {
    setStudentToBeEdited    : React.Dispatch<React.SetStateAction<StudentToBeEdited | null>>;
    setStudentToBeRemoved   : React.Dispatch<React.SetStateAction<StudentToBeRemoved | null>>;
    showEditStudentInfoForm : () => void;
    setActiveModal          : React.Dispatch<React.SetStateAction<StudentsPageModal | null>>;
  };
} | {
  variant: 'REGISTERED_TODAY';
  student: RegistedStudentsTodayListProps;
};

const ProfessorCard = (props:Props) => {

  if (props.variant === 'MAIN_LIST') {
    const { student, onClick } = props;

    return (
    
      <div className={style.student}>
        <div className={style.left_container}>
          <span className={style.name}>
            { student.name }        
          </span>
  
          <span className={style.ra}>
            RA: <span className={style.value}> { student.ra } </span>
          </span>
  
          <span className={style.email}>
            E-mail institucional: <span className={style.value}> { student.email } </span>
          </span>
  
          <span className={style.register_data}>
            Data de cadastro: <span className={style.value}> { student.registerDate } </span>
          </span>
        </div>
  
        <div className={style.right_container}>
          <Button
          onClick={() => {
            onClick.setStudentToBeEdited(student);
            onClick.showEditStudentInfoForm();
          }}
          buttonStyle={{
            fontSize: 'MD',
            border: "MD",
            color: 'PRIMARY',
            filled: false,
          }}
          icon={MdEdit}>
            Editar informações
          </Button>
  
          <Button
          buttonStyle={{
            fontSize: 'MD',
            border: "MD",
            color: 'SECONDARY',
            filled: false,
          }}
          onClick={() => {
            onClick.setActiveModal('REMOVE_STUDENT');
            onClick.setStudentToBeRemoved({
              name : student.name,
              ra   : student.ra,
            });
          }}
          icon={FaTrashAlt}>
            Remover aluno
          </Button>
        </div>
      </div>
    )
  } 
  
  const { student } = props;

  return (
    <div className={style.student_registered_today}>
      <div className={style.student}>
        <div className={style.left_container}>
          <span className={style.name}>
            { student.name }        
          </span>

          <span className={style.ra}>
            RA: <span className={style.value}> { student.ra } </span>
          </span>

          <span className={style.email}>
            E-mail institucional: <span className={style.value}> { student.email } </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfessorCard