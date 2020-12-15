//JOIN GLOBAL ROOM
const JoinGlobalRoom = (socket, user) => {
  socket.emit("Global-Room", { socketID: user.id, username: user.username });
};

//GET ALL ONLINE USER
const GetGlobalUsers = (socket, dispatch) => {
  socket.on("Global-Users", (data) => {
    dispatch({ type: "Get-Global-User", payload: data });
  });
};

//CHAT ALL GLOBAL ROOM
const ChatGlobalRoom = (socket, chatMsg) => {
  socket.emit("Global-Chat", chatMsg);
};

//GET CHAT MESSAGE GLOBAL ROOM
const GetChatGlobalRoom = (socket, dispatch) => {
  socket.on("Global-Chat-Response", (data) => {
    dispatch({ type: "Add-Global-Chat", payload: data });
  });
};

export { JoinGlobalRoom, GetGlobalUsers, ChatGlobalRoom, GetChatGlobalRoom };
