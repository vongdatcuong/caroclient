import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// Material UI Core
import Typography from "@material-ui/core/Typography";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Pagination from '@material-ui/lab/Pagination';

// Material UI Icon
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Components

import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import BoxChat from "../../../components/layouts/BoxChat";
import GameEntrance from './GameEntrance';

// Service
import authHeader from "../../../services/auth-header";
import AuthService from "../../../services/auth.service";
import constant from "../../../Utils/index";

import { store } from "../../../context/socket-context";
import socketIOClient from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    maxWidth: "1400px",
  },
  left: {
    '& > .row': {
      marginTop: '20px'
    }
  },
  right: {
    '& > .row': {
      marginTop: '20px'
    }
  },
  toolbar: {

  },
  button: {
    fontFamily: "'Exo2.0'",
    spacing: theme.spacing(3),
    marginRight: theme.spacing(2)
  },
  // Left
  globalBtn: {
    backgroundColor: '#016310'
  },
  friendBtn: {
    color: '#016310',
    border: '1.5px solid #016310'
  },
  box: {
    width: '90%',
    height: '300px',
    backgroundColor: '#F6F6F6',
    border: '2px solid #016310',
    paddingLeft: '5px',
    paddingRight: '5px',
    borderRadius: '5px'
  },
  onlineUserWrapper: {
    overflow: 'auto',
    height: '85%'
  },
  online: {
    color: 'green'
  },
  bold: {
    fontWeight: '600'
  },
  moreWrapper: {
    marginTop: '5px'
  },
  more: {
    textAlign: 'center',
    color: '#016310',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  // Right
  playNowBtn: {
    backgroundColor: '#EA4335'
  },
  rankingBtn: {
    backgroundColor: '#FBBC05'
  },
  newRoomBtn: {
    backgroundColor: '#255FDB'
  },
  JoinRoomBtn: {
    backgroundColor: '#A336B4'
  },
  waiting: {
    color: '#016310'
  },
  paginationWrapper: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
  pagination: {
    '& ul': {
      justifyContent: 'center'
    }
  }
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
    const socket = socketIOClient(constant.SERVER);
    if (state === "") dispatch({ type: "connect", payload: socket });
    socket.emit("user", { socketID: state.id, username: user.username });
    socket.on("list-user", (data) => {
      setListUser(data);
    });
  }, []);

  const onlineUsers = [
    {user: 'Son Tung MPT'},
    {user: 'BTS'},
    {user: 'Kimetsu no yaiba'},
    {user: 'Son Tung MPT'},
    {user: 'BTS'},
    {user: 'Kimetsu no yaiba'},
    {user: 'Son Tung MPT'},
    {user: 'BTS'},
    {user: 'Kimetsu no yaiba'},
    {user: 'Son Tung MPT'},
    {user: 'BTS'},
    {user: 'Kimetsu no yaiba'},
  ];
  const chat = [
    {user: 'User 1', content: 'Wow'},
    {user: 'User 2', content: 'Wow'},
    {user: 'User 3', content: 'Wow'},
    {user: 'User 4', content: 'Wow'},
    {user: 'User 5', content: 'Wow'},
    {user: 'User 3', content: 'Wow'},
    {user: 'User 4', content: 'Wow'},
    {user: 'User 5', content: 'Wow'},
    {user: 'User 5', content: 'Wow'},
    {user: 'User 3', content: 'Wow'},
    {user: 'User 4', content: 'Wow'},
    {user: 'User 5', content: 'Wow'},
  ];

  const games = [
    {title: 'a1n341240215o125', roomName: "Let's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with meLet's play with meLet's play with meLet's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with meLet's play with meLet's play with meplay with meLet's play with meplay with meLet's play with meplay with meLet's play with meplay with meLet's play with meplay with meLet's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with meLet's play with meLet's play with meLet's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with me", username: "User 1"},
    {title: 'a1n341240215o125', roomName: "Let's play with me", username: "User 1"},
  ];
  return (
    <main>
      <Container className={classes.container} maxWidth="md">
        <Grid container spacing={3}>
          {/* Left */}
          <Grid item md={3} className={classes.left} spacing={5}>
            <div className={classes.toolbar}>
              <Button
                variant="contained"
                color="primary"
                className={`${classes.button} ${classes.globalBtn}`}
                startIcon={<PublicIcon />}
              >
                Global
              </Button>
              <Button
                variant="outlined"
                color="primary"
                className={`${classes.button} ${classes.friendBtn}`}
                startIcon={<PeopleIcon />}
              >
                Friends
              </Button>
            </div>
            <div className="row">
              <Box className={classes.box}>
                  <div className={classes.onlineUserWrapper}>
                    <List dense={true}>
                        {onlineUsers.map((user, index) => {
                          return (
                            <ListItem>
                                <ListItemIcon>
                                  <AccountCircleIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={user.user} 
                                  className={classes.bold} 
                                  disableTypography={true}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton edge="end" aria-label="delete">
                                    <FiberManualRecordIcon fontSize="small" className={classes.online}/>
                                  </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                          )
                        })}
                    </List>
                  </div>
                  <div className={classes.moreWrapper}>
                    <Typography variant="h6" component="h6" className={classes.more}>More</Typography>
                  </div>
              </Box>
            </div>
            <div className="row">
              <BoxChat title="GLOBAL" data={chat}></BoxChat>
            </div>
          </Grid>
          {/* Right */}
          <Grid item md={9} className={classes.right}>
            <div className={classes.toolbar}>
                <Button
                  variant="contained"
                  color="primary"
                  className={`${classes.button} ${classes.playNowBtn}`}
                  startIcon={<SportsEsportsIcon />}
                >
                  Play now
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={`${classes.button} ${classes.rankingBtn}`}
                  startIcon={<EqualizerIcon />}
                >
                  Ranking
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={`${classes.button} ${classes.newRoomBtn}`}
                  startIcon={<AddBoxIcon />}
                >
                  New Room
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={`${classes.button} ${classes.JoinRoomBtn}`}
                  startIcon={<ExitToAppIcon />}
                >
                  Join Room
                </Button>
                <Typography variant="h6" component="body1" className={classes.waiting}>Waiting: <b>00:00</b></Typography>
            </div>
            <Grid container className="row" spacing={3}>
              {games.map((game, index) => {
                return (
                  <Grid item md={4} key={index}>
                    <GameEntrance data={game}/>
                  </Grid>
                )
              })}
            </Grid>
            <div className={classes.paginationWrapper}>
              <Pagination count={10} className={classes.pagination} showFirstButton showLastButton />
            </div>
          </Grid>
        </Grid>
        {/*<ul>
          {listUser.length > 0 &&
            listUser.map((value, index) => {
              return <li>{value.username}</li>;
            })}
          </ul>*/}
      </Container>
    </main>
  );
};

export default DashBoard;
