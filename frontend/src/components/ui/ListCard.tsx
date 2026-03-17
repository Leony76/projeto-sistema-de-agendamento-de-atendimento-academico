import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import Button from '../button/Button';
import style from './css/ListCard.module.css';

type Props = {
  title       : string;
  crudActions : boolean;
  smTexts     : boolean;
  items: {
    label : string;
    value : string | number;
  }[];
  onClick?: {
    toEdit    : () => void; 
    toRemove  : () => void; 
  };
};

const ListCard = ({
  items,
  onClick,
  crudActions,
  smTexts,
  title,
}:Props) => {
  return (
    <div className={style.user}>
      <div className={style.left_container}>
        <span className={style.name} style={smTexts ? {fontSize: '15px'} : {}}>
          { title }        
        </span>

        {items.map((item) => (
          <span className={smTexts ? style.sm_text : style.md_text}>
            { item.label }: <span className={style.value}> { item.value } </span>
          </span>
        ))}
  
      </div>
      
      {crudActions && (
        <div className={style.right_container}>
          <Button
          onClick={onClick?.toEdit}
          buttonStyle={{
            fontSize: 'MD',
            border: "MD",
            color: 'PRIMARY',
            filled: false,
          }}
          icon={MdEdit}>
            Editar informações
          </Button>
    
          <Button
          buttonStyle={{
            fontSize: 'MD',
            border: "MD",
            color: 'SECONDARY',
            filled: false,
          }}
          onClick={onClick?.toRemove}
          icon={FaTrashAlt}>
            Remover
          </Button>
        </div>
      )}
    </div>
  )
}

export default ListCard;
  


