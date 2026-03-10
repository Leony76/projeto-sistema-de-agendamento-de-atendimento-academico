import { IoIosLogOut } from "react-icons/io";
import style from './css/AuthLayout.module.css';
import { LuLayoutDashboard } from "react-icons/lu";
import { TfiAgenda } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import { PiStudent } from "react-icons/pi";
import { SystemTabs } from "../../types/systemTabs";

type Props = {
  children: React.ReactNode;
  tabSelected: SystemTabs;
};

const AuthLayout = ({
  children,
  tabSelected,
}:Props) => {
  const { user, signOut } = useAuth(); 

  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

  const handleLogout = async() => signOut();

  const isStudent = user?.role === 'STUDENT';

  return (
    <>
    <div className={style.layout_container}>
      <header>
        <nav className={style.header_nav_bar}>
          <ul>
            <li className={style.system_name}>
              Agendamento acadêmico online
            </li>
            {isStudent && (
              <>
                <li className={style.student_name}>
                  <span> Aluno: </span> {user?.name}
                </li>
                <li className={style.student_ra}>
                  <span> RA: </span> {user.ra}
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <aside >
          <nav>
            <ul>
              <Link className={tabSelected === 'HOME'
                ? style.selected_tab : ''
              } to={'/home'}>
                <LuLayoutDashboard/>
                Geral
              </Link>
              <Link className={tabSelected === 'APPOINTMENTS'
                ? style.selected_tab : ''
              } to={'/schedules'}>
                <TfiAgenda/>
                Agendamentos
              </Link>
              {!isStudent && (
                <Link className={tabSelected === 'STUDENTS'
                  ? style.selected_tab : ''
                } to={'/students'}>
                  <PiStudent />
                  Alunos
                </Link>
              )}

              <button
              className={style.logout}
              onClick={() => setActiveModal("LOGOUT_CONFIRM")}
              >
                <IoIosLogOut size={20}/>
                Sair
              </button>
            </ul>
          </nav>
        </aside>
        <section style={{padding: '10px 15px'}}>
          {children}
        </section>
      </main>
      <footer>
        <span>
          &copy; Agendamento acadêmico online,<br/> Todos os Direitos Reservados.
        </span>
      </footer>
    </div>

    <Modal 
    title={"Sair"} 
    isOpen={activeModal === 'LOGOUT_CONFIRM'} 
    onCloseActions={() => setActiveModal(null)} 
    message="Tem certeza em sair do sistema?"
    hasXClose
    >
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '10px',
      }}>
        <Button 
        buttonStyle={{
          fontSize: "MD",
          border: "MD",
          color: "SECONDARY",
          filled: false
        }}
        onClick={handleLogout}>
          Confirmar
        </Button>
        
        <Button 
        buttonStyle={{  
          fontSize: "MD",
          border: "MD",
          color: "PRIMARY",
          filled: false
        }}
        onClick={() => setActiveModal(null)}>
          Cancelar
        </Button>
      </div>
    </Modal>
    </>
  )
}

export default AuthLayout