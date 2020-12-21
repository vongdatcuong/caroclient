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
  StartGame,
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
  paper: {
    marginTop: theme.spacing(1.8),
    display: "flex",
    alignItems: "center",
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
  waitAnotherBtn: {
    marginTop: theme.spacing(30),
    display: 'inline block',
    textAlign: 'center',
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
  const [roomOwner, setRoomOwner] = useState('');

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
  };

  const handleOnCloseRoomRes = () => {
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

  const handleOnStartGame = () => {
    StartGame(socket, location.state.roomID, user);
  }

  const handleOnRestartGame = () => {
    RestartGame(socket, location.state.roomID, user);
  }

  const handleRestartGameRes = (emptyBoard) => {
    setBoard(emptyBoard);
    setWinner("");
  }

  return (
    <Container component="main" maxWidth="xl">
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
              <div className={classes.controlWrapper}>
                {(winner) ? (
                    <div className={classes.winnerWrapper}>
                      <Typography variant="h5" component="span" className={classes.winner}>
                        Winner {winner}
                      </Typography>
                    </div>
                    ) : (
                      "")
                }
                {
                  // When game hasn't been started
                  (board.squares.length === 0) ? 
                    (
                      // If there are enough players
                      (roomUsers.length >= 2)? 
                      (
                        (roomOwner === user._id)?
                          <Button
                            startIcon={<PlayCircleFilledWhiteIcon/>} 
                            className={classes.startBtn}
                            onClick={handleOnStartGame}
                          >
                            Start
                          </Button>
                          :
                          // Waiting start game message
                          <Button
                            className={classes.waitBtn}
                          >
                            Game is starting soon ...  
                          </Button>
                      )
                      :
                      // Waiting another player message
                      <Button
                        className={`${classes.waitBtn} ${classes.waitAnotherBtn}`}
                      >
                        Waiting for another player ...  
                      </Button>  
                    ) : 
                    (
                      (winner)? 
                        // Restart game
                        <Button
                          startIcon={<PlayCircleFilledWhiteIcon/>} 
                          className={`${classes.startBtn} + ${classes.restartBtn}`}
                          onClick={handleOnRestartGame}
                        >
                          Restart
                        </Button>
                      :
                        ""
                    )
                }
              </div>
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
