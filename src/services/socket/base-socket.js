//JOIN GLOBAL ROOM
const JoinGlobalRoom = (socket, user) => {
  socket.emit("Global-Room", { userID: user._id, username: user.username });
};

//GET ALL ONLINE USER
const GetGlobalUsers = (socket, dispatch) => {
  socket.on("Global-Users", (data) => {
    console.log(data);
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
const LogOut = (socket, user) => {
  socket.emit("Log-Out", { userID: user.userID });
};

//CREATE NEW ROOM
const CreatePlayingRoom = (socket, room) => {
  //room({title:string,creator:string})
  //console.log(room);
  socket.emit("Create", room);
};

// GET ROOM OWNER
const GetRoomOwner = (socket, setRoomOwnerID) => {
  socket.on("Room-Owner-Response", (roomOwnerID) => {
    setRoomOwnerID(roomOwnerID);
  });
};
//GET ALL LIST ROOM
const GetListRoom = (socket, dispatch) => {
  socket.on("Playing-Room", (data) => {
    dispatch({ type: "Get-List-Room", payload: data });
  });
};

//LEAVE ROOM
const LeaveRoom = (socket, roomID, user) => {
  socket.emit("Leave-Room", { roomID: roomID, player: user });
};

//GET LEAVE PLAYER
const LeaveRoomPlayer = (socket, setState, onLeave) => {
  socket.on("Leave-Room-Player", (value) => {
    //if (value === roomID) {
    //  onLeave();
    //}
    setState({});
    onLeave(value);
  });
};

// CLOSE ROOM
const CloseRoom = (socket, roomID, onCloseRoom) => {
  socket.on("Close-Room", (value) => {
    if (roomID === value) {
      onCloseRoom();
    }
  });
};

//JOIN ROOM
const JoinRoom = (socket, roomID, player, password) => {
  socket.emit("Join-Room", {
    roomID: roomID,
    player: player,
    password: password,
  });
};

const JoinRoomCallBack = (socket, callback) => {
  socket.on("Join-Room-Callback", (value) => {
    callback(value);
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

// READY GAME
const ReadyGame = (socket, roomID, user) => {
  socket.emit("Ready-Game", {
    roomID: roomID,
    _id: user._id,
  });
};

const ReadyGameRes = (socket, handleReadyGameRes) => {
  socket.on("Ready-Game-Response", (_id) => {
    handleReadyGameRes(_id);
  });
};

// RESTART GAME
/*const RestartGame = (socket, roomID, user) => {
  socket.emit("Restart-Game", {
    roomID: roomID,
    _id: user._id
  })
}

const RestartGameRes = (socket, handleRestartGameRes) => {
  socket.on("Restart-Game-Response", (board) => {
    handleRestartGameRes(board)
  })
}*/

// GET BOARD
const GetBoard = (socket, setState) => {
  socket.on("Board-Response", (board) => {
    setState(board);
  });
};

// MAKE A MOVE
const MakeAMove = (socket, roomID, user, boardProp) => {
  socket.emit("Make-a-move", {
    roomID: roomID,
    player: { playerID: socket.id, ...user },
    boardProp: boardProp,
  });
};

// WITHDRAW
const WithDraw = (socket, roomID, user) => {
  socket.emit("Withdraw", {
    roomID: roomID,
    player: user,
  });
};
// DECLARE WINNER
const DeclareWinner = (socket, handleWinner) => {
  socket.on("Declare-Winner-Response", (winner) => {
    handleWinner(winner);
  });
};

//INVITE USER
const InviteUser = (socket, value) => {
  socket.emit("Invite-Room", { socketID: value.id, room: value.room });
};

//RECEIVER INVITE REQUEST
const GetInviteRequest = (socket, handleFunc) => {
  socket.on("Invite-Room-Response", (value) => {
    handleFunc(value);
  });
};

// UPDATE USER
const UpdateUserRes = (socket, handleUpdateUser) => {
  socket.on("Update-User-Response", (newUser) => {
    handleUpdateUser(newUser);
  });
};

// LOADING
const LoadingRes = (socket, dispatch) => {
  socket.on("Loading-Response", (isLoading) => {
    dispatch({ type: "Set-Loading", isLoading: isLoading });
  });
};

//QUICK PLAY
const QuickPlay = (socket, room) => {
  socket.emit("Quick-Play", room);
};

//CANCEL QUICK PLAY ROOM
const CancelQuickPlayRoom = (socket, user) => {
  socket.emit("Cancel-Room", user);
};

//QUICK PLAY RESPONSE SEARCHED ROOM
const SearchedRoom = (socket, callback) => {
  socket.on("Searched-Room", (value) => {
    console.log(value);
    callback(value);
  });
};

//NOTIFICATION WHEN OTHER USER JOIN ROOM
const NotifyQuickPlay = (socket, callback) => {
  socket.on("Notify-Quick-Play", (value) => {
    console.log(value);
    callback(value);
  });
};

// RECONNECT
const Reconnect = (socket, roomID, player) => {
  socket.emit("Reconnect", {
    roomID: roomID,
    player: player,
  });
};

const ReconnectRes = (socket, setState) => {
  socket.on("Reconnect-Response", (room) => {
    setState(room);
  });
};

const PlayerDisconnectRes = (socket, handlePlayerDis) => {
  socket.on("Player-Disconnect-Response", (player) => {
    handlePlayerDis(player);
  });
};

const PlayerReconnectRes = (socket, handlePlayerRecon) => {
  socket.on("Player-Reconnect-Response", (player) => {
    handlePlayerRecon(player);
  });
};

const DisconnectedPlayerLose = (socket, roomID, user) => {
  socket.emit("Disconnected-Player-Lose", {
    roomID: roomID,
    player: user,
  });
};

// SPECTATOR
//SPEC ROOM
// In Spectator
const SpecRoom = (socket, roomID, player, password) => {
  socket.emit("Spec-Room", {
    roomID: roomID,
    player: player,
    password: password
  });
};

const SpecRoomCallBack = (socket, callback) => {
  socket.on("Spec-Room-Callback", (value) => {
    callback(value);
  });
};

// In Game
const SpecRoomRes = (socket, setState) => {
  socket.on("Spectator-Room-Response", (spectators) => {
    setState(spectators);
  });
};

// In Spectator
const PlayersSpecRoomRes = (socket, handleSetPlayersSpecRoom) => {
  socket.on("Players-Spec-Room-Response", (players) => {
    handleSetPlayersSpecRoom(players);
  });
};

// In Spectator
//LEAVE SPEC ROOM
const LeaveSpecRoom = (socket, roomID, user) => {
  socket.emit("Leave-Spec-Room", { roomID: roomID, player: user });
};

// In Spectator
//GET LEAVE PLAYER
const LeaveRoomPlayerSpec = (socket, onLeave) => {
  socket.on("Leave-Room-Player-Spec", (value) => {
    onLeave(value);
  });
};

// In Spectator
// GAME START
const GameStartSpec = (socket, handleGameStart) => {
  socket.on("Game-Start-Spec-Response", (board) => {
    handleGameStart(board);
  });
};

// In Spectator
//JOIN ROOM FROM SPEC
const JoinRoomFromSpec = (socket, roomID, player) => {
  socket.emit("Join-Room-From-Spec", {
    roomID: roomID,
    player: player,
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
  GetBoard,
  MakeAMove,
  DeclareWinner,
  CloseRoom,
  InviteUser,
  GetInviteRequest,
  WithDraw,
  GetRoomOwner,
  ReadyGame,
  ReadyGameRes,
  //RestartGame,
  //RestartGameRes
  UpdateUserRes,
  LoadingRes,
  QuickPlay,
  SearchedRoom,
  NotifyQuickPlay,
  JoinRoomCallBack,
  CancelQuickPlayRoom,
  Reconnect,
  ReconnectRes,
  PlayerDisconnectRes,
  PlayerReconnectRes,
  DisconnectedPlayerLose,
  SpecRoom,
  SpecRoomRes,
  LeaveSpecRoom,
  PlayersSpecRoomRes,
  LeaveRoomPlayerSpec,
  GameStartSpec,
  JoinRoomFromSpec,
  SpecRoomCallBack
};
