const api = "http://localhost:4000/api";

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
  // User
  userPath,
  logInPath,
  signUpPath,
  //
  queryParams,
};