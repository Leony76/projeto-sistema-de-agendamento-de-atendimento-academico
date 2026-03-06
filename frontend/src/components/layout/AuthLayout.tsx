import { IoIosLogOut } from "react-icons/io";
import style from './css/AuthLayout.module.css';
import { LuLayoutDashboard } from "react-icons/lu";
import { TfiAgenda } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../modal/Modal";
import Button from "../button/Button";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({children}:Props) => {
  const { user, loading, signOut } = useAuth(); 

  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  const navigate = useNavigate();

  const handleLogout = async() => signOut();

  const isStudent = user?.role;

  return (
    <>
    <div className={style.layout_container}>
      <header>
        <nav className={style.header_nav_bar}>
          <ul>
            <li className={style.system_name}>
              Agendamento acadêmico online
            </li>
            <>
              <li className={style.student_name}>
                <span> Aluno: </span> {user?.name}
              </li>
              <li className={style.student_ra}>
                <span> RA: </span> 20241180209
              </li>
            </>
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
        <Button buttonType={"modalProceedButton"}
        onClick={handleLogout}>
          Confirmar
        </Button>
        
        <Button 
        buttonType={"modalReturnButton"}
        onClick={() => setActiveModal(null)}>
          Cancelar
        </Button>
      </div>
    </Modal>
    </>
  )
}

export default AuthLayout