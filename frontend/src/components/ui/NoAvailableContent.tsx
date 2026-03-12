import { IconType } from "react-icons";
import style from './css/NoAvailableContent.module.css';

type Props = {
  icon: IconType;
  message: string;
}

const NoAvailableContent = ({message, icon: Icon }:Props) => {
  return (
    <div className={style.main_container}>
      <div className={style.icon_message_container}>
        <Icon/>
        <p>
          {message}
        </p>
      </div>
    </div>
  )
}

export default NoAvailableContent;