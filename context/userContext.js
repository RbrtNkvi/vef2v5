import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function AppWrapper({ children }) {
  const [login, setLogin] = useState({});

  const toggleLogin = () => {
    setLogin({ login: !login.login, name: {}});
    localStorage.setItem("user", JSON.stringify({ login: !login.login, name: {}}));
  }

  useEffect(() => {   
    if (JSON.parse(localStorage.getItem("user"))) { 
      setLogin(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  return (
    <UserContext.Provider value={{
      state: {
        login,
        setLogin,
      },
      toggleLogin,
    }}>
      { children }
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}