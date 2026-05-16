import type { Room } from "@shared/types/room.type";
import { formatDateTime } from "@frontend/utils/formats/formatDateTime.util";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdMeetingRoom, MdOutlineNoMeetingRoom } from "react-icons/md";
import { Button } from "../button";
import { ROOM_STATUS_MAP } from "@frontend/constants/maps/roomStatus.map";
import { useState } from "react";
import NoContent from "../misc/NoContent";

type Props = {
  onBack : () => void;
  rooms  : Room[];
};

const RoomsDetails = (props:Props): React.JSX.Element => {

  const [ selectedRoom, setSelectedRoom ] = useState<Room | null>(null);
  const [ onDetails, setOnDetails ] = useState<boolean>(false);
  
  return (
    <div className='relative p-2  flex gap-2 flex-col items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
      onClick={() => {
        if (onDetails) {
          setOnDetails(false);
        } else {
          props.onBack();
        }
      }}
      >
        <FaArrowCircleLeft size={20}/>
      </button>
      
      <h3 className='font-semibold text-lg text-cyan-500'>
        Salas do sistema
      </h3>

      <div className={`
        flex-1 min-h-0 w-full border gap-2 overflow-auto bg-white p-2 rounded-xl border-cyan-300
        ${ onDetails 
          ? 'flex flex-col' 
          : props.rooms.length > 0
            ? 'grid grid-cols-5' 
            : ''
        }
      `}>
        { (onDetails && selectedRoom) ? (
          <div>
            <h4 className='text-base font-semibold text-orange-500 flex items-center gap-1'>
              <MdMeetingRoom />
              Sala { selectedRoom.name }
            </h4> 

            <ul className='space-y-1 mt-1 list-disc list-inside text-xs'>
              <li className='text-orange-400 font-semibold'>
                Status: <span className='text-cyan-400 font-normal'>{ ROOM_STATUS_MAP[selectedRoom.status] }</span>
              </li>

              { selectedRoom.status === 'RESERVED' &&    
                <>
                  <li className='text-orange-400 font-semibold'>
                    Encontro: <span className='text-cyan-400 font-normal'>{ formatDateTime(selectedRoom.appointmentDate) }</span>
                  </li>

                  <span className='flex items-center gap-1 text-base font-semibold text-orange-500'>
                    <IoPeopleSharp />
                    Participantes 
                  </span>

                  <li className='text-orange-400 font-semibold'>
                    { selectedRoom.occupants.student } <span className='text-cyan-400 font-normal'>(Aluno)</span>
                  </li>

                  <li className='text-orange-400 font-semibold'>
                    { selectedRoom.occupants.professor } <span className='text-cyan-400 font-normal'>(Professor)</span>
                  </li>
                </>       
              }
            </ul>
          </div>
        ) : (
          props.rooms.length > 0 ? (
            props.rooms.map((room) => {
  
              const isReserved = room.status === 'RESERVED';
  
              return (
                <Button.Default
                  label={room.name}   
                  selected={isReserved}                     
                  onClick={() => {
                    setSelectedRoom(room);
                    setOnDetails(true);
                  }}                   
                  customStyle={{ button: `
                    h-6 text-xs font-semibold bg-orange-50 text-orange-500 border-orange-500 
                    ${ isReserved 
                      ? 'bg-orange-500 text-orange-100! border-orange-50' 
                      : 'bg-orange-50 text-orange-500 border-orange-500' 
                  }`}}
                />        
            )})
          ) : (
            <NoContent 
              message="Nenhuma sala cadastrada no sistema"
              Icon={() => <MdOutlineNoMeetingRoom size={22}/>}
            />
          )
        ) }
      </div>
    </div>
  )
}

export default RoomsDetails