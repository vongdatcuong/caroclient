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

//LOG OUT
const LogOut = (socket) => {
  socket.emit("Log-Out");
};

//CREATE NEW ROOM
const CreatePlayingRoom = (socket, room) => {
  //room({title:string,creator:string})
  console.log(room);
  socket.emit("Create", room);
};

//GET ALL LIST ROOM
const GetListRoom = (socket, dispatch) => {
  socket.on("Playing-Room", (data) => {
    dispatch({ type: "Get-List-Room", payload: data });
  });
};

//LEAVE ROOM
const LeaveRoom = (socket, roomID) => {
  socket.emit("Leave-Room", roomID);
};

//GET LEAVE PLAYER
const LeaveRoomPlayer = (socket, setState, roomID, onLeave) => {
  socket.on("Leave-Room-Player", (value) => {
    if (value === roomID) {
      onLeave();
    }
    setState({});
  });
};

//JOIN ROOM
const JoinRoom = (socket, roomID, player) => {
  socket.emit("Join-Room", {
    roomID: roomID,
    player: { playerID: socket.id, ...player },
  });
};

//GET SECOND PLAYER
const GetSecondPlayer = (socket, setState) => {
  socket.on("Second-Player", (value) => {
    setState(value);
  });
};

//GET FIRST PLAYER
const GetFirstPlayer = (socket, setState) => {
  socket.on("First-Player", (value) => {
    setState(value);
  });
};

//CHAT PRIVATE ROOM
const ChatPrivateRoom = (socket, roomID, chatMsg) => {
  socket.emit("Private-Room-Chat", { roomID: roomID, msg: chatMsg });
};

//GET ROOM CHAT LIST
const GetChatPrivateRoom = (socket, setState) => {
  socket.on("Private-Room-Chat-Response", (value) => {
    setState(value);
  });
};

export {
  JoinGlobalRoom,
  GetGlobalUsers,
  ChatGlobalRoom,
  GetChatGlobalRoom,
  LogOut,
  CreatePlayingRoom,
  GetListRoom,
  LeaveRoom,
  JoinRoom,
  GetSecondPlayer,
  GetFirstPlayer,
  ChatPrivateRoom,
  GetChatPrivateRoom,
  LeaveRoomPlayer,
};