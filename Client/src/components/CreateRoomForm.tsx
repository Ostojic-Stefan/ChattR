import { FormEvent, useState } from "react";
import { roomService } from "../api/room";

function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");

  async function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await roomService.createRoom(roomName);
    if (result.hasError) {
      console.log("Failed to create room");
    }
  }
  return (
    <form onSubmit={handleCreateRoom}>
      <div>
        <label htmlFor="name">Room Name</label>
        <input
          id="name"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateRoomForm;
