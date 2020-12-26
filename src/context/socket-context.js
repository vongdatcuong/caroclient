import React, { createContext, useReducer } from "react";
import constant from "../Utils/index";
import socketIOClient from "socket.io-client";
import AuthService from "../services/auth.service";

const initState = {
  socket: socketIOClient(constant.SERVER),
  globalUsers: [],
  globalChat: [],
  listRoom: [],
  isCheck: false,
};
const store = createContext(initState);
const { Provider } = store;

const SocketStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "Check-listener":
        return { ...state, isCheck: true };
      case "Get-Global-User":
        const user = AuthService.getCurrentUser();
        if (user) {
          return {
            ...state,
            globalUsers: action.payload.filter((e) => e._id !== user._id),
          };
        }
        return { ...state, globalUsers: action.payload };
      case "Get-List-Room":
        return { ...state, listRoom: action.payload };
      case "Add-Global-Chat":
        const temp = [...state.globalChat];
        temp.push(action.payload);
        return { ...state, globalChat: temp };
      case "Log-out":
        return Object.assign({}, initState);
      default:
        throw new Error();
    }
  }, initState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, SocketStateProvider };
