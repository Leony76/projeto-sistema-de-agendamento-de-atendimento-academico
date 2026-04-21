import React, { useState } from 'react'
import Layout from './Layout'
import { FaArrowCircleLeft, FaExclamation, FaFilter } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import '@/css/calendar.css';
import type { Professor } from '@/types/professor.type';
import { Button } from '@/components/button';
import { AVAILABLE_DAYS_MAP } from '@/constants/maps/days.map';

const PROFESSORS_DATA: Professor[] = [
  {
    id: 1,
    name: 'Cloud Strife',
    photo: 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop',
    discipline: 'ENGLISH',
    available: {
      days: ['FRIDAY', 'SATURDAY', 'TUESDAY', 'FRIDAY', 'SATURDAY', 'TUESDAY'],
      hours: ['10:00', '13:00', '15:00', '11:00', '16:00', '15:00', '11:00', '16:00'],
    },
  },
  {
    id: 2,
    name: 'Madara Uchiha',
    discipline: 'GEOGRAPHY',
    photo: 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    available: {
      days: ['MONDAY', 'THURSDAY', 'WEDNESDAY'],
      hours: ['16:00', '11:00', '14:00'],
    },
  },
];

const Schedule = ():React.JSX.Element => {

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const [showToScheduleForm, setShowToScheduleForm] = useState<boolean>(false);

  const [selectedProfessorData, setSelectedProfessorData] = useState<Professor | null>(null);

  return (
    <Layout selectedTab='TO_SCHEDULE'>
      <div className={`
        grid gap-x-3 h-full min-h-0 
        ${showToScheduleForm
          ? 'grid-cols-[1fr_300px]'
          : 'grid-cols-1 mx-15'
        }
      `}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Professores
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
              { PROFESSORS_DATA.map(( professor ) => (
                <Card.ProfessorInfos
                  key={professor.id}
                  { ...professor }
                  onClick={{ toSchedule: () => {
                    setShowToScheduleForm(true);
                    setSelectedProfessorData(professor);
                  }}}
                />
              ))}
            </div>
          </div>
        </div>
        
        { showToScheduleForm &&
          <div className='grid grid-rows-[1fr] min-h-0 gap-y-3'>
            <div className='relative flex flex-col min-h-0 h-full overflow-hidden px-3 py-2 gap-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
              <button 
              className='absolute top-3'
              onClick={() => setShowToScheduleForm(false)}
              >
                <FaArrowCircleLeft className='text-cyan-500 cursor-pointer text-xl hover:brightness-95 active:brightness-90'/>
              </button>
            
              <h3 className='font-semibold self-center text-lg text-cyan-500'>
                Agendamento
              </h3>

              <p className='text-orange-400 text-xs break-all'>
                Informações a respeito do agendamento a ser realizado.
              </p>

              <div className='flex-1 min-h-0 overflow-auto py-1 flex flex-col gap-2 border-y border-cyan-100'>
                <Input.Default
                  label='Professor'
                  customStyle={{ input: 'py-1!' }}
                  value={selectedProfessorData?.name}
                />

                <div className='space-y-1'>
                  <h4 className='text-sm font-semibold text-orange-500'>
                    Dias disponíveis
                  </h4>

                  <p className='text-xs text-gray-400'>
                    Escolha o dia para o atendimento:
                  </p>

                  <div className='flex flex-wrap gap-2 mt-2'>
                    { selectedProfessorData?.available.days.map(( day ) => (
                      <Button.Default
                        label={AVAILABLE_DAYS_MAP[day].split('-')[0]}
                        onClick={() => {}}
                        customStyle={{
                          button: 'w-fit! py-1 px-4! rounded-lg! text-xs font-semibold',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className='space-y-1'>
                  <h4 className='text-sm font-semibold text-orange-500'>
                    Horários disponíveis
                  </h4>

                  <p className='text-xs text-gray-400'>
                    Escolha um horário disponível do professor:
                  </p>

                  <div className='flex flex-wrap gap-2 mt-2'>
                    { selectedProfessorData?.available.hours.map(( hour ) => (
                      <Button.Default
                        label={hour}
                        onClick={() => {}}
                        customStyle={{
                          button: 'w-fit! py-1 px-4! rounded-lg! text-xs font-bold',
                        }}
                      />
                    ))}
                  </div>

                  <Input.TextArea
                    label='Motivo'
                    maxLength={50}
                    value={textAreaValue}
                    onChange={(e) => setTextAreaValue(e.target.value)}
                  />

                  <Button.Default
                    label='Solicitar agendamento'
                    onClick={() => {}}
                    Icon={() => <FaExclamation />}
                    customStyle={{ button: 'py-1.5! font-semibold' }}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </Layout>
  )
}

export default Schedule