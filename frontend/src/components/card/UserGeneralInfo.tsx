import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import ExpansibleImage from '../misc/ExpansibleImage';
import { FaTrashAlt } from 'react-icons/fa';
import type { ActiveStudentsToManagerList, ActiveManagersToManagerList, ActiveProfessorsToManagerList } from '@shared/types/dtos/managerUsersList.dto';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { UserService } from '@frontend/services/user.service';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { Modal } from '../modal';

type Props = {
  onClick: {
    userDetails : () => void;
    exclude     : () => void;
  },
} & (
  | ActiveStudentsToManagerList   & { from: 'STUDENT'   } 
  | ActiveProfessorsToManagerList & { from: 'PROFESSOR' }
  | ActiveManagersToManagerList   & { from: 'MANAGER'   }
);

const UserGeneralInfo = (props:Props): React.JSX.Element => {

  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) return <Navigate to={'/'}/>

  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const [modal, setModal] = useState<'REMOVE_USER' | null>(null);
  

  const handleExcludeUser = async(id: number[]): Promise<void> => {
    try {
      const response = await UserService.excludeUsers(id);

      if (response.success) {
        toast(response.message);
        
        setModal(null);
        props.onClick.exclude();
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
  };

  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
  const disciplines = props.from === 'PROFESSOR' 
    ? props.disciplines.map((name) => name)
    : []
  ;

  return (
    <>
      <Modal.ConfirmAction
        title='Excluir usuário'
        message={`Tem certeza em excluir ${props.name.split(' ')[0]} ?`}
        visible={modal === 'REMOVE_USER'}
        onAccept={() => handleExcludeUser([props.id])}
        onCloseRequest={() => setModal(null)}
      />

      <div className='relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
        <div 
        ref={containerRef}
        className={`absolute top-2 right-2 flex gap-1 flex-row-reverse`}>
          <button 
          onClick={() => setMoreOptions(prev => !prev)}
          className='text-orange-400 self-start mt-px text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1'
          >
            <BsThreeDotsVertical />
          </button>

          { moreOptions &&
            <div className='flex flex-col rounded-b-xl rounded-tl-xl'>
              { props.from === 'STUDENT' && 
                <button className='bg-yellow-50 border border-yellow-500 text-yellow-600 flex items-center gap-1 rounded-tl-lg px-5 p-1 justify-center cursor-pointer text-sm hover:brightness-95 active:brightness-90'>
                  <MdEdit />
                  Editar
                </button>
              }

              { user.id === props.id && 
                <button className='bg-yellow-50 border border-yellow-500 text-yellow-600 flex items-center gap-1 rounded-lg rounded-tr-none px-5 p-1 justify-center cursor-pointer text-sm hover:brightness-95 active:brightness-90'>
                  <MdEdit />
                  Editar perfil
                </button>
              }

              { user.id !== props.id && 
                <button 
                onClick={() => setModal('REMOVE_USER')}
                className={`
                  bg-red-50 border border-red-300 text-red-500 flex items-center gap-1 px-5 p-1 cursor-pointer text-sm hover:brightness-95 active:brightness-90
                  ${props.from === 'STUDENT' ? 'rounded-b-lg' : 'rounded-lg'}
                `}>
                  <FaTrashAlt/>
                  Excluir
                </button>
              }  
            </div>
          }  
        </div>
        
        
        <ExpansibleImage
          image={{
            name : props.name,
            uri  : props.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
            size : 'h-25 w-25'
          }}
        />

        <div className='flex flex-col gap-1 flex-1'>
          <h3 
          className='font-bold text-orange-400 break-all hover:underline cursor-pointer active:underline-offset-0 w-fit'
          onClick={props.onClick.userDetails}
          >
            { props.name } { props.id === user.id && '(Você)' }
          </h3>
          
          <div className='flex flex-col'>
            <label className='text-xs text-orange-400 font-semibold'>
              Identificador: <span className='text-green-500 font-bold'>{ props.id }</span>
            </label>

            <label className='text-xs text-orange-400 font-semibold'>
              E-mail: <span className='text-cyan-500 font-normal'>{ props.email }</span>
            </label>

            { props.from === 'STUDENT' &&        
              <label className='text-xs text-orange-400 font-semibold'>
                RA: <span className='text-cyan-500 font-normal'>{ props.ra }</span>
              </label>
            }

            { props.from === 'PROFESSOR' && 
              <label className='text-xs text-orange-400 font-semibold'>
                Disciplina: <span className='text-cyan-500 font-normal'>{ formatter.format(disciplines) }</span>
              </label>
            }

            <label className='text-xs text-orange-400 font-semibold'>
              Data de cadastro: <span className='text-cyan-500 font-normal'>{ formatDateTime(props.registeredAt) }</span>
            </label>
          </div>
        </div>  
      </div>
    </>
  );
}

export default UserGeneralInfo