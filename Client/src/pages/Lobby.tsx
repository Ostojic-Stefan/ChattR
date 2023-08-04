import { useEffect, useState } from "react";
import { RoomResponse, roomService } from "../api/room";
import { useSignalR } from "../context/SignalRContext";
import Expander from "../components/Expander";
import { NavLink, useNavigate } from "react-router-dom";

function Lobby() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const { listenOn } = useSignalR();

  listenOn("receive_all_rooms", (rooms) => {
    setRooms(rooms);
  });

  useEffect(() => {
    async function fn() {
      const res = await roomService.allRooms();
      if (res.hasError) {
        return console.log(JSON.stringify(res.err));
      }
      console.log(res.value);
      // @ts-ignore
      setRooms(res.value);
    }
    fn();
  }, []);

  async function handleCreateRoom(): Promise<void> {
    const response = await roomService.createRoom("Cool Room");
    if (response.hasError) {
      return console.error(JSON.stringify(response.err));
    }
    console.log("Created Room");
  }

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
      <h1>Lobby</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
      <NavLink to="/login">Go To Login</NavLink>
      <Expander items={rooms} visible={renderVisible} hidden={renderHidden} />
    </div>
  );
}

export default Lobby;
