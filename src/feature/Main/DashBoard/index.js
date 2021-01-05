import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useHistory, useLocation } from "react-router-dom";

// Material UI Core
import Typography from "@material-ui/core/Typography";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Pagination from "@material-ui/lab/Pagination";

// Material UI Icon
import PublicIcon from "@material-ui/icons/Public";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// Components

import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import GameEntrance from "./GameEntrance";
import CreateFormDialog from "../../../components/dialogs/CreateRoomDialog";

// Service
import AuthService from "../../../services/auth.service";
import { store } from "../../../context/socket-context";
import { loadingStore } from "../../../context/loading-context";

import {
  GetGlobalUsers,
  JoinGlobalRoom,
  GetChatGlobalRoom,
  ChatGlobalRoom,
  CreatePlayingRoom,
  GetListRoom,
  JoinRoom,
  GetInviteRequest,
  LoadingRes,
  QuickPlay,
  SearchedRoom,
  NotifyQuickPlay,
  JoinRoomCallBack,
  CancelQuickPlayRoom,
} from "../../../services/socket/base-socket";
import JoinRoomDialog from "../../../components/dialogs/JoinRoomDialog";
import InviteRequestDialog from "../../../components/dialogs/InviteRequestDialog";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { formatTime } from "../../../Utils/datetimeHelper";
import CustomBox from "../../../components/custom-components/CustomBox";
import ChatBox from "../../../components/custom-components/CustomBox/components/ChatBox";
import ListGlobalChat from "../../../components/custom-components/CustomBox/components/ListGlobalChat";
import ListOnlineUser from "../../../components/custom-components/CustomBox/components/ListOnlineUser";
import MoreButton from "../../../components/custom-components/CustomBox/components/MoreButton";

import { config } from "../../../config/index";
import ListRanking from "../../../components/custom-components/CustomBox/components/ListRanking";

import { httpGet } from "../../../services/api/base-api";
import { Cancel } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    maxWidth: "1400px",
  },
  title: {
    color: "#016310",
    fontWeight: "600",
    padding: "5px",
    textAlign: "center",
    height: "10%",
    marginBottom: "7px",
  },
  left: {
    "& > .row": {
      marginTop: "20px",
    },
  },
  right: {
    "& > .row": {
      marginTop: "20px",
    },
  },
  toolbar: {},
  button: {
    width: 150,
    fontFamily: "'Exo2.0'",
    spacing: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
  // Left
  globalBtn: {
    backgroundColor: "#016310",
  },
  friendBtn: {
    color: "#016310",
    border: "1.5px solid #016310",
  },
  box: {
    width: "90%",
    height: "250px",
    backgroundColor: "#F6F6F6",
    border: "2px solid #016310",
    paddingLeft: "5px",
    paddingRight: "5px",
    borderRadius: "5px",
    margin: "0 auto",
  },
  onlineUserWrapper: {
    overflow: "auto",
    height: "85%",

    textAlign: "center",
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // Right
  playNowBtn: {
    backgroundColor: "#EA4335",
  },
  rankingBtn: {
    backgroundColor: "#FBBC05",
  },
  newRoomBtn: {
    backgroundColor: "#255FDB",
  },
  JoinRoomBtn: {
    backgroundColor: "#A336B4",
  },
  waiting: {
    color: "#016310",
  },
  paginationWrapper: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
  pagination: {
    "& ul": {
      justifyContent: "center",
    },
  },
  roomOption: {
    height: "30px",
  },
}));

const DashBoard = (props) => {
  const history = useHistory();
  const { state, dispatch } = useContext(store);
  const { loadingState, dispatchLoading } = useContext(loadingStore);
  const [socket, setSocket] = useState(state.socket);
  const [chat, setChat] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [inviteRoom, setInviteRoom] = useState();
  const [roomOption, setRoomOption] = useState("Waiting");
  const isWaitingRoom = useRef(false);
  const [countTime, setCountTime] = useState(null);
  const countDownInterval = useRef(null);
  const [rankingList, setRankingList] = useState([]);
  const [roomChoosen, setRoomChoosen] = useState("");

  if (!AuthService.getCurrentUser()) {
    history.push(config.route.login);
  }
  const classes = useStyles();
  const user = AuthService.getCurrentUser();

  const handleOnChooseRoom = (roomID, time, password) => {
    if (password === "") {
      JoinRoom(socket, roomID, user, password);
    } else {
      setRoomChoosen(roomID);
      setOpenJoinDialog(true);
    }
  };

  const handleOnJoinRoom = (roomID, password) => {
    JoinRoom(socket, roomID, user, password);
    setOpenJoinDialog(false);
    handleOnCloseInviteDialog();
  };

  const joinRoomCallback = (value) => {
    if (value.success) {
      history.replace({
        pathname: config.route.game,
        state: { roomID: value.room.roomID, turn: 2, time: value.room.time },
      });
    } else {
      alert("Mật khẩu phòng không đúng");
    }
  };

  const handleOnChatChange = (e) => {
    setChat(e.target.value);
  };

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleClickOpenJoinDialog = () => {
    setRoomChoosen("");
    setOpenJoinDialog(true);
  };

  const handleCloseJoinDialog = () => {
    setOpenJoinDialog(false);
  };

  const handleOnCloseInviteDialog = () => {
    setOpenInviteDialog(false);
  };

  const handleOnCreateRoom = (title, password, time) => {
    handleCloseCreateDialog();
    CreatePlayingRoom(socket, {
      title: title,
      creator: user,
      password: password,
      time: time,
    });
    history.replace({
      pathname: config.route.game,
      state: {
        roomID: user._id,
        title: title,
        creator: user,
        turn: 1,
        time: time,
        password: password,
      },
    });
  };

  const handleOnChatSubmit = (e) => {
    e.preventDefault();
    ChatGlobalRoom(socket, { username: user.username, content: chat });
    setChat("");
  };

  const handleOnInvite = (room) => {
    setInviteRoom(room);
    setOpenInviteDialog(true);
  };

  const handleOnChangeRoomOption = (event) => {
    setRoomOption(event.target.value);
  };

  useEffect(() => {
    if (!state.isCheck && user) {
      JoinGlobalRoom(socket, {
        id: socket.id,
        _id: user ? user._id : 0,
        username: user.username,
      });

      GetGlobalUsers(socket, dispatch);
      GetChatGlobalRoom(socket, dispatch);
      GetListRoom(socket, dispatch);
      LoadingRes(socket, dispatchLoading);
      JoinRoomCallBack(socket, joinRoomCallback);
      dispatch({ type: "Check-listener" });
    }
    GetInviteRequest(socket, handleOnInvite);
    httpGet({ url: "/user/ranking" }).then((value) => {
      setRankingList(value.payload);
    });
  }, []);

  const callbackQuickPlay = (value) => {
    history.replace(config.route.game, value);
  };

  const handleOnQuickPlay = () => {
    isWaitingRoom.current = !isWaitingRoom.current;
    if (isWaitingRoom.current) {
      setCountTime(0);
      countUp(countTime, setCountTime);
      QuickPlay(socket, {
        title: "Quick-Play " + socket.id,
        creator: user,
      });
      SearchedRoom(socket, callbackQuickPlay);
      NotifyQuickPlay(socket, callbackQuickPlay);
    } else {
      setCountTime(null);
      clearCountDown();
      CancelQuickPlayRoom(socket, user);
    }
  };

  const countUp = (time, setTime) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        time += 1; // Millisecond
        setTime(time);
      }, 1000);
      countDownInterval.current = interval;
    });
  };
  const clearCountDown = () => {
    // Clear interval
    if (countDownInterval.current) {
      clearInterval(countDownInterval.current);
    }
  };

  return (
    <main>
      <Container className={classes.container} maxWidth="md">
        <Grid container spacing={3}>
          {/* Left */}
          <Grid item md={3} xs={5} className={classes.left} spacing={5}>
            <div className="row">
              <CustomBox
                title={config.string.MT_GLOBAL}
                data={state.globalUsers}
                ListComponent={ListOnlineUser}
                ActionComponent={MoreButton}
              />
            </div>
            <div className="row">
              <CustomBox
                title={config.string.MT_GLOBAL}
                ListComponent={ListGlobalChat}
                ActionComponent={ChatBox}
                data={state.globalChat}
                value={chat}
                onType={handleOnChatChange}
                onSubmit={handleOnChatSubmit}
              ></CustomBox>
            </div>
            <div className="row">
              <CustomBox
                title={config.string.MT_RANKING}
                ListComponent={ListRanking}
                ActionComponent={MoreButton}
                data={rankingList}
                value={chat}
              ></CustomBox>
            </div>
          </Grid>
          {/* Right */}
          <Grid item md={9} xs={7} className={classes.right}>
            <div className={classes.toolbar}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  {config.string.MT_OPTION}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={roomOption}
                  onChange={handleOnChangeRoomOption}
                  autoFocus={false}
                  label={config.string.MT_OPTION}
                  className={classes.roomOption}
                >
                  <MenuItem value={config.string.PH_WATING}>
                    {config.string.PH_WATING}
                  </MenuItem>
                  <MenuItem value={config.string.PH_PLAYING}>
                    {config.string.PH_PLAYING}
                  </MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                className={`${classes.button} ${classes.playNowBtn}`}
                startIcon={<SportsEsportsIcon />}
                onClick={handleOnQuickPlay}
              >
                {!isWaitingRoom.current
                  ? config.string.MT_PLAY_NOW
                  : config.string.MT_CANCEL}
              </Button>
              <Button
                onClick={handleClickOpenCreateDialog}
                variant="contained"
                color="primary"
                className={`${classes.button} ${classes.newRoomBtn}`}
                startIcon={<AddBoxIcon />}
              >
                {config.string.MT_NEW_ROOM}
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={`${classes.button} ${classes.JoinRoomBtn}`}
                startIcon={<ExitToAppIcon />}
                onClick={handleClickOpenJoinDialog}
              >
                {config.string.MT_JOIN_ROOM}
              </Button>
              <Typography
                variant="h6"
                component="body1"
                className={classes.waiting}
              >
                {config.string.PH_WATING}: <b>{formatTime(countTime)}</b>
              </Typography>
            </div>
            <Grid container className="row" spacing={3}>
              {roomOption === config.string.PH_WATING
                ? state.listRoom.map((game, index) => {
                    return (
                      game.status === config.string.PH_WATING && (
                        <Grid item md={4} key={index}>
                          <GameEntrance
                            data={game}
                            onClick={handleOnChooseRoom}
                          />
                        </Grid>
                      )
                    );
                  })
                : state.listRoom.map((game, index) => {
                    return (
                      game.num >= 2 && (
                        <Grid item md={4} key={index}>
                          <GameEntrance
                            data={game}
                            onClick={handleOnChooseRoom}
                          />
                        </Grid>
                      )
                    );
                  })}
            </Grid>
            <div className={classes.paginationWrapper}>
              <Pagination
                count={10}
                className={classes.pagination}
                showFirstButton
                showLastButton
              />
            </div>
          </Grid>
        </Grid>
      </Container>
      {openCreateDialog && (
        <CreateFormDialog
          value={openCreateDialog}
          onCreate={handleOnCreateRoom}
          onClose={handleCloseCreateDialog}
        />
      )}
      {openJoinDialog && (
        <JoinRoomDialog
          value={openJoinDialog}
          onClose={handleCloseJoinDialog}
          onJoin={handleOnJoinRoom}
          initialRoomID={roomChoosen}
        />
      )}
      {openInviteDialog ? (
        <InviteRequestDialog
          room={inviteRoom}
          value={openInviteDialog}
          onClose={handleOnCloseInviteDialog}
          onAccept={handleOnJoinRoom}
        />
      ) : (
        ""
      )}
    </main>
  );
};

export default DashBoard;
