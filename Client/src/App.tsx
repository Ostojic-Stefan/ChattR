import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { authService } from "./api/auth";
import { useUser } from "./context/UserContext";
import { useSignalR } from "./context/SignalRContext";

function App() {
  const { setIsAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { listenOn } = useSignalR();

  useEffect(() => {
    async function getUserInfo() {
      const response = await authService.me();
      if (response.hasError) {
        console.log(response.err);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }
    getUserInfo();
  }, []);

  useEffect(() => {
    async function fn() {
      await listenOn("receive_all_rooms", (rooms) => {
        console.log(rooms);
      });
    }
    fn();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
