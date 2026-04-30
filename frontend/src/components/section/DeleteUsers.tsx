import React, { useState } from 'react'
import { FaArrowCircleLeft, FaTrashAlt } from 'react-icons/fa';
import { Input } from '../input';
import type { RegisteredManager, RegisteredProfessor, RegisteredStudent } from '@/types/registeredUsers.type';
import { USER_ROLES } from '@/constants/maps/userRoles.map';
import { FaUserXmark } from 'react-icons/fa6';
import ExpansibleImage from '../misc/ExpansibleImage';
import NoContent from '../misc/NoContent';
import type { UserRole } from '@/types/userRole.type';
import { Button } from '../button';
import { useToast } from '@/contexts/ToastContext';
import { Modal } from '../modal';

type Props = {
  onBack   : () => void;
  filteredUsersListDataByRoleMap : (RegisteredStudent | RegisteredManager | RegisteredProfessor)[];
  userRoleList : UserRole;
};

const DeleteUsers = (props:Props): React.JSX.Element => {

  const { toast } = useToast();
  const [modal, setModal] = useState<'REMOVE_USERS' | null>(null);
  const [excludeUserSearchValue, setExcludeUserSearchValue] = useState<string>('');
  const [usersToDelete, setUsersToDelete] = useState<(RegisteredStudent | RegisteredManager | RegisteredProfessor)[]>([]);
  
  const filteredUsersToDelete = props.filteredUsersListDataByRoleMap.filter((user) => {
    const search = excludeUserSearchValue.toLowerCase();

    const searchByName = user.name.toLowerCase().includes(search);
    const searchById   = user.id.toString().includes(search);

    return searchByName || searchById;
  });

  const handleDeleteUsers = async(): Promise<void> => {
    toast('Usuários deletados com sucesso!');
    setModal(null);
    props.onBack();
  };

  const handleAddNewUserToDelete = (id:number) => {
    if (!id) return;

    setUsersToDelete((prev) => {
      const alreadySelected = prev.some((user) => user.id === id);

      if (alreadySelected) {
        return prev.filter((user) => user.id !== id);
      }

      const userToAdd = props.filteredUsersListDataByRoleMap.find(
        (user) => user.id === id
      );

      if (!userToAdd) return prev;

      return [...prev, userToAdd];
    });
  };

  return (
    <>
      <Modal.ConfirmAction
        title='Deletar usuário(s)'
        message='Tem certeza em remover esse(s) usuário(s)?'
        visible={modal === 'REMOVE_USERS'}
        onAccept={handleDeleteUsers}
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
          { filteredUsersToDelete.length > 0 ? (
            filteredUsersToDelete.map(( user ) => {
              
              const isSelected = usersToDelete.some((u) => u.id === user.id);

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
                        uri  : user.photo,
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
              message={`Nenhum resultado para "${ excludeUserSearchValue }"`}
              Icon={() => <FaUserXmark size={22}/>}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default DeleteUsers