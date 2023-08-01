import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // async function register() {

  // }

  async function login() {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      username: "bob",
      password: "password",
    });
    const data = response.data;
    console.log(data);
  }

  useEffect(() => {
    setIsLoading(true);
    axios
      .post("http://localhost:5000/api/auth/me")
      .then((response) => {
        console.log(response);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(true);
        if (err.response && err.response.status === 401) {
          console.log("Unauthorized");
          setIsAuthenticated(false);
        } else {
          console.log("An Unknown error occured");
        }
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <p>{isAuthenticated ? "You are logged in" : "You are not logged in"}</p>
      <button onClick={() => login()}>
        {isAuthenticated ? "Logout" : "Login "}
      </button>
      <BrowserRouter>
        <p>
          To go to about page, <Link to="/about">click here</Link>
        </p>
        <AppRoutes isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </>
  );
}

export default App;
