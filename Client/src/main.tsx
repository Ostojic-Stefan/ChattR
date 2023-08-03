import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";
import { SignalRProvider } from "./context/SignalRContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <SignalRProvider hubName="chathub">
      <App />
    </SignalRProvider>
  </UserProvider>
);
