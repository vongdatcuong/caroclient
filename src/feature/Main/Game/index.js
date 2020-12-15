import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
// Components
// Constant && Services
import AuthService from "../../../services/auth.service";
import Board from "./components/board";
import Chatbox from "./components/chatbox";
import Settings from "./components/settings";
import UserInfo from "./components/user-info";
import "./index.css";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
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

export default function Game (props) {
  const historyPages = useHistory();
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

  const handleClick = (i) => {
    const history_t = history.slice(0, stepNumber + 1);
    const current = history_t[history_t.length - 1];
    const squares = current.squares.slice();
    const col = (i % 3) + 1;
    const row = Math.floor(i / 3) + 1;
    const total = current.total;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";

    setHistory(
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
    setIsAsc(isAsc);
  };
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const totalMoves = current.total;
  let status;
  if (winner) {
    const winnerValue = current.squares[winner[0]];
    status = "Winner: " + winnerValue;
  } else if (totalMoves === current.squares.length) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const currentLocation = { row: current.row, col: current.col };
  const usertest = {
    name: 'Test',
    username: 'usertest',
    rank: 'Master',
    point: 10,
    win: 1,
    lose: 1,
  };
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
                <UserInfo user={usertest} type="X" />
              </Grid>
              <Grid item>
                <Chatbox />
              </Grid>
            </Grid>
          </Grid>
          <Grid key={1} item>
            <div className="game">
              <div className="game-board">
                <Board
                  boardSize={15}
                  squares={current.squares}
                  onClick={(i) => handleClick(i)}
                  currentLocation={currentLocation}
                  winnerList={winner}
                />
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
                <UserInfo user={usertest} type="O" />
              </Grid>
              <Grid item>
                <Settings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

