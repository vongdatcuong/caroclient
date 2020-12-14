import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// Material UI Core
import Typography from "@material-ui/core/Typography";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// Components
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";

// Service
import authHeader from "../../../services/auth-header";
import AuthService from "../../../services/auth.service";
import constant from "../../../Utils/index";

import { store } from "../../../context/socket-context";
import socketIOClient from "socket.io-client";
const SERVER = "http://localhost:4001";

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
  const [socket, setSocket] = useState(state);
  const [listUser, setListUser] = useState([]);
  if (!AuthService.getCurrentUser()) {
    history.push("/logIn");
  }

  const classes = useStyles();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const socket = socketIOClient(SERVER);
    if (state === "") dispatch({ type: "connect", payload: socket });
    socket.emit("user", { socketID: state.id, username: user.username });
    socket.on("list-user", (data) => {
      setListUser(data);
    });
  }, []);

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
          {listUser.length > 0 &&
            listUser.map((value, index) => {
              return <li>{value.username}</li>;
            })}
        </ul>
      </Container>
    </main>
  );
};

export default DashBoard;
