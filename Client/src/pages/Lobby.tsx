import { useEffect, useState } from "react";
import { RoomResponse, roomService } from "../api/room";
import Expander from "../components/Expander";
import { useNavigate } from "react-router-dom";
import chatApi from "../signalr/chatApi";

function Lobby() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ReadonlyArray<RoomResponse>>([]);

  useEffect(() => {
    chatApi.onReceiveAllRooms((res) => {
      setRooms(res.rooms);
    });
  }, []);

  useEffect(() => {
    async function fn() {
      const res = await roomService.allRooms();
      if (res.hasError) {
        return console.log(JSON.stringify(res.err));
      }
      setRooms(res.value.rooms);
    }
    fn();
  }, []);

  function renderVisible(room: RoomResponse) {
    return (
      <>
        <div>Room Name: 🚪{room.name}</div>
        <div>Room Creator: {room.ownerUsername}</div>
      </>
    );
  }

  function renderHidden(room: RoomResponse) {
    function handleClick(event: any): void {
      event.stopPropagation();
      navigate(`/chat/${room.name}`);
    }

    return (
      <button className="room-item-button" onClick={handleClick}>
        Join {room.name}
      </button>
    );
  }

  return (
    <div>
      <Expander items={rooms} visible={renderVisible} hidden={renderHidden} />
    </div>
  );
}

export default Lobby;
