import { IoIosLogOut } from "react-icons/io";
import style from './css/AuthLayout.module.css';

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({children}:Props) => {
  return (
    <>
      <header>
        <nav className={style.header_nav_bar}>
          <ul>
            <li className={style.system_name}>
              Agendamento acadêmico online
            </li>
            <li>
              <span> Aluno: </span> Leony Leandro Barros
            </li>
            <li>
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
        <aside>

        </aside>
        <section>
          {children}
        </section>
      </main>
      <footer>

      </footer>
    </>
  )
}

export default AuthLayout