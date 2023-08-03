import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  children: ReactNode;
  hubName: string;
};

interface ISignalRContext {
  setConnection: (val: HubConnection) => void;
  invoke: (methodName: string) => Promise<any>;
  onClose: (callback: (e: Error | undefined) => void) => void;
  listenOn: (
    methodName: string,
    callback: (...args: any[]) => any
  ) => Promise<void>;
}

// @ts-ignore
const SignalRContext = createContext<ISignalRContext>({});

function SignalRProvider({ children, hubName }: Props) {
  const [connection, setConnection] = useState<HubConnection>();
  const connectionEstablishedRef = useRef(false);

  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(`http://localhost:5000/api/${hubName}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    conn.start().then(() => {
      setConnection(conn);
      connectionEstablishedRef.current = true;
    });

    return () => {
      if (connection && connectionEstablishedRef.current) {
        connection.stop();
        console.log("SignalR connection stopped");
      }
    };
  }, []);

  async function invoke(methodName: string) {
    if (!connection) {
      throw new Error("signalR connection is not established");
    }
    const result = await connection.invoke(methodName);
    return result;
  }

  async function onClose(callback: (e: Error | undefined) => void) {
    if (!connection) {
      throw new Error("signalR connection is not established");
    }
    connection.onclose(callback);
  }

  async function listenOn(
    methodName: string,
    callback: (...args: any[]) => any
  ): Promise<void> {
    if (!connection) {
      throw new Error("signalR connection is not established");
    }
    connection.on(methodName, callback);
  }

  if (!connection) return;

  return (
    <SignalRContext.Provider
      value={{ setConnection, invoke, onClose, listenOn }}
    >
      {children}
    </SignalRContext.Provider>
  );
}

function useSignalR() {
  const context = useContext(SignalRContext);
  if (context === undefined)
    throw new Error(
      "SignalRContext is being accessed outside of the SignalRProvider"
    );
  return context;
}

export { useSignalR, SignalRProvider };
