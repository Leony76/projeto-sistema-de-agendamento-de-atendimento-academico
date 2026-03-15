// import { UseFormRegister, UseFormReset } from 'react-hook-form';
// import style from '../../css/Login.module.css';
// import { Input } from '../../../components/input';
// import Button from '../../../components/button/Button';
// import { SystemRoles } from '../../../types/systemRoles';

// type Props = {
//   onSubmit: { handleLogin: () => void };
//   onClick: { switchTab: React.Dispatch<React.SetStateAction<SystemRoles>> }
//   loading: boolean;
//   error: {
//     ra       : string;
//     password : string;
//   };
//   register : UseFormRegister<{
//     ra       : string;
//     password : string;
//   }>;
//   reset: UseFormReset<{
//     ra: string;
//     password: string;
//   }>;
// };

// const LoginAsStudent = ({
//   onSubmit,
//   error,
//   loading,
//   onClick,
//   register,
//   reset,
// }:Props) => {
//   return (
//     <form 
//     onSubmit={onSubmit.handleLogin}
//     className={style.form_container}
//     >
//       <h3>
//         Aluno      
//       </h3>

//       <Input.Form 
//         autoComplete="email"
//         label={'RA'} 
//         type={'text'} 
//         placeholder={'Insira o RA'} 
//         error={error.ra} 
//         {...register('ra')}
//       />

//       <Input.Form 
//         autoComplete="current-password"
//         label={'Senha'} 
//         type={'password'} 
        
//         placeholder={'Insira a senha'} 
//         error={error.password} 
//         {...register('password')}
//       />

//       <Button 
//       type='submit'
//       buttonStyle={{
//         fontSize: 'XL',
//         border: "XL",
//         color: 'SECONDARY',
//         filled: true,
//       }}
//       loading={loading}
//       >
//         {loading 
//           ? 'Entrando' 
//           : 'Entrar'
//         }
//       </Button>
      
//       <Button
//       type='button'
//       buttonStyle={{
//         fontSize: 'MD',
//         border: "XL",
//         color: 'NEUTRAL',
//         filled: true,
//       }}
//       onClick={() => {
//         onClick.switchTab('PROFESSOR');
//         reset();
//       }}
//       >
//         Entrar como professor 
//       </Button>

//       <Button
//       type='button'
//       buttonStyle={{
//         fontSize: 'MD',
//         border: "XL",
//         color: 'NEUTRAL',
//         filled: true,
//       }}
//       onClick={() => {
//         onClick.switchTab('MANAGER');
//         reset();
//       }}
//       >
//         Entrar como gestor 
//       </Button>
//     </form>
//   )
// }

// export default LoginAsStudent