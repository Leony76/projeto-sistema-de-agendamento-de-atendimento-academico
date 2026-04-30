import { Button } from '@/components/button'
import { Input } from '@/components/input'
import type { UserRole } from '@/types/userRole.type'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/schemas/login.schema'

const Login = (): React.JSX.Element => {

  const navigate = useNavigate();

  const { 
    register, 
    setValue, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role       : 'STUDENT',
      identifier : '',
      password   : '',
    }
  });

  const handleTabChange = (tab: Exclude<UserRole, 'MANAGER'>): void => {
    setSelectedTab(tab);
    setValue('role', tab);
  };

  const [selectedTab, setSelectedTab] = useState<Exclude<UserRole, 'MANAGER'>>('STUDENT');

  const INPUT_MAP = {
    PROFESSOR: {
      label: 'E-mail',
      placeholder: 'Insira seu E-mail',
      type: 'email',
      maxLengh: 255,
    }, 
    STUDENT: {
      label: 'RA',
      placeholder: 'Insira seu RA',
      type: 'number',
      maxLengh: 11,
    },
  };

  const handleLogin = async(): Promise<void> => {
    navigate('/home')
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
          onClick={() => handleTabChange('PROFESSOR')}
          className={`
            cursor-pointer py-2 flex-1 border-b-2 
            ${ selectedTab === 'PROFESSOR' 
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
          error={errors.identifier?.message} 
          {...register('identifier', {
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