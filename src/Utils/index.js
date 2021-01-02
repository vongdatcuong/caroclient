const SERVER = "http://localhost:4000";
const api = `${SERVER}/api`;
const boardSize = 20;
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
  millisecond = 1000*Math.round(millisecond/1000);
  const d = new Date(millisecond);
  const min = d.getUTCMinutes();
  let second = d.getUTCSeconds();
  second = (second >= 10)? second : "0" + second;
  return min + ':' + second;
}

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
  milliSecondToMinSecFormat
};
export const config = {
  google_auth_client_id: "305153341920-na9skb2rrfi5tq5tce99v8bphj5ar4b1",
  facebook_app_id: "373730223867541",
};