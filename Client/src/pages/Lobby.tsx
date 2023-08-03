import { useEffect, useState } from "react";
import { RoomResponse, roomService } from "../api/room";
import { UseSignalR } from "../context/SignalRContext";
import { NavLink } from "react-router-dom";

function Lobby() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const { listenOn } = UseSignalR();

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

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
      <NavLink to="/login">Go To Login</NavLink>
      <ul>
        {rooms.map((room, idx) => (
          <li key={idx}>
            <div>Name: {room.name}</div>
            <div>Owner: {room.ownerUsername}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
