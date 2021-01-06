import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { store } from "../../../context/socket-context";
import { loadingStore } from "../../../context/loading-context";
// Components
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import BackgroundGameImg from "../../../vendors/images/background-game.jpg";

// Constant && Services
import Utils from "../../../Utils";
import AuthService from "../../../services/auth.service";
import {
  GetBoard,
  GetChatPrivateRoom,
  DeclareWinner,
  GetGlobalUsers,
  GetRoomOwner,
  LoadingRes,
  PlayerDisconnectRes,
  PlayerReconnectRes,
  DisconnectedPlayerLose,
  SpecRoomRes,
  LeaveSpecRoom,
  PlayersSpecRoomRes,
  LeaveRoomPlayerSpec,
  GameStartSpec,
  JoinRoomFromSpec,
} from "../../../services/socket/base-socket";
import Board from "../Game/components/board";
import Chatbox from "../Game/components/chatbox";
import Settings from "../Game/components/settings";
import SettingDialog from "../../../components/dialogs/SettingDialog/index";
import UserInfo from "../Game/components/user-info";
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import JoinPlaying from "../Game/components/join-playing";

import {
  GetSecondPlayer,
  GetFirstPlayer,
  ChatPrivateRoom,
  CloseRoom,
  JoinGlobalRoom,
} from "../../../services/socket/base-socket";
import "./index.css";
import { Typography } from "@material-ui/core";
import ListUser from "../Game/components/list-user";
import CustomBox from "../../../components/custom-components/CustomBox";
import ListGlobalChat from "../../../components/custom-components/CustomBox/components/ListGlobalChat";
import ChatBox from "../../../components/custom-components/CustomBox/components/ChatBox";
import PlayerDisconnect from "../../Main/PlayerDisconnect";
import { config } from "../../../config";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundImage: "url(" + BackgroundGameImg + ")",
    backgroundSize: "contain",
    minHeight: "100vh",
  },
  paper: {
    display: "flex",
    alignItems: "center",
  },
  root: {
    marginTop: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(3),
    color: "#ffffff",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "60px",
    padding: "5px",
  },
  game: {
    position: "relative",
  },
  controlWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    textAlign: "center",
    zIndex: "999",
  },
  start: {
    position: "absolute",
    top: "40%",
    left: "45%",
    fontSize: "1.5em",
    color: "#016310",
    backgroundColor: fade("#ffffff", 1),
    border: "3px solid #016310",
    borderRadius: "5px",
    textAlign: "center",
  },
  startBtn: {
    marginTop: theme.spacing(30),
    display: "inline block",
    textAlign: "center",
    fontSize: "1.5em",
    color: "#016310",
    backgroundColor: fade("#ffffff", 1),
    border: "3px solid #016310",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  restartBtn: {
    marginTop: theme.spacing(5),
  },
  waitBtn: {
    marginTop: theme.spacing(30),
    display: "inline-block",
    textAlign: "center",
    fontSize: "1.5em",
    color: "#016310",
    backgroundColor: fade("#ffffff", 1),
    border: "3px solid #016310",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  waitAnotherBtn: {
    marginTop: theme.spacing(30),
    display: "inline-block",
    textAlign: "center",
  },
  waitAnotherBtn2: {
    marginTop: theme.spacing(5),
  },
  winnerWrapper: {
    marginTop: theme.spacing(25),
  },
  winner: {
    textAlign: "center",
    color: "red",
    backgroundColor: fade("#000000", 0.3),
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    border: "2px solid red",
    borderRadius: "5px",
    textAlign: "center",
  },
  leaveClosedRoomWrapper: {
    backgroundColor: fade("#000000", 0.4),
    zIndex: "1000",
  },
  leaveClosedRoomBtn: {
    marginTop: theme.spacing(40),
    display: "inline-block",
    textAlign: "center",
    fontSize: "1.5em",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "inline-block",
    textAlign: "center",
  }
}));

export default function Spectator(props) {
  const boardSize = Utils.boardSize;
  const historyPages = useHistory();
  const location = useLocation();
  const { state, dispatch } = useContext(store);
  const { loadingState, dispatchLoading } = useContext(loadingStore);
  const [socket, setSocket] = useState(state.socket);
  const user = AuthService.getCurrentUser();
  if (!user) {
    historyPages.push(config.route.login);
  }
  const classes = useStyles();
  const nameRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(-1);

  // board.squares.length === 0 => Chưa start game
  const [board, setBoard] = useState({ squares: [] });
  const [roomChat, setRoomChat] = useState([]);
  const [chatText, setChatText] = useState("");
  const [winner, setWinner] = useState({});
  const [openSetting, setOpenSetting] = useState(false);
  const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
  const [roomOwner, setRoomOwner] = useState("");
  const [isRoomClosed, setIsRoomClosed] = useState(false);
  const [turnTime, setTurnTime] = useState(location.state.time); // Millisecond
  const [player1Time, setPlayer1Time] = useState(turnTime);
  const [player2Time, setPlayer2Time] = useState(turnTime);
  let countDownInterval = null;

  const [isOtherDis, setIsOtherDis] = useState(false);
  const [timeout, setTimeout] = useState(Utils.disconnectTimeout);

  const initializeRoomUser = [
    {
      user: user,
      role: location.state.roomID === user._id ? "Player 1" : "Player 2",
    },
  ];
  const [roomUsers, setRoomUsers] = useState(initializeRoomUser);
  const [spectators, setSpectators] = useState([]);

  const handleSetPlayersSpecRoom = (players) => {
    const newPlayers = players.map((player, index) => Object.assign({}, {
      user: player,
      role: (index === 0)? "Player 1" : "Player 2"
    }));
    setRoomUsers(newPlayers);
  }

  const handleOnPlayerLeave = (players) => {
    const newPlayers = players.map((player, index) => Object.assign({}, {
      user: player,
      role: (index === 0)? "Player 1" : "Player 2"
    }));
    setRoomUsers(newPlayers);
  };

  const handleOnLeave = () => {
    setOpenConfirmLeaveDialog(true);
  };

  const handleLeave = () => {
    setOpenSetting(false);
    LeaveSpecRoom(socket, location.state.roomID, user);
    JoinGlobalRoom(socket, user);
    historyPages.push("/dashboard");
  };

  const handleClick = (i) => {
    
  };
  

  useEffect(() => {
    PlayersSpecRoomRes(socket, handleSetPlayersSpecRoom);
    GetChatPrivateRoom(socket, handleOnGetRoomChat);
    GetGlobalUsers(socket, dispatch);
    LeaveRoomPlayerSpec(socket, handleOnPlayerLeave);
    GetBoard(socket, handleSetBoardVsCount);
    DeclareWinner(socket, handleWinner);
    CloseRoom(socket, location.state.roomID, handleOnCloseRoomRes);
    GetRoomOwner(socket, setRoomOwner);
    LoadingRes(socket, dispatchLoading);
    PlayerDisconnectRes(socket, handlePlayerDisRes);
    PlayerReconnectRes(socket ,handlePlayerRecon);
    SpecRoomRes(socket, setSpectators);
    GameStartSpec(socket, handleGameStart);
  }, []);

  const handleOnGetRoomChat = (msg) => {
    setRoomChat(msg);
  };

  const handleOnChangeChat = (e) => {
    setChatText(e.target.value);
  };

  const handleOnSubmitChat = (e) => {
    e.preventDefault();
    const temp = [...roomChat];
    const newChat = {
      _id: user._id,
      username: user.username,
      content: chatText,
      //time: Date.now(),
    };
    temp.push(newChat);
    setRoomChat(temp);
    ChatPrivateRoom(socket, location.state.roomID, newChat);
    setChatText("");
  };

  const handleWinner = (winner) => {
    setWinner(winner);
    setCurrentIndex(-1);
    clearCountDown();
    setPlayer1Time(turnTime);
    setPlayer2Time(turnTime);
  };

  const handleGameStart = (board) => {
    handleWinner("");
    handleSetBoardVsCount(board);
  }

  const handleOnCloseRoomRes = () => {
    setIsRoomClosed(true);
  };

  const handleCloseRoom = () => {
    historyPages.push("/dashboard");
    JoinGlobalRoom(socket, user);
  };

  const handleOnSetting = () => {
    setOpenSetting(true);
  };

  const handleOnCloseSetting = () => {
    setOpenSetting(false);
  };

  const handleOnInviteUser = (socketID) => {

  };

  const handleSetBoardVsCount = (board) => {
    setBoard(board);
    setCurrentIndex((board.row - 1) * boardSize + (board.col - 1));
    clearCountDown();
    if (!board.turn) return;
    // Player 1 Turn
    if (board.total % 2 === 0) {
      // Reset other player time
      setPlayer2Time(turnTime);
      const timeLeft = player1Time - ((board.total > 0)? (Date.now() - board.timeStart - board.moves[board.total - 1].time) :  0)
        + ((board.turnTimeUsed)? board.turnTimeUsed: 0);
      countDown(timeLeft, setPlayer1Time);
    }
    // Player 2 Turn (board.turn != 0)
    else {
      // Reset other player time
      setPlayer1Time(turnTime);
      const timeLeft = player2Time - ((board.total > 0)? (Date.now() - board.timeStart - board.moves[board.total - 1].time) :  0)
      + ((board.turnTimeUsed)? board.turnTimeUsed: 0);
      countDown(timeLeft, setPlayer2Time);
    }
  };

  const countDown = (time, setTime) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        time -= 1000; // Millisecond
        setTime(time);
        if (time <= 0) {
          clearInterval(interval);
          resolve(1);
        }
      }, 1000);
      countDownInterval = interval;
    });
  };

  const clearCountDown = () => {
    // Clear interval
    if (countDownInterval) {
      clearInterval(countDownInterval);
    }
  };

  let timeoutInterval;
  const handlePlayerDisRes = () => {
    setIsOtherDis(true);
    clearCountDown();
    timeoutCountDown(timeout, setTimeout).then((result) => {
      handleDisTimeout();
    })
  }

  const handleDisTimeout = () => {
    DisconnectedPlayerLose(socket, location.state.roomID, user)
    setIsOtherDis(false);
    clearTimeoutCountDown();
  }

  const handlePlayerRecon = () => {
    setIsOtherDis(false);
    clearTimeoutCountDown();
  }

  const timeoutCountDown = (time, setTime) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        time -= 1000; // Millisecond
        setTime(time);
        if (time === 0) {
          clearInterval(interval);
          resolve(1);
        }
      }, 1000);
      timeoutInterval = interval;
    });
  }

  const clearTimeoutCountDown = () => {
    clearInterval(timeoutInterval);
    setTimeout(Utils.disconnectTimeout);
  }

  const handleJoinPlaying = () => { console.log(location)
    historyPages.push({
      pathname: config.route.game,
      state: { roomID: location.state.roomID, turn: 2, time: location.state.time },
    });
    JoinRoomFromSpec(socket, location.state.roomID, user);
  }

  return (
    <Container className={classes.main} component="main" maxWidth="xl">
      <CssBaseline />
      <PlayerDisconnect display={isOtherDis} time={timeout}/>
      <div className={classes.paper}>
        <Grid container justify="center" spacing={2} className={classes.root}>
          <Grid key={0} item>
            <Grid
              container
              direction="column"
              justify="space-evenly"
              alignItems="flex-start"
              spacing={2}
            >
              <Grid item>
                  {(roomUsers[0])?
                    <UserInfo
                      user={roomUsers[0].user}
                      playerNum={1}
                      type="X"
                      onSetting={handleOnSetting}
                      time={player1Time}
                    />
                    :
                    <JoinPlaying/>
                  }
              </Grid>
              <div className="row" style={{ width: 300 }}>
                <div className={classes.boxChatWrapper}>
                  <CustomBox
                    title={config.string.MT_ROOM}
                    data={roomChat}
                    value={chatText}
                    ListComponent={ListGlobalChat}
                    ActionComponent={ChatBox}
                    onType={handleOnChangeChat}
                    onSubmit={handleOnSubmitChat}
                  ></CustomBox>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid key={1} item>
            <div className={classes.game}>
              <div className="game-board">
                <Board
                  boardSize={boardSize}
                  squares={board.squares}
                  onClick={(i) => handleClick(i)}
                  currentIndex={currentIndex}
                  winnerList={winner.winnerList}
                />
              </div>
              {isRoomClosed ? (
                <div
                  className={`${classes.controlWrapper} + ${classes.leaveClosedRoomWrapper}`}
                >
                  <Button
                    className={classes.leaveClosedRoomBtn}
                    variant="contained"
                    color="secondary"
                    onClick={handleCloseRoom}
                  >
                    {config.string.D_LEAVE_ROOM}
                  </Button>
                </div>
              ) : (
                ""
              )}
              {
                // When game hasn't been started
                board.squares.length === 0 ? (
                  <div className={classes.controlWrapper}>
                    {
                      // If there are enough players
                      roomUsers.length >= 2 ? (
                        <Button
                            className={`${classes.waitBtn} ${classes.waitAnotherBtn}`}
                          >
                            {config.string.D_WAITING_READY_SPEC}
                        </Button>
                      ) : (
                        // Waiting another player message
                        <Button
                          className={`${classes.waitBtn} ${classes.waitAnotherBtn}`}
                        >
                          {config.string.D_WAITING_PLAYER}
                        </Button>
                      )
                    }
                  </div>
                ) : // when game has already been started
                winner.winner ? (
                  <div className={classes.controlWrapper}>
                    <div className={classes.winnerWrapper}>
                      <Typography
                        variant="h5"
                        component="span"
                        className={classes.winner}
                      >
                        {winner.winner != config.string.MT_NONE
                          ? `${config.string.MT_WINNER} ` + winner.winner
                          : config.string.MT_DRAW}
                      </Typography>
                    </div>
                    {
                      // If there are enough players
                      roomUsers.length >= 2 ? (
                        <Button
                            className={`${classes.waitBtn} ${classes.waitAnotherBtn2}`}
                          >
                            {config.string.D_WAITING_READY_SPEC}
                        </Button>
                      ) : (
                        // Waiting another player message
                        <Button
                          className={`${classes.waitBtn} ${classes.waitAnotherBtn2}`}
                        >
                          {config.string.D_WAITING_PLAYER}
                        </Button>
                      )
                    }
                  </div>
                ) : (
                  ""
                )
              }
            </div>
          </Grid>
          <Grid key={2} item>
            <Grid
              container
              direction="column"
              justify="space-evenly"
              alignItems="flex-end"
              spacing={2}
            >
              <Grid item>
                {(roomUsers[1])?
                    <UserInfo
                      user={roomUsers[1].user}
                      playerNum={2}
                      type="O"
                      time={player2Time}
                    />
                    :
                    <JoinPlaying onClick={handleJoinPlaying}/>
                  }
              </Grid>
              <Grid item>
                <ListUser roomData={roomUsers} spectators={spectators} onInvite={handleOnInviteUser} />
              </Grid>
            </Grid>
          </Grid>
          <ConfirmDialog
            open={openConfirmLeaveDialog}
            action={handleLeave}
            setOpen={setOpenConfirmLeaveDialog}
          >
            <div align="center">
              {config.string.D_ASKING} <b>{config.string.MT_LEAVE_ROOM}</b>
            </div>
          </ConfirmDialog>
          <SettingDialog
            value={openSetting}
            onClose={handleOnCloseSetting}
            onLeave={handleOnLeave}
          />
        </Grid>
      </div>
    </Container>
  );
}
