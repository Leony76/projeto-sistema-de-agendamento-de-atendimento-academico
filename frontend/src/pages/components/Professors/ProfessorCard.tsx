import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import Button from '../../../components/button/Button';
import style from '../../css/Professor.module.css';
import { ProfessorToBeEdited } from '../../../types/professorToBeEdited';
import { ProfessorPageModal } from '../../../types/modals/professorsPage.modal';
import { ProfessorToBeRemoved } from '../../../types/professorToBeRemoved';
import { ProfessorListDTO } from '../../../types/dtos/professorListDTO';
import { PROFESSOR_DISCIPLINES_MAP } from '../../../maps/professorDisciplinesMap';

type RegistedProfessorsTodayListProps = Omit<ProfessorListDTO, 'registeredAt'>;

type MainProfessorListProps = | RegistedProfessorsTodayListProps & {
  registeredAt: string;
}

type Props = {
  variant: 'MAIN_LIST';
  professor: MainProfessorListProps;
  onClick: {
    setProfessorToBeEdited    : React.Dispatch<React.SetStateAction<ProfessorToBeEdited | null>>;
    setProfessorToBeRemoved   : React.Dispatch<React.SetStateAction<ProfessorToBeRemoved | null>>;
    showEditProfessorInfoForm : () => void;
    setActiveModal            : React.Dispatch<React.SetStateAction<ProfessorPageModal | null>>;
  };
} | {
  variant: 'REGISTERED_TODAY';
  professor: RegistedProfessorsTodayListProps;
};

const ProfessorCard = (props:Props) => {

  if (props.variant === 'MAIN_LIST') {
    const { professor, onClick } = props;

    return (
    
      <div className={style.student}>
        <div className={style.left_container}>
          <span className={style.name}>
            { professor.name }        
          </span>
  
          <span className={style.ra}>
            Disciplina: <span className={style.value}> { PROFESSOR_DISCIPLINES_MAP[professor.discipline] } </span>
          </span>
  
          <span className={style.email}>
            E-mail institucional: <span className={style.value}> { professor.email } </span>
          </span>
  
          <span className={style.register_data}>
            Data de cadastro: <span className={style.value}> { professor.registeredAt } </span>
          </span>
        </div>
  
        <div className={style.right_container}>
          <Button
          onClick={() => {
            onClick.setProfessorToBeEdited(professor);
            onClick.showEditProfessorInfoForm();
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
            onClick.setActiveModal('REMOVE_PROFESSOR');
            onClick.setProfessorToBeRemoved({
              id   : professor.id,
              name : professor.name,
            });
          }}
          icon={FaTrashAlt}>
            Remover aluno
          </Button>
        </div>
      </div>
    )
  } 
  
  const { professor } = props;

  return (
    <div className={style.student_registered_today}>
      <div className={style.student}>
        <div className={style.left_container}>
          <span className={style.name}>
            { professor.name }        
          </span>

          <span className={style.ra}>
            Disciplina: <span className={style.value}> { PROFESSOR_DISCIPLINES_MAP[professor.discipline] } </span>
          </span>

          <span className={style.email}>
            E-mail institucional: <span className={style.value}> { professor.email } </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfessorCard