import { AVAILABLE_DAYS_MAP } from '@shared/utils/days.map';
import React from 'react'
import { Button } from '../button';
import { BsCheckSquareFill } from 'react-icons/bs';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';

type Props = AvailableProfessorToScheduleResponse & {
  onClick: {
    toSchedule: () => void;
  };
};

const ProfessorInfos = (props:Props): React.JSX.Element => {

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
  const professorDisciplines = props.disciplines.map((discipline) => discipline);
  const professorAvailableDays = props.availableDays.map((day) => AVAILABLE_DAYS_MAP[day]);

  return (
    <div className='px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      <ExpansibleImage
        image={{
          name : props.name,
          uri  : props.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
          size : 'h-26 w-26'
        }}
      />

      <div className='flex flex-col gap-1'>
        <h3 className='font-bold text-orange-400'>
          { props.name }
        </h3>   

        <div className='flex flex-col text-xs'>
          <label className='text-orange-400 font-semibold'>
            Disciplina(s): <span className='text-cyan-500 font-normal'> { formatter.format(professorDisciplines) } </span>
          </label>

          <label className='text-orange-400 font-semibold'>
            Dias disponíveis: <span className='text-cyan-500 font-normal'> { formatter.format(professorAvailableDays) } </span>
          </label>
        </div>

        <Button.Default
          label='Agendar'
          Icon={() => <BsCheckSquareFill />}
          onClick={props.onClick.toSchedule}
          customStyle={{
            button: 'w-fit! py-1 pb-1.5 my-1 mt-2 px-4! rounded-lg! text-sm',
            icon: 'mt-0.5'
          }}
        />
      </div>

    </div>
  )
}

export default ProfessorInfos