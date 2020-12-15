const SERVER = "http://localhost:4000";
const api = `${SERVER}/api`;

// User
const userPath = "/user";
const logInPath = "/login";
const signUpPath = "/signup";

function queryParams(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
}

export default {
  api,
  SERVER,
  // User
  userPath,
  logInPath,
  signUpPath,
  //
  queryParams,
};
