import { FaCalendarAlt } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout"
import { BsFillClockFill } from "react-icons/bs";
import GeneralInfosCard from "./components/Home/GeneralInfosCard";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaCalendarDay } from "react-icons/fa6";
import style from './css/Home.module.css';
import { PiStudentBold } from "react-icons/pi";
import { Input } from "../components/input";
import Select from "../components/select/Select";

const Home = () => {

  const generalInfosMap = [
    {icon: FaCalendarAlt    , title: "Agendamentos hoje"       , metric: 12},
    {icon: BsFillClockFill  , title: "Agendamentos pendentes"  , metric: 12},
    {icon: FaCalendarCheck  , title: "Atendimentos concluídos" , metric: 12},
    {icon: FaCalendarDay    , title: "Atendimentos hoje"       , metric: 12},
    {icon: PiStudentBold    , title: "Alunos"                  , metric: 12},
  ];

  return (
    <AuthLayout tabSelected="HOME">
      <div className={style.main_grid_container}>
        <div className={style.left_grid_container}>
          <div className={style.general_infos_container}>
            {generalInfosMap.map((info) => (
              <GeneralInfosCard
                key={info.title}
                icon={info.icon}
                title={info.title}
                metric={info.metric}
              />
            ))}
          </div>
          <div className={style.appointments_list_container}>
            <h3>
              Agendamentos
            </h3>
            
            <div className={style.searchbar_filter_container}>
              <Input.Search
                placeholder={'Pesquisar por agendamento'}
                className={style.search}
              />

              <Select 
                variant={"SEARCH"} 
                selectSchema={"SEARCH_STUDENTS_FILTER"}                
              />
            </div>

            <div className={style.appointments_list}>
              <div className={style.list_overflow_y}>
                
              </div>
            </div>
          </div>
        </div>
        <div className={style.right_grid_container}>
          <div className={style.calendar_container}>
            
          </div>
          <div className={style.today_appointments_container}>

          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Home