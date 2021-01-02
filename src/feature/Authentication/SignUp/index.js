import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import BackgroundImg from "../../../vendors/images/background-img.jpg";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import FacebookIcon from "@material-ui/icons/Facebook";
// Components
import Footer from "../../../components/layouts/Footer";

// Constant && Services
import AuthService from "../../../services/auth.service";
import { loadingStore } from "../../../context/loading-context";
import { BtnFacebook, BtnGoogle } from "../../../components/custom-components";
import { config } from "../../../config";

const useStyles = makeStyles((theme) => ({
  bgImg: {
    width: "100%",
    height: "90%",
    position: "absolute",
    zIndex: "-1",
    backgroundImage: "url(" + BackgroundImg + ")",
    backgroundSize: "80% 100%",
  },
  title: {
    color: "#016310",
    zIndex: "1",
  },
  paper: {
    marginTop: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.error.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
    backgroundColor: "#016310",
  },
  formMessageSuccess: {
    textAlign: "center",
    fontSize: "1.1em",
    color: "#4BB543",
  },
  formMessageFail: {
    textAlign: "center",
    fontSize: "1.1em",
    color: "#ff1500",
  },
}));

export default function SignUp(props) {
  const history = useHistory();
  if (AuthService.getCurrentUser()) {
    history.push("/dashboard");
  }
  const { loadingState, dispatchLoading } = useContext(loadingStore);
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMsg, setErrMsg] = useState("");

  function handleUsernameChange(evt) {
    setUsername(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleRePasswordChange(evt) {
    setRePassword(evt.target.value);
  }

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }
  const responseFacebook = async (response) => {
    if (!response.name) {
      return;
    }
    const fbresponse = {
      name: response.name,
      email: response.email,
      facebook_token: response.userID,
      photo_link: response.picture.data.url,
      username: response.email,
    };
    try {
      let res = await AuthService.facebookLogin(fbresponse);
      let response = await res.json();
      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        history.push("/");
      } else {
        setErrMsg(response.msg);
      }
    } catch (error) {
      setErrMsg("Error when login");
      console.log(error);
    }
  };
  const errorGoogle = (response) => {
    console.log(response);
  };
  const signUpGoogle = async (response) => {
    const googleresponse = {
      name: response.profileObj.name,
      email: response.profileObj.email,
      google_token: response.googleId,
      photo_link: response.profileObj.imageUrl,
      username: response.profileObj.email,
    };
    try {
      let res = AuthService.googleLogin(googleresponse);
      let response = await res.json();
      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        history.push("/");
      } else {
        setErrMsg(response.msg);
      }
    } catch (error) {
      setErrMsg("Error when login");
      console.log(error);
    }
  };
  function handleSignUp(event) {
    event.preventDefault();
    if (
      !username ||
      !password ||
      !repassword ||
      password != repassword ||
      !name ||
      !email
    ) {
      return;
    }
    dispatchLoading({ type: "Set-Loading", isLoading: true });
    const fetch = AuthService.signUp(username, password, name, email).then(
      (result) => {
        setIsSuccess(result.isSuccess);
        if (result.isSuccess) {
          setUsername("");
          setPassword("");
          setRePassword("");
          setName("");
          setEmail("");
        }
        setErrMsg(result.message);
        dispatchLoading({ type: "Set-Loading", isLoading: false });
      },
      (error) => {
        if (error) {
          dispatchLoading({ type: "Set-Loading", isLoading: false });
        }
      }
    );
  }

  return (
    <React.Fragment>
      <div className={classes.bgImg}></div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <CreateIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.title}>
            {config.string.MT_SIGN_UP}
          </Typography>
          <form className={classes.form} onSubmit={(evt) => handleSignUp(evt)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={username}
                  onChange={(evt) => handleUsernameChange(evt)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(evt) => handlePasswordChange(evt)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="re-password"
                  label="Confirm Password"
                  type="password"
                  id="re-password"
                  autoComplete="re-password"
                  value={repassword}
                  error={password !== repassword}
                  helperText={
                    password !== repassword ? "Confirm Password incorrect" : " "
                  }
                  onChange={(evt) => handleRePasswordChange(evt)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fullName"
                  name="fullName"
                  variant="outlined"
                  required
                  fullWidth
                  id="fullName"
                  label="Full name"
                  value={name}
                  onChange={(evt) => handleNameChange(evt)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  name="email"
                  variant="outlined"
                  required
                  type="email"
                  fullWidth
                  id="email"
                  label="Email"
                  value={email}
                  onChange={(evt) => handleEmailChange(evt)}
                />
              </Grid>
            </Grid>
            <FormHelperText
              className={
                isSuccess ? classes.formMessageSuccess : classes.formMessageFail
              }
              error={!isSuccess}
            >
              {errorMsg}
            </FormHelperText>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {config.string.MT_SIGN_UP}
            </Button>
            <GoogleLogin
              clientId={
                config.key.GOOGLE_CLIENT_ID + ".apps.googleusercontent.com"
              }
              render={(renderProps) => (
                <BtnGoogle
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  style={{ width: "100%" }}
                >
                  {config.string.MT_SIGN_IN_GOOGLE}
                </BtnGoogle>
              )}
              buttonText="Login with Google"
              onSuccess={signUpGoogle}
              onFailure={errorGoogle}
            ></GoogleLogin>
            <FacebookLogin
              appId={config.key.FACEBOOK_CLIENT_ID}
              fields="name,email,picture"
              callback={responseFacebook}
              render={(renderProps) => (
                <BtnFacebook
                  onClick={renderProps.onClick}
                  style={{ width: "100%" }}
                  startIcon={<FacebookIcon />}
                >
                  {config.string.MT_SIGN_IN_FACEBOOK}
                </BtnFacebook>
              )}
              style={{ width: "100%" }}
            />
            <Grid container justify="flex-end">
              <Grid item>
                <Link href={config.route.login} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </React.Fragment>
  );
}
