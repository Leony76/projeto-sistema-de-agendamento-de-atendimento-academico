import { useState } from 'react';
import style from './css/Login.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ManagerLoginFormSchema, managerSchema, StudentLoginFormSchema, studentSchema } from '../schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ManagerPayload } from '../types/payloads/managerLoginPayload';
import { StudentPayload } from '../types/payloads/studentLoginPayload';
import { isStudentData } from '../types/guards/managerAndStudentGuard';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';

const Login = () => {

  const [tab, switchTab] = useState<'STUDENT' | 'MANAGER'>('STUDENT');
  const { loading, setLoading } = useLoadingState();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<StudentLoginFormSchema | ManagerLoginFormSchema>({
    resolver: zodResolver(tab === 'STUDENT'
      ? studentSchema
      : managerSchema
    ),
  });

  const handleLogin = async(
    data: StudentLoginFormSchema | ManagerLoginFormSchema
  ):Promise<void> => {

    if (loading) return;
    setLoading(true);

    const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

    const fetchURL:string = `${baseURL}/api/auth/login/${tab.toLowerCase()}`;
    let payload: ManagerPayload | StudentPayload;

    if (isStudentData(data)) {
      payload = {
        ra: data.ra,
        password: data.password,
      };
    } else {
      payload = {
        email: data.email,
        password: data.password,
      };
    }

    try {

      const response = await axios.post(fetchURL, payload);
      signIn(response.data.token, response.data.user);
      navigate('/home')

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Houve um erro ao fazer login!'; 
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const raError = (errors as any).ra;
  const emailError = (errors as any).email;

  return (
    <main className={style[`main_container_${tab === 'STUDENT' 
      ? 'student' 
      : 'manager'
    }`]}>
      <div className={style.left_container}>
        <h1>
          Sistema de agendamento de atendimento acadêmico
        </h1>
      </div>
      <div className={style.right_container}>
        <h1>
          Sistema de agendamento de atendimento acadêmico
        </h1>

        <h2>
          Login
        </h2>

        <form 
        onSubmit={handleSubmit(handleLogin)}
        className={style.form_container}
        >
          <h3>
            {tab === 'STUDENT'
              ? 'Aluno'
              : 'Gestor'
            }      
          </h3>

          <Input 
            variant='FORM'
            autoComplete="email"
            label={tab === 'STUDENT' 
              ? 'RA:' 
              : 'E-mail institucional'
            } type={tab === 'STUDENT' 
              ? 'text' 
              : 'email'
            } placeholder={tab === 'STUDENT' 
              ? 'Insira o RA' 
              : 'Insira o e-mail'
            } error={tab === 'STUDENT' 
              ? raError
                ? (errors as any).ra.message
                : ''
              : emailError
                ? (errors as any).email.message
                : ''
            } {...register(tab === 'STUDENT' 
              ? "ra" 
              : "email"
            )}
          />

          <Input 
            variant='FORM'
            autoComplete="current-password"
            label={'Senha'} 
            type={'password'} 
            
            placeholder={'Insira a senha'} 
            error={errors.password 
              ? errors.password.message?.toString() ?? 'Erro'
              : ''
            } 
            {...register('password')}
          />

          <Button 
          type='submit'
          buttonStyle={{
            fontSize: 'XL',
            border: "XL",
            color: 'SECONDARY',
            filled: true,
          }}
          loading={loading}
          >
            {loading 
              ? 'Entrando' 
              : 'Entrar'
            }
          </Button>
          
          <Button
          type='button'
          buttonStyle={{
            fontSize: 'MD',
            border: "XL",
            color: 'NEUTRAL',
            filled: true,
          }}
          onClick={() => {
            switchTab(tab === 'STUDENT'
              ? 'MANAGER'
              : 'STUDENT'
            );
            reset();
          }}
          >
            {tab === 'STUDENT' 
              ? 'Entrar como gestor'
              : 'Entrar como aluno'
            } 
          </Button>
        </form>
      </div>
    </main>
  )
}

export default Login

