import { useState, useRef, useEffect } from "react";
import { MessageResponse } from "../signalr/types";
import chatApi from "../signalr/chatApi";

interface MessagesProps {
  messages: ReadonlyArray<MessageResponse>;
  roomName: string;
}

function Messages({ messages, roomName }: MessagesProps) {
  // prettier-ignore
  const [message, setMessage] = useState("");

  const scrollToBottom = (behavior: ScrollBehavior) => {
    if (messagesRef && messagesRef.current) {
      const { scrollHeight, clientHeight } = messagesRef.current;
      messagesRef.current.scrollBy({
        top: scrollHeight - clientHeight,
        left: 0,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("instant");
  }, [messages]);

  async function handleSendMessage() {
    chatApi.sendMessage({ contents: message, roomName: roomName });
  }

  const messagesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="right">
      <div ref={messagesRef} className="message-container">
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
  );
}

export default Messages;
