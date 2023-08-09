import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { authService } from "./api/auth";
import { useUser } from "./context/UserContext";
import Header from "./components/Header";

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
    <BrowserRouter>
      <Header />
      <div className="app-container">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
