import { AVAILABLE_DAYS_MAP } from '@frontend/constants/maps/days.map';
import React from 'react'
import { Button } from '../button';
import { BsCheckSquareFill } from 'react-icons/bs';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { ToScheduleProfessors } from '@shared/types/toScheduleProfessors.type';

type Props = ToScheduleProfessors & {
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
          size : 'h-26 w-26'
        }}
      />

      <div className='flex flex-col gap-1'>
        <h3 className='font-bold text-orange-400'>
          { props.name }
        </h3>   

        <div className='flex flex-col text-xs'>
          <label className='text-orange-400 font-semibold'>
            Disciplina(s): { props.disciplines.map(( discipline, index ) => (
              <span 
              key={index}
              className='text-cyan-500 font-normal'
              >
                { discipline }
                {index === props.disciplines.length - 2
                  ? ' e '
                  : index < props.disciplines.length - 2
                  ? ', '
                  : ''
                }
              </span>
            )) }
          </label>

          <label className='text-orange-400 font-semibold'>
            Dias disponíveis: { props.availability.map((item, index) => (
              <span 
              key={index}
              className='text-cyan-500 font-normal'
              >
                { AVAILABLE_DAYS_MAP[item.dayOfWeek] }
                {index === props.availability.length - 2
                  ? ' e '
                  : index < props.availability.length - 2
                  ? ', '
                  : ''
                }
              </span>
            )) }
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