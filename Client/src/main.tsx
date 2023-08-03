import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";
import { SignalRProvider } from "./context/SignalRContext.tsx";
import { Suspense } from "react";

const LoadingFallback = () => {
  return <div>Loading...</div>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <Suspense fallback={<LoadingFallback />}>
      <SignalRProvider hubName="chathub">
        <App />
      </SignalRProvider>
    </Suspense>
  </UserProvider>
);
