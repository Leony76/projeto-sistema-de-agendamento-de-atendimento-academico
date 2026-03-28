import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../../../contexts/ToastContext';
import { useLoadingState } from '../../../../hooks/useLoadingState';
import { RegisterStudentPayload } from '../../../../types/payloads/registerStudentPayload';
import { RegisterStudentSchema } from '../../../../schemas/registerStudentSchema';

import Button from '../../../../components/button/Button';
import { Input } from '../../../../components/input';
import ProfessorPageFormsWrapper from './ProfessorPageFormsWrapper';

import style from '../../../css/Students.module.css';
import api from '../../../../api';
import { registerProfessorSchema, RegisterProfessorSchema } from '../../../../schemas/registerProfessorSchema';
import { RegisterProfessorPayload } from '../../../../types/payloads/registerProfessorPayload';
import { Select } from '../../../../components/select';

export type RegisterProps = {
  onClick: { closeForm: () => void };
  onSuccess: () => Promise<void>;
}

const Register = ({
  onClick,
  onSuccess,
}:RegisterProps) => {
  const { loading, setLoading } = useLoadingState();
  const { showToast } = useToast();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterProfessorSchema>({
    resolver: zodResolver(registerProfessorSchema),
  });

  const handleRegisterProfessor = async(
    data : RegisterProfessorSchema
  ):Promise<void> => {
    if (loading) return; 
    setLoading(true);

    const fetchURL : string = `/auth/register/professor`;
    const payload : RegisterProfessorPayload = {
      discipline : data.discipline,
      email      : data.email,
      name       : data.name 
    };

    try {
      const response = await api.post(fetchURL, payload);

      showToast(response.data.success, 'SUCCESS');
      reset();

      await onSuccess();
      onClick.closeForm();

    } catch(error:any) {  
      showToast(error.response?.data?.error, 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessorPageFormsWrapper
    description='Insira as informações que os campos abaixo pedem para cadastrar um professor no sistema!'
    title='Cadastrar professor'
    onClose={onClick.closeForm}
    onSubmit={handleSubmit(handleRegisterProfessor)}
    >
      <Input.Form 
        {...register('name')}
        error={errors.name?.message}
        label={'Nome do professor'}
        placeholder='Insira o nome do professor'
        className={style.add_student_form}
      />
      <Input.Form 
        {...register('email')}
        error={errors.email?.message}
        label={'E-mail institucional'}
        placeholder='Insira o e-mail institucional do professor'
        className={style.add_student_form}
      />
      <Select.Form
        {...register('discipline')}
        label='Disciplina'
        error={errors.discipline?.message}
        className={style.add_student_form}
        selectSchema={'PROFESSORS_DISCIPLINES_OPTIONS'}
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
          {loading ? 'Cadastrando' : 'Cadastrar'}
        </Button>

        <p style={{fontSize: '11px'}}>
          Após o cadastro, o professor cadastrado receberá um e-mail do primeiro acesso ao sistema e poderá acessá-lo com o e-mail e uma senha provisória aleatóriamente gerada.
        </p>
      </div>
    </ProfessorPageFormsWrapper>
  );
}

export default Register;




