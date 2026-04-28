import type { RoomDetails } from "@/types/roomStatus.type";
import { formatDateTime } from "@/utils/formats/formatDateTime.util";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdMeetingRoom } from "react-icons/md";
import { Button } from "../button";
import { ROOM_STATUS_MAP } from "@/constants/maps/roomStatus.map";

type Props = {
  onBack        : () => void;
  onRoomDetails : (room: RoomDetails) => void;
  roomDetails   : RoomDetails | null;
  roomsData     : RoomDetails[];
};

const RoomsDetails = (props:Props): React.JSX.Element => {
  return (
    <div className='relative p-2  flex gap-2 flex-col items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
      onClick={props.onBack}
      >
        <FaArrowCircleLeft size={20}/>
      </button>
      
      <h3 className='font-semibold text-lg text-cyan-500'>
        Salas do sistema
      </h3>

      <div className={`
        flex-1 min-h-0 w-full border gap-2 overflow-auto bg-white p-2 rounded-xl border-cyan-300
        ${ props.roomDetails ? 'flex flex-col' : 'grid grid-cols-5' }
      `}>
        { props.roomDetails ? (
          <div>
            <h4 className='text-base font-semibold text-orange-500 flex items-center gap-1'>
              <MdMeetingRoom />
              Sala { props.roomDetails.name }
            </h4> 

            <ul className='space-y-1 mt-1 list-disc list-inside text-xs'>
              <li className='text-orange-400 font-semibold'>
                Status: <span className='text-cyan-400 font-normal'>{ ROOM_STATUS_MAP[props.roomDetails.status] }</span>
              </li>

              { props.roomDetails.appointmentDate && props.roomDetails.occupants &&    
                <>
                  <li className='text-orange-400 font-semibold'>
                    Encontro: <span className='text-cyan-400 font-normal'>{ formatDateTime(props.roomDetails.appointmentDate) }</span>
                  </li>

                  <span className='flex items-center gap-1 text-base font-semibold text-orange-500'>
                    <IoPeopleSharp />
                    Participantes 
                  </span>

                  <li className='text-orange-400 font-semibold'>
                    { props.roomDetails.occupants.student } <span className='text-cyan-400 font-normal'>(Aluno)</span>
                  </li>

                  <li className='text-orange-400 font-semibold'>
                    { props.roomDetails.occupants.professor } <span className='text-cyan-400 font-normal'>(Professor)</span>
                  </li>
                </>       
              }
            </ul>
          </div>
        ) : (
          props.roomsData.map((room) => {

            const isReserved = room.status === 'RESERVED';

            return (
              <Button.Default
                label={room.name}   
                selected={isReserved}                     
                onClick={() => props.onRoomDetails(room)}                   
                customStyle={{ button: `
                  h-6 text-xs font-semibold bg-orange-50 text-orange-500 border-orange-500 
                  ${ isReserved 
                    ? 'bg-orange-500 text-orange-100! border-orange-50' 
                    : 'bg-orange-50 text-orange-500 border-orange-500' 
                }`}}
              />        
          )})
        ) }
      </div>
    </div>
  )
}

export default RoomsDetails