import React, { useState } from 'react'
import Layout from './Layout'
import { FaFilter } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import '@/css/calendar.css';
import type { Solicitation } from '@/types/solicitation.type';
import { filterStudentSolicitations } from '@/utils/filters/filterStudentSolicitations.util';
import NoContent from '@/components/misc/NoContent';
import { STUDENT_SOLICITATIONS_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentSolicitations.map.filter';
import { FaPersonCircleQuestion, FaClipboardQuestion } from 'react-icons/fa6';

const SOLICITATIONS_DATA: Solicitation[] = [
  {
    id: 1,
    name: 'Cloud Strife',
    photo: 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop',
    discipline: 'ENGLISH',
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    status: 'UNCONFIRMED',
  },
  {
    id: 2,
    name: 'Madara Uchiha',
    discipline: 'GEOGRAPHY',
    photo: 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CONFIRMED',
  },
  {
    id: 3,
    name: 'Sasuke Uchiha',
    discipline: 'CHEMISTRY',
    photo: 'https://pop.proddigital.com.br/wp-content/uploads/sites/8/2024/04/01-32.jpg',
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CANCELED',
  },
];

const Requests = ():React.JSX.Element => {

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const filteredStudentSolicitations = filterStudentSolicitations(
    SOLICITATIONS_DATA,
    searchValue,
    filterValue,
  ); 

  return (
    <Layout selectedTab='REQUESTS'>
      <div className={`grid gap-x-3 h-full min-h-0 grid-cols-1 mx-15`}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Solicitações
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por professor, disciplina, data, horário ou status da solicitação'
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='STUDENT_SOLICITATIONS_FILTER'
                value={filterValue}
                onSelect={setFilterValue}
              />
            </div>

            <div className='flex-1 min-h-0 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              {filteredStudentSolicitations.length > 0 ? (
                <div className='grid items-start gap-2 auto-rows-min grid-cols-1 md:grid-cols-2'>
                  {filteredStudentSolicitations.map(( solicitation ) => (
                    <Card.Solicitation
                      key={solicitation.id}
                      { ...solicitation }
                    />
                    ))}
                </div>
              ) : (
                <NoContent
                  Icon={(searchValue || filterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && filterValue
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${STUDENT_SOLICITATIONS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_SOLICITATIONS_FILTER_VALUE_MAP]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${STUDENT_SOLICITATIONS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_SOLICITATIONS_FILTER_VALUE_MAP]}"`
                      : `Nenhuma solicitação no momento!`
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Requests