import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";

// Material UI Core
import Typography from "@material-ui/core/Typography";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// Components
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";

// Service
import AuthService from "../../../services/auth.service";
import { store } from "../../../context/socket-context";
import {
  GetGlobalUsers,
  JoinGlobalRoom,
  ChatGlobalRoom,
  GetChatGlobalRoom,
} from "../../../services/socket/base-socket";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    maxWidth: "1400px",
  },
}));

const DashBoard = (props) => {
  const history = useHistory();
  const { state, dispatch } = useContext(store);
  const [socket, setSocket] = useState(state.socket);
  const [chat, setChat] = useState("");
  if (!AuthService.getCurrentUser()) {
    history.push("/logIn");
  }
  const classes = useStyles();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    JoinGlobalRoom(socket, { id: socket.id, username: user.username });
    GetGlobalUsers(socket, dispatch);
    GetChatGlobalRoom(socket, dispatch);
  }, []);

  const handleChange = (event) => {
    setChat(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    ChatGlobalRoom(socket, { username: user.username, msg: chat });
    setChat("");
  };

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Typography
          gutterBottom
          variant="h4"
          component="h2"
          className="title-green"
          style={{ fontWeight: "500" }}
        >
          Go Go Go !!!
        </Typography>
        <ul>
          {state.globalUsers.length > 0 &&
            state.globalUsers.map((value, index) => {
              return <li key={index}>{value.username}</li>;
            })}
        </ul>
        <ul>
          {state.globalChat.length > 0 &&
            state.globalChat.map((value, index) => {
              return <li key={index}>{value.username + ": " + value.msg}</li>;
            })}
        </ul>
        <form onSubmit={handleSubmit}>
          <label>
            Chat:
            <input type="text" value={chat} onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </Container>
    </main>
  );
};

export default DashBoard;
