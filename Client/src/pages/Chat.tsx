import { useEffect, useState } from "react";
import { useParams } from "react-router";
import chatApi from "../signalr/chatApi";
import { MessageResponse, UserResponse } from "../signalr/types";

function Chat() {
  const { roomName } = useParams();
  const [message, setMessage] = useState("");

  // prettier-ignore
  const [usersInRoom, setUsersInRoom] = useState<ReadonlyArray<UserResponse>>([]);
  const [messages, setMessages] = useState<ReadonlyArray<MessageResponse>>([]);

  const numUsersInRoom = usersInRoom.length;

  useEffect(() => {
    chatApi.onReceiveMessage((response) => {
      setMessages((prevMessages) => [...prevMessages, response]);
    });

    chatApi.onUsersInRoom((response) => {
      setUsersInRoom(response.users);
    });

    chatApi.joinRoom({ roomName: roomName! }).then((response) => {
      setMessages(response.messages);
    });

    return () => {
      console.log("Leaving room");
      chatApi.leaveRoom({ roomName: roomName! });
    };
  }, []);

  async function handleSendMessage() {
    chatApi.sendMessage({ contents: message, roomName: roomName! });
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
          {messages?.map((message, idx) => (
            <div key={idx} className="message">
              <div className="contents">{message.contents}</div>
              <div className="user">username: {message.senderUsername}</div>
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
