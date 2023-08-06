import { useEffect, useState } from "react";
import { useSignalR } from "../context/SignalRContext";
import { useParams } from "react-router";

function Chat() {
  const { connection } = useSignalR();
  const { roomName } = useParams();

  const [usersInRoom, setUsersInRoom] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { contents: string; senderUsername: string }[]
  >([]);

  const numUsersInRoom = usersInRoom.length;

  useEffect(() => {
    async function fn() {
      if (connection) {
        connection.on(
          "send_message",
          (res: { contents: string; senderUsername: string }) => {
            console.log(res);
            setMessages((curr) => [...curr, res]);
          }
        );

        connection.on("users_in_room", (res) => {
          setUsersInRoom(res);
          console.log("users in room: ", res);
        });

        connection.on("join_room", (response) => {
          console.log(response);
          setMessages(response.messages);
        });

        connection.invoke("JoinRoom", {
          RoomName: roomName,
        });
      }
    }
    fn();

    return () => {
      connection?.invoke("LeaveRoom", { roomName });
    };
  }, [connection]);

  async function handleSendMessage() {
    connection?.invoke("SendMessage", { contents: message, roomName });
  }

  return (
    <div className="chat-container">
      <div className="left">
        <h3>
          Active Users: <span>{numUsersInRoom}</span>
        </h3>
      </div>
      <div className="right">
        <div className="message-container">
          {messages?.map((m, idx) => (
            <div key={idx} className="message">
              <div className="contents">{m.contents}</div>
              <div className="user">username: {m.senderUsername}</div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="type a message you want to send"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" onClick={() => handleSendMessage()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
