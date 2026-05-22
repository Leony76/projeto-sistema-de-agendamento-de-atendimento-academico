import { newUserSchema, type ManagerRegistersProfessorFormData, type ManagerRegistersStudentFormData, type ManagerRegistersUserFormData } from '@shared/schemas/newUser.schema';
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
import { AuthService } from '@frontend/services/auth.service';
import { FaCirclePlus } from 'react-icons/fa6';
import { IoArrowBackCircle } from 'react-icons/io5';
import { DisciplineService } from '@frontend/services/discipline.service';
import Warning from '../misc/Warning';
import { USER_ROLES } from '@frontend/constants/maps/userRoles.map';

type Props = {
  onBack       : () => void;
  refreshUsers : () => void;
};

const NewUser = (props:Props): React.JSX.Element => {

  const { toast } = useToast();

  const [ newProfessorDisciplinesOptions, setNewProfessorDisciplinesOptions ] = useState<SelectOption[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [newUserRole, setNewUserRole] = useState<UserRole>('STUDENT');
  const [newDiscipline, setNewDiscipline] = useState<{ inputShow: boolean, error: string, name: string }>({
    inputShow : false,
    error     : '',
    name      : '',
  });

  const { 
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ManagerRegistersUserFormData>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      role        : newUserRole,
      disciplines : [],
      email       : '',
      name        : '',
      ra          : '',
    },
  });

  const handleAddDiscipline = async(name: string): Promise<void> => {
    if (!newDiscipline.name) {
      setNewDiscipline(prev => ({ ...prev, error: 'O nome da disciplina deve haver ao mínimo 3 caractéres' })) 
      return;
    } if (newDiscipline.name.length > 50) {
      setNewDiscipline(prev => ({ ...prev, error: 'O nome da disciplina deve haver até 50 caractéres' })) 
      return;
    } setNewDiscipline(prev => ({ ...prev, error: ''}));
    
    try {
      const response = await DisciplineService.addDiscipline(name);

      if (!response.success) {
        throw new Error('Houve um erro ao adicionar a disciplina');
      };
      
      toast(response.message);
      console.log(response.data);
      
      const updatedDisciplines = await DisciplineService.getUnboundNames();
      
      setNewProfessorDisciplinesOptions(
        updatedDisciplines.map((name) => ({
          label: name,
          value: name,
        })),
      );
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setNewDiscipline(prev => ({ ...prev, 
        name      : '', 
        inputShow : false, 
        error     : ''
      })); 
    }
  }
  
  const handleNewUser = async(data: ManagerRegistersUserFormData): Promise<void> => {
    try {
      setLoading(true);

      let response;
      
      switch (data.role) {
        case 'STUDENT'  : response = await AuthService.registerStudent(data);   break;
        case 'PROFESSOR': response = await AuthService.registerProfessor(data); break;
        case 'MANAGER'  : response = await AuthService.registerManager(data);   break;
      }
      
      if (!response.success) {
        throw new Error(`Houve um erro ao cadastrar o(a) ${USER_ROLES[data.role]}!`);
      };
      
      toast(response.message);
      console.log(response.data);
      props.refreshUsers();

      const updatedDisciplines = await DisciplineService.getUnboundNames();

      setNewProfessorDisciplinesOptions(
        updatedDisciplines.map((name) => ({
          label: name,
          value: name,
        })),
      );
   
      props.onBack();
      reset();
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async() => {
      try {
        const [ disciplineNames ] = await Promise.all([
          DisciplineService.getUnboundNames(),
        ]);

        setNewProfessorDisciplinesOptions(
          disciplineNames.map((name) => ({
            label: name,
            value: name,
          })),
        );
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      } 
    })();
  },[]);

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
            setNewDiscipline(prev => ({ ...prev, inputShow: false }));
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
            setNewDiscipline(prev => ({ ...prev, inputShow: false }));
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
          error={(errors as FieldErrors<ManagerRegistersStudentFormData>).ra?.message}
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
        <div className='flex w-full gap-2'>
          <div className='w-full'>
            <Select.Default
              multipleOptions
              value={watch('disciplines')}
              externalOptionsSchema={newProfessorDisciplinesOptions}
              gridConfig='grid-cols-2' 
              label='Disciplina(s) do professor'
              selectedOptionPlaceholderShow
              placeholder='Selecione a(s) disciplina(s)'
              error={(errors as FieldErrors<ManagerRegistersProfessorFormData>).disciplines?.message}
              onSelect={(value) => {
                setValue('disciplines', value as string[], {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </div>

          <Button.Default
            label=''
            Icon={newDiscipline.inputShow 
              ? () => <IoArrowBackCircle className='scale-[1.2]'/>
              : () => <FaCirclePlus /> 
            }
            customStyle={{ button: `
              flex-1 h-8 self-end 
              ${ newDiscipline.inputShow 
                ? 'bg-red-50 text-red-600 border-red-600' 
                : 'bg-green-50 text-green-600 border-green-600' 
            }`}}
            onClick={() => setNewDiscipline(prev => ({ ...prev, inputShow: !prev.inputShow }))}
          />
        </div>
      }

      { newDiscipline.inputShow &&
        <>
          <div className='flex h-8 w-full gap-2'>
            <Input.Default
              label=''
              customStyle={{ input: 'h-8' }}
              maxLength={51}
              placeholder='Insira o nome da nova disciplina'
              onChange={(e) => setNewDiscipline(prev => ({ ...prev, name: e.target.value }))}
              error={errors.name?.message}
            />

            <Button.Default
              label=''
              Icon={() => <FaCirclePlus />}
              onClick={() => handleAddDiscipline(newDiscipline.name)}
              customStyle={{ button: 'flex-1 bg-green-50 text-green-600 border-green-600'}}
            />
          </div>

          { newDiscipline.error && <Warning error={newDiscipline.error}/> }
        </>
      }

      <Button.Default
        label={loading ? 'Cadastrando' : 'Cadastrar'}
        loading={loading}
        disabled={Object.keys(errors).length > 0 || loading}
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