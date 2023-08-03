import { useEffect } from "react";
import { roomService } from "../api/room";

function Lobby() {
  useEffect(() => {
    roomService
      .allRooms()
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);

  async function handleCreateRoom(): Promise<void> {
    const response = await roomService.createRoom("Cool Room");
    if (response.hasError) {
      return console.log(response.err);
    }
    console.log("Created Room");
  }

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}

export default Lobby;
