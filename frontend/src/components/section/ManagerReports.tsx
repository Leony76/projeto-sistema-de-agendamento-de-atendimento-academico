import type { SystemReports } from '@shared/types/reports.type';
import { formatPercentage } from '@frontend/utils/formats/formatPercentage.util';
import type React from 'react';
import { FaArrowCircleLeft, FaCalendarAlt, FaExclamation, FaHouseUser, FaPercent } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';
import NoContent from '../misc/NoContent';
import { FaClipboardQuestion } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { useToast } from '@frontend/contexts/ToastContext';
import { MiscService } from '@frontend/services/misc.service';

type Props = {
  onBack: () => void;
};

const ManagerReports = (props:Props): React.JSX.Element => {

  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [systemReports, setSystemReports] = useState<SystemReports | null>(null);

  const ListItem = (props: {label: string, value: string | number}):React.JSX.Element => {
    return (
      <li className='text-orange-400 font-semibold ml-1'>
        { props.label }: {''}
        <span className='text-cyan-500 font-normal'> 
          { props.value }
        </span>
      </li> 
    );
  };

  if (!loading && !systemReports) return (
    <div className='relative flex flex-col gap-2 items-center p-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      onClick={props.onBack}
      className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'>
        <FaArrowCircleLeft size={20}/>
      </button>
      
      <h3 className='font-semibold text-lg text-cyan-500'>
        Relatórios
      </h3>

      <div className='flex flex-col flex-1 min-h-0 w-full border gap-1 overflow-auto bg-white p-3 rounded-xl border-cyan-300'>
        <NoContent 
          Icon={() => <FaClipboardQuestion size={20}/>}
          message='Não foi possível carregar os relatórios do sistema!'
        />
      </div>
    </div> 
  );

  const reportsRenderMap = {
    appointments: [
      { label: 'Totais'      , value: systemReports?.appointments.count     },
      { label: 'Feitos'      , value: systemReports?.appointments.done      },
      { label: 'Cancelados  ', value: systemReports?.appointments.canceled  },
    ],
    solicitations: [
      { label: 'Totais'      , value: systemReports?.solicitations.count    },
      { label: 'Aceitos'     , value: systemReports?.solicitations.accepted },
      { label: 'Rejeitados  ', value: systemReports?.solicitations.rejected },
    ],
    rooms: [
      { label: 'Reservados'  , value: systemReports?.rooms.reserved  },
      { label: 'Disponíveis' , value: systemReports?.rooms.available },
    ],
    registered: [
      { label: 'Alunos'      , value: systemReports?.registered.students   },
      { label: 'Professores' , value: systemReports?.registered.professors },
      { label: 'Gestores'    , value: systemReports?.registered.managers   },
    ],
    rate: [
      { label: 'Cancelamento de atendimentos'      , value: systemReports?.rate.appointments.cancellation },
      { label: 'Desistência de agendamento'        , value: systemReports?.rate.appointments.withdrawal   },
      { label: 'Comparecimento a agendamento'      , value: systemReports?.rate.appointments.attendance   },
      { label: 'Aceitação a solicitação de alunos' , value: systemReports?.rate.solicitations.acceptance  },
      { label: 'Rejeição a solicitação de alunos'  , value: systemReports?.rate.solicitations.rejection   },
    ],
  } as const;

  useEffect(() => {
    (async() => {
      try {
        const reports = await MiscService.getSystemReports();

        setSystemReports(reports);
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className='relative flex flex-col gap-2 items-center p-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      onClick={props.onBack}
      className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'>
        <FaArrowCircleLeft size={20}/>
      </button>
      
      <h3 className='font-semibold text-lg text-cyan-500'>
        Relatórios
      </h3>

      <div className='flex flex-col flex-1 min-h-0 w-full border gap-1 overflow-auto bg-white p-2 rounded-xl border-cyan-300'> 
        <h4 className='text-orange-500 font-semibold flex items-center gap-1'>
          <FaCalendarAlt />
          Agendamentos
        </h4>
        
        <ul className='list-disc list-inside text-xs space-y-1'>
          { reportsRenderMap.appointments.map(( item ) => (
            <ListItem 
              label={ item.label }
              value={ item.value ?? '?' } 
            />
          ))}
        </ul>

        <h4 className='text-orange-500 font-semibold flex items-center gap-1'>
          <FaExclamation />
          Solicitações
        </h4>

        <ul className='list-disc list-inside text-xs space-y-1'>
          { reportsRenderMap.solicitations.map(( item ) => (
            <ListItem 
              label={ item.label }
              value={ item.value ?? '?' }
            />
          ))}
        </ul>

        <h4 className='text-orange-500 font-semibold flex items-center gap-1'>
          <MdMeetingRoom />
          Locais de encontro
        </h4>

        <ul className='list-disc list-inside text-xs space-y-1'>
          { reportsRenderMap.rooms.map(( item ) => (
            <ListItem 
              label={ item.label }
              value={ item.value ?? '?' }
            />
          ))}
        </ul>

        <h4 className='text-orange-500 font-semibold flex items-center gap-1'>
          <FaHouseUser />
          Usuários registrados
        </h4>

        <ul className='list-disc list-inside text-xs space-y-1'>
          { reportsRenderMap.registered.map(( item ) => (
            <ListItem 
              label={ item.label }
              value={ item.value ?? '?' } 
            />
          ))}
        </ul>

        <h4 className='text-orange-500 font-semibold flex items-center gap-1'>
          <FaPercent size={15} />
          Indices 
        </h4>

        <ul className='list-disc list-inside text-xs space-y-1'>
          { reportsRenderMap.rate.map(( item ) => (
            <ListItem 
              label={ item.label }
              value={ formatPercentage(item.value ?? 0) } 
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ManagerReports