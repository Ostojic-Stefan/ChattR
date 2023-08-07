import { FormEvent, useEffect, useState } from "react";
import { RoomResponse, roomService } from "../api/room";
import Expander from "../components/Expander";
import { NavLink, useNavigate } from "react-router-dom";
import chatApi from "../signalr/chatApi";
import Modal from "../components/Modal";

function Lobby() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ReadonlyArray<RoomResponse>>([]);
  const [roomName, setRoomName] = useState("");

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

  async function handleCreateRoom(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const result = await roomService.createRoom(roomName);
    if (result.hasError) {
      console.log("Failed to create room");
    }
  }

  return (
    <div>
      <h1>Lobby</h1>
      <Modal>
        <Modal.Open>
          <button>Create Room</button>
        </Modal.Open>
        <Modal.Content>
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
            <button>Submit</button>
          </form>
        </Modal.Content>
      </Modal>
      <NavLink to="/login">Go To Login</NavLink>
      <Expander items={rooms} visible={renderVisible} hidden={renderHidden} />
    </div>
  );
}

export default Lobby;
