import * as React from 'react';
import style from './css/Login.module.css';

const Login = () => {

  const handleLogin = async(e:React.SubmitEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();


  }
  
  return (
    <main className={style.main_container}>
      <div className={style.site_title}>
        <h1>
          Sistema de agendamento de atendimento acadêmico
        </h1>
      </div>
      <div className={style.login_inputs}>
        <form 
        onSubmit={handleLogin}
        className={style.form_container}
        >
          <div className={style.input_container}>
            <label htmlFor="user">
              Usuário:
            </label>
            <input 
              name='user'
              id='user'
              type="text"
              minLength={11}
              maxLength={11}
              max={99999999999}
              min={0} 
              required
              placeholder='Insira o usuário'
            />
          </div>

          <div className={style.input_container}>
            <label htmlFor="password">
              Senha:
            </label>
            <input 
              name='password'
              id='password'
              type="number"
              minLength={8}
              maxLength={50}
              required
              placeholder='Insira a senha'
            />
          </div>

          <button className={style.submit_button}>
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login