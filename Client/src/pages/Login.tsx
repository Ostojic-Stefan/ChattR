import { FormEvent, useState } from "react";
import { authService } from "../api/auth";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // prettier-ignore
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const result = await authService.login({ username, password });
    if (result.hasError) {
      // toast
      console.log(result.err);
			return;
    }
		setIsAuthenticated(true);
		navigate('/lobby');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name"></label>
        <input
          id="name"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div>
        <label htmlFor="password"></label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
