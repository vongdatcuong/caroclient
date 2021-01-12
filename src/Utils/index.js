const SERVER = "http://localhost:4000";
const api = `${SERVER}/api`;
const boardSize = 20;
const RANGE = boardSize;
const disconnectTimeout = 180000;
// User
const userPath = "/user";
const logInPath = "/login";
const signUpPath = "/signup";
const gamePath = "/game";
const historyPath = "/history";
const emailValidation = "/emailValidation";
const sendEmailResetPassword = "/sendEmailResetPassword";
const resetPassword = "/resetPassword";
function queryParams(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
}

// Convert milliseconds to minutes & seconds
const milliSecondToMinSecFormat = (millisecond) => {
  millisecond = 1000 * Math.round(millisecond / 1000);
  const d = new Date(millisecond);
  const min = d.getUTCMinutes();
  let second = d.getUTCSeconds();
  second = second >= 10 ? second : "0" + second;
  return min + ":" + second;
};

const calculateWinner = (player, row, col, squares) => {
  let winningLine = [];
  row--;
  col--;
  let count = 0,
    k = row,
    h;
  let head = 0;
  // check col

  //count top-down
  while (
    k <= RANGE - 1 &&
    squares[k * boardSize + col] === squares[row * boardSize + col]
  ) {
    winningLine.push({ col: col, row: k }); //col is not change
    count++;
    k++;
  }

  //check head top-down
  if (
    (k <= RANGE - 1 && squares[k * boardSize + col] === player) ||
    (k <= RANGE - 2 && squares[(k + 1) * boardSize + col] === player)
  ) {
    head++;
  }

  k = row - 1;

  //count bottom-up
  while (
    k >= 0 &&
    squares[k * boardSize + col] === squares[row * boardSize + col]
  ) {
    winningLine.push({ col: col, row: k }); //col is not change
    count++;
    k--;
  }
  //check head bottom up
  if (
    (k >= 0 && squares[k * boardSize + col] === player) ||
    (k >= 1 && squares[(k - 1) * boardSize + col] === player)
  ) {
    head++;
  }

  if (count === 5 && head !== 2) return winningLine;

  //clear array
  winningLine = [];

  head = 0;
  count = 0;
  h = col;
  // check row
  //count left-right
  while (
    h <= RANGE - 1 &&
    squares[row * boardSize + h] === squares[row * boardSize + col]
  ) {
    winningLine.push({ col: h, row: row });
    count++;
    h++;
  }

  if (
    (h <= RANGE - 1 && squares[row * boardSize + h] === player) ||
    (h <= RANGE - 2 && squares[row * boardSize + h + 1] === player)
  ) {
    head++;
  }

  h = col - 1;
  //count right-left
  while (
    h >= 0 &&
    squares[row * boardSize + h] === squares[row * boardSize + col]
  ) {
    winningLine.push({ col: h, row: row });
    count++;
    h--;
  }

  if (
    (h >= 0 && squares[row * boardSize + h] === player) ||
    (h >= 1 && squares[row * boardSize + h - 1] === player)
  ) {
    head++;
  }

  if (count === 5 && head !== 2) return winningLine;

  //clear array
  winningLine = [];

  //check diagonal 1
  head = 0;
  h = row;
  k = col;
  count = 0;
  //count diagonal left-right top-down
  while (
    h <= RANGE - 1 &&
    k <= RANGE - 1 &&
    squares[row * boardSize + col] === squares[h * boardSize + k]
  ) {
    winningLine.push({ col: k, row: h });
    count++;
    h++;
    k++;
  }
  //check head left-right top-down
  if (
    (h <= RANGE - 1 &&
      k <= RANGE - 1 &&
      squares[h * boardSize + k] === player) ||
    (h <= RANGE - 2 &&
      k <= RANGE - 2 &&
      squares[(h + 1) * boardSize + k + 1] === player)
  ) {
    head++;
  }

  h = row - 1;
  k = col - 1;
  //count diagonal right-left bottom-up
  while (
    h >= 0 &&
    k >= 0 &&
    squares[row * boardSize + col] === squares[h * boardSize + k]
  ) {
    winningLine.push({ col: k, row: h });
    count++;
    h--;
    k--;
  }
  //check head right-left bottom-up
  if (
    (h >= 0 && k >= 0 && squares[h * boardSize + k] === player) ||
    (h >= 1 && k >= 1 && squares[(h - 1) * boardSize + k - 1] === player)
  ) {
    head++;
  }

  if (count === 5 && head !== 2) return winningLine;

  //clear array
  winningLine = [];

  //check diagonal 2
  h = row;
  k = col;
  count = 0;
  head = 0;
  //count right-left up-down
  while (
    h <= RANGE - 1 &&
    k >= 0 - 1 &&
    squares[row * boardSize + col] === squares[h * boardSize + k]
  ) {
    winningLine.push({ col: k, row: h });
    count++;
    h++;
    k--;
  }
  //check head right-left up-down
  if (
    (h <= RANGE - 1 && k >= 0 && squares[h * boardSize + k] === player) ||
    (h <= RANGE - 2 &&
      k >= 1 &&
      squares[(h + 1) * boardSize + k + 1] === player)
  ) {
    head++;
  }

  h = row - 1;
  k = col + 1;
  //count left-right bottom-up
  while (
    h >= 0 &&
    squares[row * boardSize + col] === squares[h * boardSize + k]
  ) {
    winningLine.push({ col: k, row: h });
    count++;
    h--;
    k++;
  }
  if (
    (h >= 0 && k <= RANGE - 1 && squares[h * boardSize + k] === player) ||
    (h >= 1 &&
      h <= RANGE - 2 &&
      squares[(h - 1) * boardSize + k - 1] === player)
  ) {
    head++;
  }

  if (count === 5 && head !== 2) return winningLine;

  return false;
};

export default {
  api,
  SERVER,
  boardSize,
  disconnectTimeout,
  // User
  userPath,
  logInPath,
  signUpPath,
  gamePath,
  historyPath,
  emailValidation,
  sendEmailResetPassword,
  resetPassword,
  //
  queryParams,
  milliSecondToMinSecFormat,
  calculateWinner
};
export const config = {
  google_auth_client_id: "305153341920-na9skb2rrfi5tq5tce99v8bphj5ar4b1",
  facebook_app_id: "373730223867541",
};
