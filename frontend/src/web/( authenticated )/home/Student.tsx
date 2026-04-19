import React, { useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@/components/input';

const Student = ():React.JSX.Element => {

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={28}/>             , label: 'Agendamentos feitos'             , value: 2       },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: 3       },
    { icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próximo agendamento'     , value: '16:30' },
  ];

  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Layout>
      <div className='grid grid-cols-[1fr_300px] gap-x-3 h-full'>
        <div className='grid gap-y-3 grid-rows-[60px_1fr]'>
          <div className='flex gap-5'>
            { BRIEF_RENDER.map((item) => (
              <div className='flex border justify-evenly items-center border-cyan-400 rounded-lg bg-cyan-100/20 flex-1'>
                { item.icon }
                
                <div className='flex flex-col '>
                  <h4 className=' text-cyan-500'>
                    { item.label }
                  </h4>

                  <span className='text-lg font-semibold -mt-1 text-orange-500/50'>
                    { item.value }
                  </span>
                </div>
              </div>
            )) }
          </div>

          <div className='flex gap-3 py-2 px-3 flex-col items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='font-semibold text-lg text-cyan-500'>
              Agendamentos
            </h3>

            <div className='w-full'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                value={searchValue}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-rows-[2fr_1fr] gap-y-3'>
          <div className='border border-cyan-400 rounded-lg bg-cyan-100/20'>
            
          </div>

          <div className='border border-cyan-400 rounded-lg bg-cyan-100/20'>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Student