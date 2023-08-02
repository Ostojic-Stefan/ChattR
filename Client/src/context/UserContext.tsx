import { ReactNode, createContext, useContext, useState } from "react";

type Props = {
  children: ReactNode;
};

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

const initialState: IAuthContext = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
};

const UserContext = createContext<IAuthContext>(initialState);

function UserProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialState.isAuthenticated
  );

  return (
    <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error(
      "UserContext is being accessed outside of the UserProvider"
    );
  return context;
}

export { UserProvider, useUser };
