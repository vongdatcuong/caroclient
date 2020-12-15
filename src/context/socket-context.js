import React, { createContext, useReducer } from "react";
import constant from "../Utils/index";
import socketIOClient from "socket.io-client";

const initState = {
  socket: socketIOClient(constant.SERVER),
  globalUsers: [],
  globalChat: [],
};
const store = createContext(initState);
const { Provider } = store;

const SocketStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "Get-Global-User":
        return { ...state, globalUsers: action.payload };
      case "Add-Global-Chat":
        const temp = [...state.globalChat];
        temp.push(action.payload);
        return { ...state, globalChat: temp };
      case "Log-out":
        return initState;
      default:
        throw new Error();
    }
  }, initState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, SocketStateProvider };
