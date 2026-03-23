import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Button from '../button/Button';
import style from './css/PaginationButtons.module.css';

type Props = {
  page: {
    next     : () => void;
    previous : () => void;
    current  : number;
    total    : number;
  }
}

const PaginationButtons = ({ page }:Props) => {
  return (
    <div className={style.pagination_container}>
      {page.current !== 1 &&
        <Button 
        className={style.return}
        onClick={page.previous}
        buttonStyle={{
          border:   "MD",
          fontSize: "MD",
          color:    "PRIMARY",
          filled:   false
        }}
        >
          <FaArrowLeft />
          Anterior
        </Button>
      }
      
      <span>
        {page.current} / {page.total}
      </span>
      
      {page.current !== page.total &&
        <Button
        className={style.proceed}
        disabled={page.current === page.total}
        onClick={page.next} 
        buttonStyle={{
          border:   "MD",
          fontSize: "MD",
          color:    "PRIMARY",
          filled:   false
        }}
        >
          Próximo
          <FaArrowRight />
        </Button>
      }
    </div>
  )
}

export default PaginationButtons