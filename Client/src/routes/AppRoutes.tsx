import { Navigate, Route, Routes } from "react-router-dom";
import GuardedRoute from "./GuardedRoute";
import Lobby from "../pages/Lobby";
import Login from "../pages/Login";
import Chat from "../pages/Chat";
import { useUser } from "../context/UserContext";

function AppRoutes() {
  const { isAuthenticated } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lobby" />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route
        path="/login"
        element={
          <GuardedRoute isAccessible={isAuthenticated} redirectRoute="/lobby" />
        }
      >
        <Route path="/login" element={<Login />} />
      </Route>
      <Route
        path="/chat/:id"
        element={
          <GuardedRoute
            isAccessible={!isAuthenticated}
            redirectRoute="/login"
          />
        }
      >
        <Route path="/chat/:id" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
