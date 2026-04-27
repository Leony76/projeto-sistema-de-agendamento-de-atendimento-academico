import { newUserSchema, type NewProfessorFormData, type NewStudentFormData, type NewUserFormData } from '@/schemas/newUser.schema';
import type { UserRole } from '@/types/userRole.type'
import React, { useEffect, useState } from 'react'
import { FaArrowCircleLeft, FaUserPlus } from 'react-icons/fa';
import { useForm, type FieldErrors } from 'react-hook-form';
import { Button } from '../button';
import { Input } from '../input';
import { Select } from '../select';
import type { DISCIPLINES_VALUE_MAP } from '@/constants/maps/disciplines.map';
import { TiInfoLarge } from 'react-icons/ti';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  onBack : () => void;
};

const NewUser = (props:Props): React.JSX.Element => {

  const [newUserRole, setNewUserRole] = useState<UserRole>('STUDENT');

  const { 
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      role  : newUserRole,
      email : '',
      name  : '',
      ra    : '',
    },
  });

  const handleNewUser = async(data: NewUserFormData): Promise<void> => {
    alert('Cadastro foi um sucesso!')
    console.log(data);
    reset();
  };

  useEffect(() => {
    setValue('role', newUserRole);
  }, [newUserRole]);

  return (
    <div className='relative flex flex-col overflow-auto gap-2 py-3 px-4 items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      onClick={props.onBack}
      className='absolute top-4 left-4 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'>
        <FaArrowCircleLeft size={20}/>
      </button>
      
      <h3 className='font-semibold text-lg text-cyan-500'>
        Novo usuário
      </h3>

      <p className='text-xs text-orange-500'>
        Selecione qual tipo de usuário vai cadastrar
      </p>

      <div className='flex w-full h-7 gap-2'>
        <Button.Default
          label='Aluno'
          customStyle={{ button: 'text-sm' }}
          selected={newUserRole === 'STUDENT'}
          onClick={() => {
            setNewUserRole('STUDENT');
            reset();
          }}
        />

        <Button.Default
          label='Professor'
          customStyle={{ button: 'text-sm' }}
          selected={newUserRole === 'PROFESSOR'}
          onClick={() => {
            setNewUserRole('PROFESSOR');
            reset();
          }}
        />

        <Button.Default
          label='Gestor'
          customStyle={{ button: 'text-sm' }}
          selected={newUserRole === 'MANAGER'}
          onClick={() => {
            setNewUserRole('MANAGER');
            reset();
          }}
        />
      </div>

      <Input.Default
        label='Nome'
        customStyle={{ input: 'h-8' }}
        placeholder='Insira o nome'
        { ...register('name') }
        error={errors.name?.message}
      />

      { newUserRole === 'STUDENT' &&
        <Input.Default
          label='RA'
          customStyle={{ input: 'h-8' }}
          placeholder='Insira o RA'
          { ...register('ra') }
          error={(errors as FieldErrors<NewStudentFormData>).ra?.message}
        />
      }

      <Input.Default
        label='E-mail'
        customStyle={{ input: 'h-8' }}
        placeholder='Insira o e-mail'
        { ...register('email') }
        error={errors.email?.message}
      />

      { newUserRole === 'PROFESSOR' &&
        <div className='w-full'>
          <Select.Default
            optionsSchema='DISCIPLINES'
            value={watch('discipline')}
            gridConfig='grid-cols-3' 
            label='Disciplina do professor'
            placeholder='Selecione a disciplina'
            error={(errors as FieldErrors<NewProfessorFormData>).discipline?.message}
            onSelect={(value) => {
              setValue('discipline', value as keyof typeof DISCIPLINES_VALUE_MAP, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
        </div>
      }

      <Button.Default
        label='Cadastrar'
        disabled={Object.keys(errors).length > 0}
        onClick={handleSubmit(handleNewUser)}
        Icon={() => <FaUserPlus />}
        customStyle={{ button: 'py-2 font-semibold' }}
      />
      
      <div className='flex gap-1 text-yellow-500'>
        <TiInfoLarge className='scale-[2.5]'/>
        <p className='text-xs'>
          Observação: A senha do novo usuário será mandado em seu e-mail, sendo temporária como primeiro acesso até que o mesmo a altere
        </p>             
      </div>
    </div>
  )
}

export default NewUser