import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import Button from '../../../components/button/Button';
import style from '../../css/Students.module.css';
import { StudentToBeEdited } from '../../../types/studentToBeEdited';
import { Modal } from '../../../components/modal';
import { useState } from 'react';

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
    setStudentToBeEdited: React.Dispatch<React.SetStateAction<StudentToBeEdited | null>>;
    showEditStudentInfoForm: () => void;
    handleRemoveStudent:     (ra:string) => Promise<void>;
  };
} | {
  variant: 'REGISTERED_TODAY';
  student: RegistedStudentsTodayListProps;
};

const StudentCard = (props:Props) => {

  const [activeModal, setActiveModal] = useState<'REMOVE_STUDENT' | null>(null);

  if (props.variant === 'MAIN_LIST') {
    const { student, onClick } = props;

    return (
      <>
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
            onClick={() => setActiveModal('REMOVE_STUDENT')}
            icon={FaTrashAlt}>
              Remover aluno
            </Button>
          </div>
        </div>

        <Modal.ConfimAction
          title={'Remover aluno'} 
          message={`Tem certeza em remover ${student.name} do sistema?`} 
          isOpen={activeModal === 'REMOVE_STUDENT'} 
          onClick={{
            closeModal: () => setActiveModal(null),
            confirm:    () => {
              onClick.handleRemoveStudent(student.ra);
              setActiveModal(null);
            },
          }}
        />
      </>
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

export default StudentCard