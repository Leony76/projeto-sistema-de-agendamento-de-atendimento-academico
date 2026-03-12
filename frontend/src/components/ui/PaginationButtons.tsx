import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Button from '../button/Button';
import style from './css/PaginationButtons.module.css';

type Props = {
  page: {
    next: React.Dispatch<React.SetStateAction<number>>;
    previous: React.Dispatch<React.SetStateAction<number>>;
    current: number;
    total: number;
  }
}

const PaginationButtons = ({ page }:Props) => {
  return (
    <div className={style.pagination_container}>
      {page.current !== 1 &&
        <Button 
        className={style.return}
        onClick={() => page.previous(prev => prev - 1)}
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
        onClick={() => page.next(prev => prev + 1)} 
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