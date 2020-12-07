import React, { createContext, useReducer } from "react";
const initState = "";
const store = createContext(initState);
const { Provider } = store;

const SocketStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "connect":
        return action.payload;
      default:
        throw new Error();
    }
  }, initState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, SocketStateProvider };
