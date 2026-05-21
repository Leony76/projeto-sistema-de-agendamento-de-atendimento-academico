import type { Room } from "@shared/types/room.type";
import { formatDateTime } from "@frontend/utils/formats/formatDateTime.util";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdMeetingRoom, MdOutlineNoMeetingRoom } from "react-icons/md";
import { Button } from "../button";
import { ROOM_STATUS_MAP } from "@frontend/constants/maps/roomStatus.map";
import { useState } from "react";
import NoContent from "../misc/NoContent";
import { useForm } from "react-hook-form";
import { newRoomSchema, type NewRoomFormData } from "@shared/schemas/newRoom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../input";
import { TiInfoLarge } from "react-icons/ti";
import { useToast } from "@frontend/contexts/ToastContext";
import { apiError } from "@frontend/utils/misc/apiError.util";
import { RoomService } from "@frontend/services/room.service";

type Props = {
  onBack : () => void;
  rooms  : Room[];
};

const RoomsDetails = (props:Props): React.JSX.Element => {

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewRoomFormData>({
    resolver      : zodResolver(newRoomSchema),
    defaultValues : { name: '' },
  });

  const { toast } = useToast();

  const [ selectedRoom, setSelectedRoom ] = useState<Room | null>(null);
  const [ newRoom, setNewRoom ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ onDetails, setOnDetails ] = useState<boolean>(false);

  const handleNewRoom = async({ name }: NewRoomFormData): Promise<void> => {
    try {
      setLoading(true);

      const response = await RoomService.newRoom(name);

      if (response.success) {
        toast(response.message);
        console.log(response.data);

        reset();
        setNewRoom(false);
      }
    } catch(error:unknown) {
      toast(apiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative p-2  flex gap-2 flex-col items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <button 
      className='absolute top-3 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
      onClick={() => {
        if (onDetails) {
          setOnDetails(false);
        } else if (newRoom) {
          setNewRoom(false);
        } else {
          props.onBack();
        }
      }}
      >
        <FaArrowCircleLeft size={20}/>
      </button>
      
      <h3 className='font-semibold text-lg text-cyan-500'>
        {newRoom ? 'Nova sala' : 'Salas do sistema'}
      </h3>

      <div className={`
        flex-1 min-h-0 w-full border gap-2 overflow-auto bg-white p-2 rounded-xl border-cyan-300
        ${ onDetails 
          ? 'flex flex-col' 
          : props.rooms.length > 0
            ? 'grid grid-cols-3' 
            : ''
        }
      `}>
        {newRoom ? (
          <div className="space-y-1">
            <p className="text-xs text-cyan-400 flex gap-2">
              <TiInfoLarge size={50} className="scale-[1.5]"/>
              Após a adição, as novas sala seram listadas e poderão ser reservadas automáticamente após uma solicitação de atendimento for aceita.
            </p>

            <Input.Default
              label="Nome da sala"
              customStyle={{ input: 'h-8' }}
              placeholder="Insira o nome da nova sala"
              type="text"
              maxLength={256}
              minLength={0}
              { ...register('name')}
              error={errors.name?.message}
            />

            <Button.Default
              label='Adicionar'
              onClick={handleSubmit(handleNewRoom)}
              Icon={() => <MdMeetingRoom size={18}/>}
              customStyle={{ button: 'h-10 font-semibold mt-2' }}
            />
          </div>
        ) : (onDetails && selectedRoom) ? (
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
        ) : props.rooms.length > 0 ? (
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
          <div className="h-[85%] flex flex-col justify-center">
              <div>
                <NoContent 
                  message="Nenhuma sala cadastrada no sistema"
                  Icon={() => <MdOutlineNoMeetingRoom size={22}/>}
                />

                <Button.Default
                  label={loading ? 'Adicionando' :'Adicionar'}
                  loading={loading}
                  disabled={loading}
                  onClick={() => setNewRoom(true)}
                  Icon={() => <MdMeetingRoom size={18}/>}
                  customStyle={{ button: 'py-1 font-semibold' }}
                />
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default RoomsDetails