import { useState } from 'react';
import style from './css/Login.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ManagerLoginFormSchema, managerSchema, StudentLoginFormSchema, studentSchema } from '../schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ManagerPayload } from '../types/managerLoginPayload';
import { StudentPayload } from '../types/studentLoginPayload';
import { isStudentData } from '../types/guards/managerAndStudentGuard';
import InputValidationError from '../components/input/InputValidationError';
import Input from '../components/input/Input';

const Login = () => {

  const [tab, switchTab] = useState<'STUDENT' | 'MANAGER'>('STUDENT');
  const navigate = useNavigate();

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

    const fetchURL:string = `http://localhost:3000/login/${tab.toLowerCase()}`;
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
      localStorage.setItem('token', response.data.token);
      navigate('/home')

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Houve um erro ao fazer login!';
      
      alert(errorMessage);
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

        <h2>
          Login
        </h2>
        <h3>
          {tab === 'STUDENT'
            ? 'Aluno'
            : 'Gestor'
          }      
        </h3>

        <form 
        onSubmit={handleSubmit(handleLogin)}
        className={style.form_container}
        >
          <Input 
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
            label={'Senha'} 
            type={'password'} 
            placeholder={'Insira a senha'} 
            error={errors.password 
              ? errors.password.message?.toString() ?? 'Erro'
              : ''
            } 
            {...register('password')}
          />

          <button className={style.submit_button}>
            Entrar
          </button>

          <button
          className={style.to_manager_login}
          type='button'
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
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login

