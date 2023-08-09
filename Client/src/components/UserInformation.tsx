import { useEffect, useState } from "react";
import { UserResponse } from "../signalr/types";
import chatApi from "../signalr/chatApi";

function UserInformation() {
  // prettier-ignore
  const [usersInRoom, setUsersInRoom] = useState<ReadonlyArray<UserResponse>>([]);

  useEffect(() => {
    chatApi.onUsersInRoom((response) => {
      setUsersInRoom(response.users);
    });
  }, []);

  const numUsersInRoom = usersInRoom.length;

  return (
    <div className="left">
      <h3>
        Number of Online Users: <span>{numUsersInRoom}</span>
      </h3>
      <div className="online-users">
        <h3>Online Users</h3>
        <ul className="online-users-list">
          {usersInRoom.map((user, idx) => (
            <li className="online-user" key={idx}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserInformation;
