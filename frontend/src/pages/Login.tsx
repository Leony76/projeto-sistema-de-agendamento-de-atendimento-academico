import { useState } from 'react';
import style from './css/Login.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [tab, switchTab] = useState<'STUDENT' | 'MANAGER'>('STUDENT');
  const navigate = useNavigate();

  const handleLogin = async(e:React.SubmitEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();

    if (tab === 'STUDENT') {
      const response = await axios.post('http:localhost:5173/login/student', {
        ra,
        password,
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      navigate('/home');
    } 

    const response = await axios.post('http:localhost:5173/login/manager', {
      email,
      password,
    });

    const { token } = response.data;

    localStorage.setItem('token', token);

    navigate('/home');
  }
  
  return (
    <main className={style[`main_container_${tab === 'STUDENT' 
      ? 'student' 
      : 'manager'
    }`]}>
      <div className={style.left_container}>
        <h1>
          Sistema de agendamento de atendimento acadêmico
        </h1>
      </div>
      <div className={style.right_container}>

        <h2>
          Login
        </h2>
        <h3>
          {tab === 'STUDENT'
            ? 'Aluno'
            : 'Gestor'
          }      
        </h3>

        <form 
        onSubmit={handleLogin}
        className={style.form_container}
        >
          <div className={style.input_container}>
            <label htmlFor="ra">
              {tab === 'STUDENT'
                ? 'RA:'
                : 'E-mail institucional'
              }
            </label>
            <input 
              name='ra'
              id='ra'
              type={tab === 'STUDENT'
                ? 'number'
                : 'email'
              }
              minLength={tab === 'STUDENT' 
                ? 11
                : 50
              }
              maxLength={tab === 'STUDENT' 
                ? 11
                : 50
              }
              max={99999999999}
              min={0} 
              required
              placeholder={tab === 'STUDENT'
                ? 'Insira o registro acadêmico'
                : 'Insira o e-mail institucional'
              }
            />
          </div>

          <div className={style.input_container}>
            <label htmlFor="password">
              Senha:
            </label>
            <input 
              name='password'
              id='password'
              type="password"
              minLength={8}
              maxLength={50}
              required
              placeholder='Insira a senha'
            />
          </div>

          <button className={style.submit_button}>
            Entrar
          </button>

          <button
          className={style.to_manager_login}
          type='button'
          onClick={() => switchTab(tab === 'STUDENT'
            ? 'MANAGER'
            : 'STUDENT'
          )}
          >
            {tab === 'STUDENT' 
              ? 'Entrar como gestor'
              : 'Entrar como aluno'
            }         
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login