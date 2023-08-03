import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { authService } from "./api/auth";
import { useUser } from "./context/UserContext";

function App() {
  const { setIsAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(false);

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
