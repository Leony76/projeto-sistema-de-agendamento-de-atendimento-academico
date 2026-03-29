import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../../contexts/ToastContext';
import { useLoadingState } from '../../../hooks/useLoadingState';
import { RegisterStudentPayload } from '../../../types/payloads/registerStudentPayload';
import { registerStudentSchema, RegisterStudentSchema } from '../../../schemas/registerStudentSchema';

import Button from '../../../components/button/Button';
import { Input } from '../../../components/input';
import { Form } from '..';

import style from '../css/Register.module.css';
import api from '../../../api';

type RegisterProps = {
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
  } = useForm<RegisterStudentSchema>({
    resolver: zodResolver(registerStudentSchema),
  });

  const handleRegisterStudent = async(data: RegisterStudentSchema):Promise<void> => {
    if (loading) return; 
    setLoading(true);

    const fetchURL:string = `/auth/register/student`;
    const payload:RegisterStudentPayload = {
      name  : data.name,
      email : data.email,
      ra    : data.ra,
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
    <Form.Wrapper.Default
    description='Insira as informações que os campos abaixo pedem para cadastrar um aluno no sistema!'
    title='Cadastrar aluno'
    onClose={onClick.closeForm}
    onSubmit={handleSubmit(handleRegisterStudent)}
    >
      <Input.Form 
        {...register('name')}
        error={errors.name?.message}
        label={'Nome do aluno'}
        placeholder='Insira o nome do aluno'
        className={style.input_form}
      />
      <Input.Form 
        {...register('email')}
        error={errors.email?.message}
        label={'E-mail institucional'}
        placeholder='Insira o e-mail institucional do aluno'
        className={style.input_form}
      />
      <Input.Form 
        {...register('ra')}
        error={errors.ra?.message}
        label={'Resgistro Acandêmico (RA)'}
        placeholder='Insira o registro acadêmico do aluno'
        className={style.input_form}
      />

      <div className={style.register_submit_button_infos_container}>
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
          Após o cadastro, o aluno cadastrado receberá um e-mail do primeiro acesso ao sistema e poderá acessá-lo com o RA cadastrado e uma senha provisória aleatóriamente gerada.
        </p>
      </div>
    </Form.Wrapper.Default>
  );
}

export default Register;




