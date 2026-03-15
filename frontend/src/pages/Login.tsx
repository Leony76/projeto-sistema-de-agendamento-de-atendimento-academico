import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../services/auth.service';
import { useLoadingState } from '../hooks/useLoadingState';
import { ManagerLoginFormSchema, managerSchema, StudentLoginFormSchema, studentSchema } from '../schemas/loginSchema';

import Button from '../components/button/Button';
import { Input } from '../components/input';

import style from './css/Login.module.css';
import { SystemRoles } from '../types/systemRoles';
import { SYSTEM_ROLES } from '../maps/systemRolesMap';
import { LOGIN_FIELDS_MAP } from '../maps/page/loginPageFieldsMap';
import { useToast } from '../contexts/ToastContext';
import InputValidationError from '../components/input/InputValidationError';

const Login = () => {

  const { loading, setLoading } = useLoadingState();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [tab, switchTab] = useState<SystemRoles>('STUDENT');

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
    setError(null);
    if (loading) return;
    setLoading(true);

    try {
      const { token, user } = await AuthService.login(data, tab);

      signIn(token, user);
      navigate('/home');

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Houve um erro ao fazer login!'; 
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedTab = LOGIN_FIELDS_MAP[tab];

  return (
    <main className={style[`main_container_${SYSTEM_ROLES[tab]}`]}>
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
            {selectedTab.title}      
          </h3>

          {selectedTab.fields.map((field) => (
            <Input.Form
              label={field.label} 
              type={field.type} 
              placeholder={field.placeholder} 
              error={(errors as any)[field.name]?.message} 
              {...register(field.name as any)}
            />
          ))}

          {error && <InputValidationError error={error}/>}

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
          
          <div className={style.switch_tabs_container}>
            <Button
            type='button'
            buttonStyle={{
              fontSize: 'MD',
              border: "XL",
              color: 'NEUTRAL',
              filled: true,
            }}
            onClick={() => {
              switchTab(
                tab === 'STUDENT' 
                  ? 'PROFESSOR'
                : tab === 'PROFESSOR' 
                  ? 'STUDENT'
                : 'STUDENT'
              );
              setError(null);
              reset();
            }}
            >
              {tab === 'STUDENT' 
                ? 'Entrar como professor'
              : tab === 'PROFESSOR'
                ? 'Entrar como aluno'
              : 'Entrar como professor'
              } 
            </Button>

            {tab !== 'MANAGER' ? (
              <Button
              type='button'
              buttonStyle={{
                fontSize: 'MD',
                border: "XL",
                color: 'NEUTRAL',
                filled: true,
              }}
              onClick={() => {
                switchTab('MANAGER');
                setError(null);
                reset();
              }}
              >
                Entrar como gestor
              </Button>
            ) : (
              <Button
              type='button'
              buttonStyle={{
                fontSize: 'MD',
                border: "XL",
                color: 'NEUTRAL',
                filled: true,
              }}
              onClick={() => {
                switchTab('STUDENT');
                setError(null);
                reset();
              }}
              >
                Entrar como aluno
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

export default Login

