import { IconType } from 'react-icons';
import style from './css/GeneralInfosCard.module.css';

type Props = {
  title: string;
  icon: IconType;
  metric: number | string;
};

const GeneralInfosCard = ({
  title,
  icon: Icon,
  metric, 
}:Props) => {
  return (
    <div className={style.container}>
      <span>
        <Icon/>
        {title}
      </span>
      <h3>
        {metric}
      </h3>
    </div>
  )
}

export default GeneralInfosCard