const SERVER = "http://localhost:4000";
const api = `${SERVER}/api`;

// User
const userPath = "/user";
const logInPath = "/login";
const signUpPath = "/signup";
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
  // User
  userPath,
  logInPath,
  signUpPath,
  emailValidation,
  sendEmailResetPassword,
  resetPassword,
  //
  queryParams,
  milliSecondToMinSecFormat
};
