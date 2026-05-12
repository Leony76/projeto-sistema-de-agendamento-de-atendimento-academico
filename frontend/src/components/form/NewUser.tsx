import { newUserSchema, type NewProfessorFormData, type NewStudentFormData, type NewUserFormData } from '@shared/schemas/newUser.schema';
import type { UserRole } from '@shared/types/userRole.type'
import React, { useEffect, useState } from 'react'
import { FaArrowCircleLeft, FaUserPlus } from 'react-icons/fa';
import { useForm, type FieldErrors } from 'react-hook-form';
import { Button } from '../button';
import { Input } from '../input';
import { Select } from '../select';
import { TiInfoLarge } from 'react-icons/ti';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SelectOption } from '@shared/types/selectOptions.type';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ManagerService } from '@frontend/services/manager.service';
import { USER_ROLES } from '@frontend/constants/maps/userRoles.map';

type Props = {
  onBack                  : () => void;
  newProfessorDisciplines : SelectOption[];
};

const NewUser = (props:Props): React.JSX.Element => {

  const [newUserRole, setNewUserRole] = useState<UserRole>('STUDENT');
  const { toast } = useToast();

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
      role        : newUserRole,
      disciplines : [],
      email       : '',
      name        : '',
      ra          : '',
    },
  });

  const handleNewUser = async(data: NewUserFormData): Promise<void> => {
    try {
      let response;

      switch (data.role) {
        case 'MANAGER': response = await ManagerService.registerStudent(data); break;
        case 'PROFESSOR': response = await ManagerService.registerNewUser(data); break;
        case 'STUDENT': response = await ManagerService.registerNewUser(data); break;
      }

      console.log(response);
      toast('');
      
      props.onBack();
      reset();
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
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
            multipleOptions
            value={watch('disciplines')}
            externalOptionsSchema={props.newProfessorDisciplines}
            gridConfig='grid-cols-2' 
            label='Disciplina do professor'
            selectedOptionPlaceholderShow
            placeholder='Selecione a disciplina'
            error={(errors as FieldErrors<NewProfessorFormData>).disciplines?.message}
            onSelect={(value) => {
              setValue('disciplines', value as string[], {
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