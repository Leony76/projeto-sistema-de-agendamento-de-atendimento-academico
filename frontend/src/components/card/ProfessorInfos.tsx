import { AVAILABLE_DAYS_MAP } from '@/constants/maps/days.map';
import { DISCIPLINES_MAP } from '@/constants/maps/disciplines.map';
import type { Professor } from '@/types/professor.type';
import React from 'react'
import { Button } from '../button';
import { BsCheckSquareFill } from 'react-icons/bs';
import ExpansibleImage from '../misc/ExpansibleImage';

type Props = Professor & {
  onClick: {
    toSchedule: () => void;
  };
};

const ProfessorInfos = (props:Props): React.JSX.Element => {

  return (
    <div className='px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      <ExpansibleImage
        image={{
          name : props.name,
          uri  : props.photo,
          size : 'h-30 w-30'
        }}
      />

      <div className='flex flex-col'>
        <h3 className='font-bold text-orange-400'>
          { props.name }
        </h3>   

        <label className='text-sm text-orange-400 font-semibold'>
          Disciplina: <span className='text-cyan-500 font-normal'>{ DISCIPLINES_MAP[props.discipline] }</span>
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Dias disponíveis: { props.available.days.map((day, index) => (
            <span 
            key={index}
            className='text-cyan-500 font-normal'
            >
              { AVAILABLE_DAYS_MAP[day] }
              {index === props.available.days.length - 2
                ? ' e '
                : index < props.available.days.length - 2
                ? ', '
                : ''
              }
            </span>
          )) }
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Horários disponíveis: { props.available.hours.map((hour, index) => (
            <span 
            key={index}
            className='text-cyan-500 font-normal'
            >
              { hour }
              {index === props.available.hours.length - 2
                ? ' e '
                : index < props.available.hours.length - 2
                ? ', '
                : ''
              }
            </span>
          )) }
        </label>

        <Button.Default
          label='Agendar'
          Icon={() => <BsCheckSquareFill />}
          onClick={props.onClick.toSchedule}
          customStyle={{
            button: 'w-fit! py-1 pb-1.5 my-1 mt-2 px-4! rounded-lg!',
            icon: 'mt-0.5'
          }}
        />
      </div>

    </div>
  )
}

export default ProfessorInfos