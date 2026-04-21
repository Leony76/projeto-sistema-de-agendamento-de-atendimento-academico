import React, { useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import type { Appointment } from '@/types/appointment.type';
import { Card } from '@/components/card';
import Calendar from 'react-calendar';
import '@/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { formartDateTime } from '@/utils/formatDateTime.util';

const STUDENT_APPOITMENTS_DATA: Appointment[] = [
  {
    id         :  1,
    dateTime   : '2026-10-05T15:00:00.000Z',
    professor  : 'Fabrício Carneiro',
    reason     : 'Lorem ipsum dolor ',
    status     : 'CONFIRMED',
    room       : '1B'
  },
  {
    id         :  2,
    dateTime   : '2026-10-07T16:00:00.000Z',
    professor  : 'Francisco Fábio',
    reason     : 'Lorem ipsum dolorem ',
    status     : 'UNCONFIRMED',
    room       : '1C'
  },
];

const STUDENT_LAST_APPOITMENT: Omit<Appointment, 'status'> = {
  id: 0,
  dateTime   : '2026-10-07T16:00:00.000Z',
  professor  : 'Francisco Fábio',
  reason     : 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  room       : '4A',
};

const Student = ():React.JSX.Element => {

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={28}/>             , label: 'Agendamentos feitos'             , value: 2       },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: 3       },
    { icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próximo agendamento'     , value: '16:30' },
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());

  return (
    <Layout selectedTab='HOME'>
      <div className='grid grid-cols-[1fr_300px] gap-x-3 h-full min-h-0'>
        <div className='grid gap-y-3 grid-rows-[60px_1fr] min-h-0'>
          <div className='flex gap-5 max-w-200 mx-auto w-full'>
            { BRIEF_RENDER.map((item) => (
              <div className='flex border justify-evenly items-center border-cyan-400 rounded-lg bg-cyan-100/20 flex-1'>
                { item.icon }
                
                <div className='flex flex-col '>
                  <h4 className=' text-cyan-500 text-sm'>
                    { item.label }
                  </h4>

                  <span className='text-lg font-semibold -mt-1 text-orange-500/50'>
                    { item.value }
                  </span>
                </div>
              </div>
            )) }
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Agendamentos
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='APPOITMENT_FILTER'
                value={filterValue}
                onSelect={setFilterValue}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { STUDENT_APPOITMENTS_DATA.map((appointment) => (
                <Card.Appoitment.Student
                  key={appointment.id}
                  { ...appointment }
                />
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-rows-[2fr_1fr] gap-y-3 max-h-120'>
          <div className='flex items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <Calendar
              onChange={(value) => setDateSelected(value as Date)}
              value={dateSelected}
              className="custom-calendar"
              prevLabel={<FaCircleChevronLeft/>}
              nextLabel={<FaCircleChevronRight/>}
              prev2Label={null}
              next2Label={null}
            />
          </div>

          <div className='flex flex-col gap-2 border border-cyan-400 p-2 rounded-lg bg-cyan-100/20'>
            <h2 className='text-cyan-500 font-semibold self-center'>
              Último agendamento
            </h2>

            <div className='flex flex-col justify-center bg-white px-2 h-full border rounded-lg border-cyan-300'>
              <div className='flex justify-between items-center'>
                <h3 className='font-bold text-orange-400'>
                  { formartDateTime(STUDENT_LAST_APPOITMENT.dateTime) }
                </h3>        
              </div>
              
              <div className='flex justify-between'>
                <label className='text-sm text-orange-400 font-semibold'>
                  Professor: <span className='text-cyan-500 font-normal'> { STUDENT_LAST_APPOITMENT.professor } </span>
                </label>

                <label className='text-sm text-orange-400 font-semibold'>
                  Sala: <span className='text-cyan-500 font-normal'> { STUDENT_LAST_APPOITMENT.room } </span>
                </label>
              </div>
        
              <label className='text-sm text-orange-400 font-semibold'>
                Motivo: <span className='text-gray-400 font-normal'> { STUDENT_LAST_APPOITMENT.reason.slice(0,50) + '...' } </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Student