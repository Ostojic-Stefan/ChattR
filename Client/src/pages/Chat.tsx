import { useEffect, useState } from "react";
import { useSignalR } from "../context/SignalRContext";
import { useParams } from "react-router";

function Chat() {
  const { connection } = useSignalR();
  const { roomName } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { contents: string; userId: string }[]
  >([]);

  useEffect(() => {
    async function fn() {
      if (connection) {
        const response = await connection?.invoke("JoinRoom", roomName);
        console.log(response);

        setMessages(response.messagesHistory);

        connection?.on(
          "send_message",
          (res: { contents: string; userId: string }) => {
            console.log(res);
            setMessages((curr) => [...curr, res]);
          }
        );
      }
    }
    fn();
  }, [connection]);

  async function handleSendMessage() {
    connection?.invoke("SendMessage", message, roomName);
  }

  return (
    <div className="chat-container">
      <div className="left">
        <h2>
          Active Users: <span>69</span>
        </h2>
        <h2>Other Rooms:</h2>
        <ul>
          <li>coding</li>
          <li>art</li>
          <li>gaming</li>
        </ul>
      </div>
      <div className="right">
        <div className="message-container">
          {messages.map((m, idx) => (
            <div key={idx} className="message">
              <div className="contents">{m.contents}</div>
              <div className="user">username: {m.userId}</div>
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
