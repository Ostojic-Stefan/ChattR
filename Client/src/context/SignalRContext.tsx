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
  connection: HubConnection | undefined;
}

// @ts-ignore
const SignalRContext = createContext<ISignalRContext>({});

function SignalRProvider({ children, hubName }: Props) {
  const [connection, setConnection] = useState<HubConnection>();
  const connectionEstablishedRef = useRef(false);

  useEffect(() => {
    async function fn() {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl(`http://localhost:5000/api/${hubName}`)
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();
        await conn.start();
        setConnection(conn);
        connectionEstablishedRef.current = true;
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    }

    fn();

    return () => {
      if (connection && connectionEstablishedRef.current) {
        connection.stop();
        console.log("SignalR connection stopped");
      }
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
}

function UseSignalR() {
  const context = useContext(SignalRContext);
  const { connection } = context;

  if (context === undefined)
    throw new Error(
      "SignalRContext is being accessed outside of the SignalRProvider"
    );

  function listenOn(methodName: string, callback: (...args: any[]) => any) {
    useEffect(() => {
      connection?.on(methodName, callback);
    }, [methodName, connection, callback]);
  }

  async function invoke(methodName: string, ...rest: any[]) {
    const [result, setResult] = useState(null);

    useEffect(() => {
      connection
        ?.invoke(methodName, rest)
        .then((res) => setResult(res))
        .catch((err) => JSON.stringify(err));
    }, [methodName, connection, setResult, ...rest]);

    return result;
  }

  return { listenOn, invoke };
}

export { UseSignalR, SignalRProvider };
