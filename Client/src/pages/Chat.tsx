import { useEffect, useState } from "react";
import { useParams } from "react-router";
import chatApi from "../signalr/chatApi";
import { MessageResponse } from "../signalr/types";
import UserInformation from "../components/UserInformation";
import Messages from "../components/Messages";

function Chat() {
  const { roomName } = useParams();
  const [messages, setMessages] = useState<ReadonlyArray<MessageResponse>>([]);

  useEffect(() => {
    chatApi.onReceiveMessage((response) => {
      setMessages((prevMessages) => [...prevMessages, response]);
    });

    chatApi.joinRoom({ roomName: roomName! }).then((response) => {
      setMessages(response.messages);
    });

    return () => {
      console.log("Leaving room");
      chatApi.leaveRoom({ roomName: roomName! });
    };
  }, []);

  return (
    <div className="chat-container">
      <UserInformation />
      <Messages messages={messages} roomName={roomName!} />
    </div>
  );
}

export default Chat;
