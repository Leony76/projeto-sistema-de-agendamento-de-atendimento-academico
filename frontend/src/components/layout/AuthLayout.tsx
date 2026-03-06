import { IoIosLogOut } from "react-icons/io";
import style from './css/AuthLayout.module.css';
import { LuLayoutDashboard } from "react-icons/lu";
import { TfiAgenda } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({children}:Props) => {
  const { user, loading, signOut } = useAuth(); 

  return (
    <div className={style.layout_container}>
      <header>
        <nav className={style.header_nav_bar}>
          <ul>
            <li className={style.system_name}>
              Agendamento acadêmico online
            </li>
            <li className={style.student_name}>
              <span> Aluno: </span> Leony Leandro Barros
            </li>
            <li className={style.student_ra}>
              <span> RA: </span> 20241180209
            </li>
            <li className={style.logout}>
              <IoIosLogOut size={20}/>
              Sair
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <aside >
          <nav>
            <ul>
              <Link to={'/home'}>
                <LuLayoutDashboard/>
                Geral
              </Link>
              <Link to={'/schedules'}>
                <TfiAgenda/>
                Agendamentos
              </Link>
            </ul>
          </nav>
        </aside>
        <section>
          {children}
        </section>
      </main>
      <footer>
        <span>
          &copy; Agendamento acadêmico online,<br/> Todos os Direitos Reservados.
        </span>
      </footer>
    </div>
  )
}

export default AuthLayout