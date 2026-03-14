import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../services/auth.service';
import { useLoadingState } from '../hooks/useLoadingState';
import { ManagerLoginFormSchema, managerSchema, StudentLoginFormSchema, studentSchema } from '../schemas/loginSchema';

import Button from '../components/button/Button';
import Input from '../components/input/Input';

import style from './css/Login.module.css';

const Login = () => {

  const { loading, setLoading } = useLoadingState();
  const { signIn } = useAuth();

  const navigate = useNavigate();

  const [tab, switchTab] = useState<'STUDENT' | 'MANAGER'>('STUDENT');

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset ,
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

    try {
      const { token, user } = await AuthService.login(data, tab);

      signIn(token, user);
      navigate('/home');

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Houve um erro ao fazer login!'; 
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

