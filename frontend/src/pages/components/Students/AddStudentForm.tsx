import { FaChevronLeft } from 'react-icons/fa6';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import style from '../../css/Students.module.css';
import { useForm } from 'react-hook-form';
import { registerStudentSchema, RegisterStudentSchema } from '../../../schemas/registerStudentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoadingState } from '../../../hooks/useLoadingState';
import axios from 'axios';
import { RegisterStudentPayload } from '../../../types/payloads/registerStudentPayload';
import { useToast } from '../../../contexts/ToastContext';

type Props = {
  onClick: {
    toggleShowForm: () => void;
  };
}

const AddStudentForm = ({ onClick }:Props) => {

  const { loading, setLoading } = useLoadingState();
  const { showToast } = useToast();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterStudentSchema>({
    resolver: zodResolver(registerStudentSchema),
  });

  const handleRegisterStudent = async(data: RegisterStudentSchema):Promise<void> => {
    if (loading) return; 
    setLoading(true);
    
    const fetchURL:string = 'http://localhost:3000/students/register-student';
    const payload:RegisterStudentPayload = {
      studentName: data.studentName,
      email: data.email,
      ra: data.ra,
    };

    try {
      const response = await axios.post(fetchURL, payload);

      showToast(response.data.success, 'SUCCESS');
      reset();
    } catch(error:any) {  
      showToast(error.response?.data?.error, 'ERROR');
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit(handleRegisterStudent)}>
        <Input 
          {...register('studentName')}
          error={errors.studentName?.message}
          label={'Nome do aluno'}
          placeholder='Insira o nome do aluno'
          variant="FORM"
          className={style.add_student_form}
        />
        <Input 
          {...register('email')}
          error={errors.email?.message}
          label={'E-mail institucional'}
          placeholder='Insira o e-mail institucional do aluno'
          variant="FORM"
          className={style.add_student_form}
        />
        <Input 
          {...register('ra')}
          error={errors.ra?.message}
          label={'Resgistro Acandêmico (RA)'}
          placeholder='Insira o registro acadêmico do aluno'
          variant="FORM"
          className={style.add_student_form}
        />

        <div className={style.register_student_submit_button_infos_container}>
          <Button 
          loading={loading}
          buttonStyle={{
            fontSize: 'XL',
            border: "XL",
            color: 'SECONDARY',
            filled: false,
          }}>
            {loading ? 'Cadastrando' : 'Casdastrar'}
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