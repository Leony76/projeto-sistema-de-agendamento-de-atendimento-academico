import { Button } from '@frontend/components/button'
import { Input } from '@frontend/components/input'
import { useToast } from '@frontend/contexts/ToastContext';
import { registerSchema, type RegisterFormData } from '@frontend/schemas/register.schema';
import { AuthService } from '@frontend/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RegisterUser } from '@shared/types/registerUser.type';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'

const Register = (): React.JSX.Element => {

  const navigate = useNavigate();
  const { toast } = useToast();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email          : '',
      password       : '',
      name           : '',
      ra             : '',
      repeatPassword : '',
    },
  });

  const handleRegister = async( data: RegisterFormData ): Promise<void> => {
    try {
      const user: RegisterUser = { ...data };

      await AuthService.register(user);

      alert("Casdastro foi um sucesso!");

      navigate('/home');
    } catch (error:unknown) {
      if (error instanceof Error) {
        toast('Houve um erro ao realizar o cadastro!: ' + error.message, 'error');
      }
    }
  } ;

  return (
    <div className='grid grid-cols-[1fr_450px] min-h-screen'>
      <div className='bg-cyan-100/50 p-6'>
        <h1 className='text-2xl font-bold text-orange-500 text-shadow-2xs'>
          Sistema de Agendamento Acadêmico Online
        </h1>
      </div>

      <div className='flex flex-col py-10 overflow-y-auto h-screen p-8 gap-3 justify-center items-center bg-orange-500/5 border-l border-orange-500'>
        <h2 className='text-3xl font-semibold text-orange-500'>
          Cadastro
        </h2>

        <Input.Default
          label='Nome completo'
          placeholder='Insira seu nome completo'
          type='text'
          error={errors.name?.message} 
          maxLength={255}
          {...register('name', {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Input.Default
          label='RA'
          placeholder='Insira seu RA'
          type='number'
          error={errors.ra?.message} 
          maxLength={11}
          min={0}
          {...register('ra', {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Input.Default
          label='E-mail'
          placeholder='Insira seu e-mail'
          type='email'
          error={errors.email?.message} 
          maxLength={255}
          {...register('email', {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Input.Default
          label='Senha'
          maxLength={50}
          placeholder='Insira sua senha'
          error={errors.password?.message} 
          type='password'
          {...register('password', {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Input.Default
          label='Repetir senha'
          maxLength={50}
          placeholder='Repita sua senha'
          error={errors.repeatPassword?.message} 
          type='password'
          {...register('repeatPassword', {
            setValueAs: (v) => v.trim(), 
          })}
        />

        <Button.Default
          label='Cadastrar'
          onClick={handleSubmit(handleRegister)}
        />
      
        <p className='flex gap-1 text-sm text-orange-500'>
          Já tem cadastro? 
          <Link className='text-cyan-500 underline' to={'/'}>
            Entre!
          </Link>
        </p>     
      </div>
    </div>
  )
}

export default Register