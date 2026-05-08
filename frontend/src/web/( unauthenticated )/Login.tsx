import { Button } from '@frontend/components/button'
import { Input } from '@frontend/components/input'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@frontend/schemas/login.schema'
import { useToast } from '@frontend/contexts/ToastContext'
import { AuthService } from '@frontend/services/auth.service'
import { useAuth } from '@frontend/hooks/useAuth.hook'
import type { LoginResponse } from '@shared/types/loginResponse.type'
import { apiError } from '@frontend/utils/misc/apiError.util'

const Login = (): React.JSX.Element => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [selectedTab, setSelectedTab] = useState<'STUDENT' | 'PROFESSOR/MANAGER'>('STUDENT');

  const { 
    register, 
    setValue, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role       : selectedTab,
      ra         : '',
      email      : '',  
      password   : '',
    }
  });

  const handleTabChange = (tab: 'STUDENT' | 'PROFESSOR/MANAGER'): void => {
    setSelectedTab(tab);
    setValue('role', tab);
  };


  const INPUT_MAP = {
    'PROFESSOR/MANAGER': {
      label       : 'E-mail',
      placeholder : 'Insira seu E-mail',
      type        : 'email',
      maxLengh    : 255,
      identifier  : 'email',
      error       : (errors as any).email?.message,
    }, 
    STUDENT: {
      label       : 'RA',
      placeholder : 'Insira seu RA',
      type        : 'number',
      maxLengh    : 11,
      identifier  : 'ra',
      error       : (errors as any).ra?.message,
    },
  } as const;

  const handleLogin = async(data: LoginFormData): Promise<void> => {
    try {
      switch (data.role) {
        case 'PROFESSOR/MANAGER':{
          const response: LoginResponse = await AuthService.login({
            role     : 'PROFESSOR/MANAGER',
            email    : data.email,
            password : data.password,
          });

          login(
            response.token,
            response.user,
          );
          
          navigate('/home');
          break;

        } default: {

          const response: LoginResponse = await AuthService.login({ 
            role     : 'STUDENT',
            ra       : data.ra,
            password : data.password,
          });

          login(
            response.token,
            response.user,
          );
            
          navigate('/home');
          break;
        }
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
  };

  return (
    <div className='grid grid-cols-[1fr_450px] min-h-screen'>
      <div className='bg-cyan-100/50 p-6'>
        <h1 className='text-2xl font-bold text-orange-500 text-shadow-2xs'>
          Sistema de Agendamento Acadêmico Online
        </h1>
      </div>

      <div className='flex flex-col p-8 gap-3 justify-center items-center bg-orange-500/5 border-l border-orange-500'>
        <h2 className='text-3xl font-semibold text-orange-500'>
          Entrar
        </h2>

        <div className='flex w-full'>
          <button 
          onClick={() => handleTabChange('STUDENT')}
          className={`
            cursor-pointer py-2 flex-1 border-b-2 
            ${ selectedTab === 'STUDENT' 
              ? 'bg-linear-to-t from-cyan-100 to-transparent border-cyan-500/20 text-cyan-300' 
              : 'border-cyan-500/50 text-cyan-500' 
            }
          `}>
            Aluno
          </button>

          <button 
          onClick={() => handleTabChange('PROFESSOR/MANAGER')}
          className={`
            cursor-pointer py-2 flex-1 border-b-2 
            ${ selectedTab === 'PROFESSOR/MANAGER' 
              ? 'bg-linear-to-t from-cyan-100 to-transparent border-cyan-500/20 text-cyan-300' 
              : 'border-cyan-500/50 text-cyan-500' 
            }
          `}>
            Professor / Gestor
          </button>
        </div> 

        <Input.Default
          label={INPUT_MAP[selectedTab].label}
          placeholder={INPUT_MAP[selectedTab].placeholder}
          type={INPUT_MAP[selectedTab].type}
          error={INPUT_MAP[selectedTab].error} 
          {...register(INPUT_MAP[selectedTab].identifier, {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Input.Default
          label="Senha"
          placeholder="Insira sua senha"
          type="password"
          error={errors.password?.message}
          {...register('password', {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Link className='text-sm self-end text-cyan-500 underline' to={'/forgot-password'}>
          Esqueci a senha
        </Link>

        <Button.Default
          label='Entrar'
          onClick={handleSubmit(handleLogin)}
        />
      
        <p className='flex gap-1 text-sm text-orange-500'>
          Não está cadastrado? 
          <Link className='text-cyan-500 underline' to={'/register'}>
            cadastre-se!
          </Link>
        </p>     
      </div>
    </div>
  )
}

export default Login