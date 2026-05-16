import React, { useState } from 'react'
import { FaArrowCircleLeft, FaTrashAlt } from 'react-icons/fa';
import { Input } from '../input';
import { USER_ROLES } from '@frontend/constants/maps/userRoles.map';
import { FaUserXmark } from 'react-icons/fa6';
import ExpansibleImage from '../misc/ExpansibleImage';
import NoContent from '../misc/NoContent';
import type { UserRole } from '@shared/types/userRole.type';
import { Button } from '../button';
import { useToast } from '@frontend/contexts/ToastContext';
import { Modal } from '../modal';
import type { ActiveManagersToManagerList, ActiveProfessorsToManagerList, ActiveStudentsToManagerList } from '@shared/types/dtos/managerUsersList.dto';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { UserService } from '@frontend/services/user.service';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';

type Props = {
  onBack   : () => void;
  filteredUsersListDataByRoleMap : (ActiveManagersToManagerList | ActiveStudentsToManagerList | ActiveProfessorsToManagerList)[];
  userRoleList : UserRole;
};

const DeleteUsers = (props:Props): React.JSX.Element => {

  const { user } = useAuth();
  
  if (!user) return <Navigate to='/'/>

  const { toast } = useToast();

  const loggedUserId = user.id; 

  const [modal, setModal] = useState<'REMOVE_USERS' | null>(null);
  const [excludeUserSearchValue, setExcludeUserSearchValue] = useState<string>('');
  const [usersToDelete, setUsersToDelete] = useState<number[]>([]);
  
  const filteredUsersToDelete = props.filteredUsersListDataByRoleMap.filter((user) => {
    const search = excludeUserSearchValue.toLowerCase();

    const searchByName = user.name.toLowerCase().includes(search);
    const searchById   = user.id.toString().includes(search);

    return searchByName || searchById;
  });

  const usersAvailableToDelete = filteredUsersToDelete.filter(
    (user) => user.id !== loggedUserId
  );

  const handleExcludeUsers = async(ids: number[]): Promise<void> => {
    try {
      const response = await UserService.excludeUsers(ids);

      if (response.success) {
        toast(response.message);

        setModal(null);
        props.onBack();
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
  };

  const handleAddNewUserToDelete = (id: number) => {
    setUsersToDelete((prev) => {

      const alreadySelected = prev.includes(id);

      if (alreadySelected) {
        return prev.filter((userId) => userId !== id);
      }

      return [...prev, id];
    });
  };

  return (
    <>
      <Modal.ConfirmAction
        title='Excluir usuário(s)'
        message='Tem certeza em excluir esse(s) usuário(s)?'
        visible={modal === 'REMOVE_USERS'}
        onAccept={() => handleExcludeUsers(usersToDelete)}
        onCloseRequest={() => setModal(null)}
      />

      <div className='relative flex flex-col items-center p-2 gap-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
        <button 
        onClick={props.onBack}
        className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'>
          <FaArrowCircleLeft size={20}/>
        </button>
        
        <h3 className='font-semibold text-lg text-cyan-500'>
          Excluir usuários
        </h3>

        <div className='w-full'>
          <Input.Search
            onChange={(e) => setExcludeUserSearchValue(e.target.value)}      
            onClear={() => setExcludeUserSearchValue('')}
            placeholder='Pesquisar por nome' 
            value={excludeUserSearchValue}
          />
        </div>

        { usersToDelete.length > 0 &&
          <Button.Default
            label='Excluir'
            onClick={() => setModal('REMOVE_USERS')}
            customStyle={{ button: 'py-2 text-sm text-red-500 border-red-500 bg-red-100 font-semibold' }}
            Icon={() => <FaTrashAlt/>}
          />
        }

        <div className='flex-1 min-h-0 w-full flex flex-col border gap-2 overflow-auto bg-white p-2 rounded-xl border-cyan-300'>
          { usersAvailableToDelete.length > 0 ? (
            usersAvailableToDelete.map(( user ) => {
              
              const isSelected = usersToDelete.includes(user.id);

              return (
                <button 
                key={user.id}
                onClick={() => handleAddNewUserToDelete(user.id)}
                className={`
                  relative px-3 py-2 border text-left flex items-center gap-4 rounded-lg cursor-pointer transition
                  ${isSelected 
                    ? 'border-red-400 bg-red-100/60' 
                    : 'border-orange-300 bg-amber-50/50 hover:brightness-95 active:brightness-90'
                  }
                `}
                >              
                  {isSelected && <FaTrashAlt className='absolute top-3 right-3 text-red-500'/>}

                  <div className='pointer-events-none'>
                    <ExpansibleImage
                      image={{
                        name : user.name,
                        uri  : user.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
                        size : 'h-12 w-12'
                      }}
                    />
                  </div>

                  <div className='flex flex-col flex-1'>
                    <h3 className='font-bold text-orange-400 text-sm break-all w-fit'>
                      { user.name }
                    </h3>

                    <span className='text-xs text-orange-400 font-semibold'>
                      Identificador: <span className='text-green-500 font-bold'>{ user.id }</span>
                    </span>     

                    <span className='text-cyan-400 font-semibold text-xs'>
                      { USER_ROLES[props.userRoleList] } 
                    </span>
                  </div>  
                </button>       
            )})
          ) : (
            <NoContent
              Icon={() => <FaUserXmark size={22}/>}
              message={excludeUserSearchValue
                ? `Nenhum resultado para "${excludeUserSearchValue}"`
                : 'Nenhum usuário disponível para exclusão'
              }
            />
          )}
        </div>
      </div>
    </>
  )
}

export default DeleteUsers