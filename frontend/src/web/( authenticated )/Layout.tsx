import React from 'react'

type Props = {
  children : React.ReactNode;
};

const Layout = (props:Props): React.JSX.Element => {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-cyan-100/50 py-2 px-3 border-b border-b-cyan-300'>
        <h3 className='text-cyan-600 text-lg font-semibold'>
          Sistema de Agendamento Acadêmico Online
        </h3>
      </header>

      <div className='flex-1 grid grid-cols-[175px_1fr]'>
        <aside className='border-r border-gray-200 bg-linear-to-b from-cyan-100/50 to-orange-500/5'>

        </aside>

        <main className='p-3'>
          { props.children }
        </main>
      </div>

      <footer className='p-2 bg-orange-500/5 border-t border-t-orange-400 justify-center items-center'>
        <p className='text-center text-orange-400'>
          &copy; Leony Leandro Barros, Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}

export default Layout