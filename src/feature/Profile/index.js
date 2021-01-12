import React, { useState, useRef, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Avatar, List, ListItem, ListItemText } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import StarIcon from "@material-ui/icons/Star";

// Material Icons
import BorderColorIcon from "@material-ui/icons/BorderColor";

// Components
import Footer from "../../components/layouts/Footer";

// Constant && Services
import authHeader from "../../services/auth-header.js";
import AuthService from "../../services/auth.service";
import constant from "../../Utils/index";
import { loadingStore } from "../../context/loading-context";
import { config } from "../../config";

import { deepOrange } from "@material-ui/core/colors";
import ImgurApiService from "../../services/api/imgur-api";
import { httpGet, httpPost, httpPut } from "../../services/api/base-api";
import ListHistory from "./components/ListHistory";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(3),
    color: "#ffffff",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "60px",
    padding: "5px",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
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
  formControl: {
    color: "#555555 !important",
  },
  updateIcon: {
    marginLeft: "10px",
    verticalAlign: "middle",
    cursor: "pointer",
  },
  avatarImage: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: 20,
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  row: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    marginLeft: 10,
  },
}));

export default function SignUp(props) {
  const history = useHistory();
  const user = AuthService.getCurrentUser();
  if (!user) {
    history.push(config.route.login);
  }
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);
  const nameRef = useRef();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMsg, setErrMsg] = useState("");
  const [avatar, setAvatar] = useState(user.avatar);
  const [data, setData] = useState({});
  const { loadingState, dispatchLoading } = useContext(loadingStore);
  const [historyData, setHistoryData] = useState([]);

  const toggleUpdate = (evt) => {
    setDisabled(!disabled);
    const timeout = setTimeout(() => {
      nameRef.current.focus();
    }, 100);
  };

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  };

  const handleEmailChange = (evt) => {
    setEmail(evt.target.value);
  };
  const handleUploadImage = async (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = async function (e) {
        const base64Value = reader.result.replace("data:image/png;base64,", "");
        try {
          const uploadRes = await ImgurApiService.uploadImage(base64Value);
          const uploadResult = await uploadRes.json();
          if (
            uploadResult.success &&
            uploadResult.data &&
            uploadResult.data.link
          ) {
            setAvatar(uploadResult.data.link);
            console.log(uploadResult.data.link);
          }
        } catch (err) {
          console.log(err);
        }
      };
    }
  };
  const handleUpdate = (event) => {
    event.preventDefault();

    if (!name) {
      return;
    }
    dispatchLoading({ type: "Set-Loading", isLoading: true });
    const requestOptions = {
      method: "PUT",
      headers: Object.assign(
        {
          "Content-Type": "application/json",
        },
        authHeader()
      ),
      body: JSON.stringify({
        data: Buffer.from(
          JSON.stringify({
            name: name,
            email: email,
            avatar: avatar,
          })
        ).toString("base64"),
      }),
    };
    httpPut({ url: `/user/${user._id}`, option: requestOptions })
      .then((response) => response.json())
      .then(
        (result) => {
          console.log(result);
          if (result.isSuccess) {
            localStorage.setItem("user", JSON.stringify(result.payload));
            localStorage.setItem("token", result.token);
          }
          setIsSuccess(result.isSuccess);
          setErrMsg(result.message);
          if (result.isEmailSent) {
            setErrMsg(result.message + "\nPlease Verify your new email");
          } else {
            setErrMsg(result.message + "\nVerify email failed to send!");
          }
          dispatchLoading({ type: "Set-Loading", isLoading: false });
        },
        (error) => {
          if (error) {
            dispatchLoading({ type: "Set-Loading", isLoading: false });
          }
        }
      );
  };

  useEffect(() => {
    const p = httpGet({ url: `/user/list-game?userID=${user._id}` }).then(
      (value) => {
        setHistoryData(value.payload);
      }
    );
    const p2 = httpGet({ url: `/user/${user._id}` }).then((value) => {
      setUsername(value.data.username);
      setName(value.data.name);
      setAvatar(value.data.avatar);
      setData(value.data);
    });
    Promise.all([p, p2]);
  }, []);

  //OnClick History
  const handleOnHistory = (gameID) => {
    history.push(config.route.history + "/" + gameID);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: 20 }}>
      <CssBaseline />
      <div className={classes.paper}>
        {avatar ? (
          <Avatar alt={name} src={avatar} className={classes.avatarImage} />
        ) : (
          <Avatar
            alt={name}
            className={classes.orange}
            className={classes.avatarImage}
          >
            {name ? name[0] : username[0]}
          </Avatar>
        )}
        {!disabled ? (
          <Button
            variant="contained"
            component="label"
            color="secondary"
            disabled={disabled}
            className={classes.submit}
            endIcon={<PublishIcon color="white" />}
          >
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleUploadImage}
            />
          </Button>
        ) : null}
        <Typography component="h1" variant="h5">
          Your Profile
          <BorderColorIcon
            className={classes.updateIcon}
            onClick={(evt) => toggleUpdate(evt)}
          />
        </Typography>
        <form className={classes.form} onSubmit={(evt) => handleUpdate(evt)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                InputProps={{
                  className: classes.formControl,
                }}
                disabled={true}
                value={username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="email"
                autoFocus
                InputProps={{
                  className: classes.formControl,
                }}
                disabled={true}
                value={email}
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
                autoFocus
                inputRef={nameRef}
                InputProps={{
                  className: classes.formControl,
                }}
                disabled={disabled}
                value={name}
                error={name === ""}
                helperText={name === "" ? "Enter Name" : " "}
                onChange={(evt) => handleNameChange(evt)}
              />
            </Grid>
          </Grid>
          <div>
            <h2>{`Game Infomation`}</h2>
            <div className={classes.row}>
              <VideogameAssetIcon />
              <Typography
                className={classes.text}
              >{`Win: ${data?.win} | Lose:${data?.lose} | Draw: ${data?.draw} | Winrate: ${100 * Math.round(((data?.win)/(data?.win + data?.lose + data?.draw) + Number.EPSILON) * 100) / 100}%`}</Typography>
            </div>
            <div className={classes.row}>
              <StarIcon />
              <Typography
                className={classes.text}
              >{`Ranking: ${data?.rank}`}</Typography>
            </div>
            <div className={classes.row}>
              <EmojiEventsIcon />
              <Typography
                className={classes.text}
              >{`Trophy: ${data?.trophy}`}</Typography>
            </div>
          </div>
          {disabled && (
            <ListHistory
              data={historyData}
              user={user._id}
              onClick={(gameID) => handleOnHistory(gameID)}
            />
          )}
          <br />
          <FormHelperText
            className={
              isSuccess ? classes.formMessageSuccess : classes.formMessageFail
            }
            error={!isSuccess}
          >
            {errorMsg}
          </FormHelperText>
          {!disabled && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleUpdate}
            >
              Update
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/dashBoard" variant="body2">
                {"Back to Dashboard"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
