import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from '@material-ui/core/styles/colorManipulator';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import BoxChat from "../../../components/layouts/BoxChat";
import { store } from "../../../context/socket-context";
// Components
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import BackgroundGameImg from "../../../vendors/images/background-game.jpg";

// Constant && Services
import AuthService from "../../../services/auth.service";
import {
  GetBoard,
  GetChatPrivateRoom,
  LeaveRoom,
  LeaveRoomPlayer,
  MakeAMove,
  DeclareWinner,
  GetGlobalUsers,
  InviteUser,
  GetInviteRequest,
  WithDraw,
  GetRoomOwner,
  ReadyGame,
  ReadyGameRes,
  RestartGame,
  RestartGameRes,
} from "../../../services/socket/base-socket";
import Board from "./components/board";
import Chatbox from "./components/chatbox";
import Settings from "./components/settings";
import SettingDialog from "../../../components/dialogs/SettingDialog/index";
import UserInfo from "./components/user-info";
import ConfirmDialog from '../../../components/dialogs/ConfirmDialog';

import {
  GetSecondPlayer,
  GetFirstPlayer,
  ChatPrivateRoom,
  CloseRoom,
  JoinGlobalRoom,
} from "../../../services/socket/base-socket";
import "./index.css";
import { Typography } from "@material-ui/core";
import ListUser from "./components/list-user";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundImage: "url(" + BackgroundGameImg + ")",
    backgroundSize: 'contain'
  },
  paper: {
    display: "flex",
    alignItems: "center",
  },
  root: {
    marginTop: '0px'
  },
  avatar: {
    margin: theme.spacing(3),
    color: "#ffffff",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "60px",
    padding: "5px",
  },
  game: {
    position: 'relative',
  },
  controlWrapper: {
    position: "absolute",
    width: '100%',
    height: '100%',
    top: 0,
    textAlign: 'center',
    zIndex: '999'
  },
  start: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    fontSize: '1.5em',
    color: '#016310',
    backgroundColor: fade('#ffffff', 1),
    border: '3px solid #016310',
    borderRadius: '5px',
    textAlign: "center",
  },
  startBtn: {
    marginTop: theme.spacing(30),
    display: 'inline block',
    textAlign: 'center',
    fontSize: '1.5em',
    color: '#016310',
    backgroundColor: fade('#ffffff', 1),
    border: '3px solid #016310',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  restartBtn: {
    marginTop: theme.spacing(5),
  },
  waitBtn: {
    marginTop: theme.spacing(30),
    display: 'inline-block',
    textAlign: 'center',
    fontSize: '1.5em',
    color: '#016310',
    backgroundColor: fade('#ffffff', 1),
    border: '3px solid #016310',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  waitAnotherBtn: {
    marginTop: theme.spacing(30),
    display: 'inline-block',
    textAlign: 'center',
  },
  waitAnotherBtn2: {
    marginTop: theme.spacing(5)
  },
  winnerWrapper: {
    marginTop: theme.spacing(25),
  },
  winner: {
    textAlign: 'center',
    color: "red",
    backgroundColor: fade('#000000', 0.3),
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    border: '2px solid red',
    borderRadius: '5px',
    textAlign: "center",
  },
  leaveClosedRoomWrapper: {
    backgroundColor: fade('#000000', 0.4),
    zIndex: '1000'
  },
  leaveClosedRoomBtn: {
    marginTop: theme.spacing(40),
    display: 'inline-block',
    textAlign: 'center',
    fontSize: '1.5em',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'inline-block',
    textAlign: 'center',
  }
}));
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export default function Game(props) {
  const boardSize = 20;
  const historyPages = useHistory();
  const location = useLocation();
  const { state, dispatch } = useContext(store);
  const [socket, setSocket] = useState(state.socket);
  const user = AuthService.getCurrentUser();
  if (!user) {
    historyPages.push("/login");
  }
  const classes = useStyles();
  const nameRef = useRef();
  const [history, setHistory] = useState([
    {
      col: 0,
      row: 0,
      total: 0,
      squares: Array(9).fill(null),
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAsc, setIsAsc] = useState(true);

  // board.squares.length === 0 => Chưa start game
  const [board, setBoard] = useState({ squares: [] });
  const [roomChat, setRoomChat] = useState([]);
  const [secondPlayer, setSecondPlayer] = useState({});
  const [chatText, setChatText] = useState("");
  const [winner, setWinner] = useState("");
  const [openSetting, setOpenSetting] = useState(false);
  const [openConfirmWithdrawDialog, setOpenConfirmWithdrawDialog] = useState(false);
  const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
  const [roomOwner, setRoomOwner] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isRoomClosed, setIsRoomClosed] = useState(false);

  const initializeRoomUser = [
    {
      user: user,
      role: location.state.roomID === user._id ? "Player 1" : "Player 2",
    },
  ];
  const [roomUsers, setRoomUsers] = useState(initializeRoomUser);

  const handleOnLoadSecondPlayer = (value) => {
    setRoomUsers([
      ...roomUsers,
      {
        user: value,
        role: location.state.roomID === user._id ? "Player 2" : "Player 1",
      },
    ]);
    setSecondPlayer(value);
  };

  const handleOnPlayerLeave = (player) => {
    setRoomUsers(roomUsers.filter((e) => e.user._id !== player));
  };

  const handleOnWithDraw = () => {
    setOpenConfirmWithdrawDialog(true);
  };

  const handleWithDraw = () => {
    WithDraw(socket, location.state.roomID, user);
    setOpenSetting(false);
  }
  
  const handleOnLeave = () => {
    setOpenConfirmLeaveDialog(true);
  };

  const handleLeave = () => {
    setOpenSetting(false);
    LeaveRoom(socket, location.state.roomID, user);
    JoinGlobalRoom(socket, user);
    historyPages.push("/dashboard");
  };

  const handleClick = (i) => {
    if (board.squares.length === 0 || winner || board.turn != user._id || board.squares[i]) {
      return;
    }
    //const history_t = history.slice(0, stepNumber + 1);
    //const current = history_t[history_t.length - 1];
    //const squares = current.squares.slice();
    const col = (i % boardSize) + 1;
    const row = Math.floor(i / boardSize) + 1;
    const total = board.total;
    MakeAMove(socket, location.state.roomID, user, {
      idx: i,
      col: col,
      row: row,
    });
    //if (calculateWinner(squares) || squares[i]) {
    //  return;
    //}
    //squares[i] = xIsNext ? "X" : "O";

    /*setHistory(
      history_t.concat([
        {
          col: col,
          row: row,
          total: total + 1,
          squares: squares,
        },
      ])
    );
    setStepNumber(history_t.length);
    setXIsNext(!xIsNext);
    setIsAsc(isAsc);*/
  };
  const current = history[stepNumber];
  /*const winner = calculateWinner(current.squares);
  const totalMoves = current.total;
  let status;
  if (winner) {
    const winnerValue = current.squares[winner[0]];
    status = "Winner: " + winnerValue;
  } else if (totalMoves === current.squares.length) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }*/
  const currentLocation = { row: current.row, col: current.col };

  useEffect(() => {
    GetSecondPlayer(socket, handleOnLoadSecondPlayer);
    GetFirstPlayer(socket, handleOnLoadSecondPlayer);
    GetChatPrivateRoom(socket, handleOnGetRoomChat);
    GetGlobalUsers(socket, dispatch);
    LeaveRoomPlayer(socket, handleOnLoadSecondPlayer, handleOnPlayerLeave);
    GetBoard(socket, setBoard);
    DeclareWinner(socket, handleWinner);
    CloseRoom(socket, location.state.roomID, handleOnCloseRoomRes);
    GetRoomOwner(socket, setRoomOwner);
    ReadyGameRes(socket, handleReadyGameRes);
    RestartGameRes(socket, handleRestartGameRes);
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
      msg: chatText,
      time: Date.now(),
    };
    temp.push(newChat);
    setRoomChat(temp);
    ChatPrivateRoom(socket, location.state.roomID, newChat);
    setChatText("");
  };

  const handleWinner = (winner) => {
    setWinner(winner);
    setIsReady(false);
  };

  const handleOnCloseRoomRes = () => {
    setIsRoomClosed(true);
  };

  const handleCloseRoom = () => {
    historyPages.push("/dashboard");
    JoinGlobalRoom(socket, user);
  }

  const handleOnSetting = () => {
    setOpenSetting(true);
  };

  const handleOnCloseSetting = () => {
    setOpenSetting(false);
  };

  const handleOnInviteUser = (socketID) => {
    console.log(socketID);
    InviteUser(socket, {
      id: socketID,
      room: {
        id: location.state.roomID,
        title: location.state.title,
        creator: location.state.creator,
      },
    });
  };

  const handleOnReadyGame = () => {
    ReadyGame(socket, location.state.roomID, user);
    setIsReady(true);
    setWinner("");
  }

  const handleReadyGameRes = (_id) => {
    if (user._id === _id){
      setIsReady(true);
    }
  }

  const handleOnRestartGame = () => {
    RestartGame(socket, location.state.roomID, user);
    setIsReady(true);
    setBoard({squares: []});
    setWinner("");
  }

  const handleRestartGameRes = (emptyBoard) => {
    setBoard(emptyBoard);
  }

  return (
    <Container className={classes.main} component="main" maxWidth="xl">
      <CssBaseline />
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
                <UserInfo
                  user={user}
                  playerNum={1}
                  type={location.state.turn === 1 ? "X" : "O"}
                  onSetting={handleOnSetting}
                />
              </Grid>
              <div className="row" style={{ width: 300 }}>
                <div className={classes.boxChatWrapper}>
                  <BoxChat
                    title="ROOM"
                    data={roomChat}
                    value={chatText}
                    onType={handleOnChangeChat}
                    onSubmit={handleOnSubmitChat}
                  ></BoxChat>
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
                  currentLocation={currentLocation}
                  winnerList={winner}
                />
              </div>
              {
                (isRoomClosed)? 
                  <div className={`${classes.controlWrapper} + ${classes.leaveClosedRoomWrapper}`}>
                    <Button
                      className={classes.leaveClosedRoomBtn}
                      variant="contained"
                      color="secondary"
                      onClick={handleCloseRoom}
                    >
                      Room is closed. LEAVE NOW.
                    </Button> 
                  </div>
                  :
                  ""
              }
              {
                // When game hasn't been started
                  (board.squares.length === 0) ? 
                    <div className={classes.controlWrapper}>
                      {
                        // If there are enough players
                        (roomUsers.length >= 2)? 
                          (
                            (!isReady)?
                              (
                                <Button
                                    startIcon={<PlayCircleFilledWhiteIcon/>} 
                                    className={classes.startBtn}
                                    onClick={handleOnReadyGame}>
                                    Ready
                                </Button>
                              )
                              :
                              (
                                <Button
                                  className={`${classes.waitBtn} ${classes.waitAnotherBtn}`}
                                >
                                  Waiting for the other player to be ready ...  
                                </Button>
                              )
                          )
                          :
                          (
                            // Waiting another player message
                            <Button
                              className={`${classes.waitBtn} ${classes.waitAnotherBtn}`}
                            >
                              Waiting for another player ...  
                            </Button>  
                          )
                      }
                    </div>
                  :
                  // when game has already been started
                  (winner) ?
                    <div className={classes.controlWrapper}>
                      <div className={classes.winnerWrapper}>
                        <Typography variant="h5" component="span" className={classes.winner}>
                          Winner {winner}
                        </Typography>
                      </div>
                      {
                        // If there are enough players
                        (roomUsers.length >= 2)? 
                          (!isReady)?
                              <Button
                                startIcon={<PlayCircleFilledWhiteIcon/>} 
                                className={`${classes.startBtn} + ${classes.restartBtn}`}
                                onClick={handleOnRestartGame}
                              >
                                Ready
                              </Button>
                            :
                              <Button
                                className={`${classes.waitBtn} ${classes.waitAnotherBtn2}`}
                              >
                                Waiting for the other player to be ready ...  
                              </Button>
                        :
                        (
                          // Waiting another player message
                          <Button
                            className={`${classes.waitBtn} ${classes.waitAnotherBtn2}`}
                          >
                            Waiting for another player ...  
                          </Button>  
                        )
                      }
                    </div>
                    :
                    ""
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
                <UserInfo
                  user={secondPlayer}
                  playerNum={2}
                  type={location.state.turn === 1 ? "O" : "X"}
                />
              </Grid>
              <Grid item>
                <ListUser roomData={roomUsers} onInvite={handleOnInviteUser} />
              </Grid>
            </Grid>
          </Grid>
          <ConfirmDialog
            open={openConfirmWithdrawDialog}
            action={handleWithDraw}
            setOpen={setOpenConfirmWithdrawDialog}
          >
            <div align='center'>Do you want to <b>Withdraw</b></div>
          </ConfirmDialog>
          <ConfirmDialog
            open={openConfirmLeaveDialog}
            action={handleLeave}
            setOpen={setOpenConfirmLeaveDialog}
          >
            <div align='center'>Do you want to <b>Leave</b></div>
          </ConfirmDialog>
          <SettingDialog
            value={openSetting}
            onWithdraw={(board.squares.length > 0)? handleOnWithDraw : null}
            onClose={handleOnCloseSetting}
            onLeave={handleOnLeave}
          />
        </Grid>
      </div>
    </Container>
  );
}
