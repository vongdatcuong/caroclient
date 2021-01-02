import React, {useState, useEffect, useContext} from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { fade } from "@material-ui/core/styles/colorManipulator";
import {Reconnect, ReconnectRes} from "../../../services/socket/base-socket";
import {store} from "../../../context/socket-context";
import {loadingStore} from "../../../context/loading-context";

// Service
import AuthService from "../../../services/auth.service";
import { config } from "../../../config";

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: fade("#000000", 0.6),
    position: 'fixed',
    zIndex: '10000'
  },
  root: {
    maxWidth: 345,
    margin: '15% auto',
  },
  media: {
    height: 140,
  },
  title: {
    textAlign: 'center',
    color: '#e60000'
  },
  gameID: {
    fontSize: '16px'
  },
  iconHeader: {
    marginRight: "5px",
    verticalAlign: "text-bottom",
  },
  icon: {
    marginRight: "5px",
    verticalAlign: "bottom",
  },
  roomName: {
    maxHeight: "50px",
    marginBottom: "5px",
    overflow: 'hidden',
    textOverflow: 'ellipse',
    fontSize: '18px'
  },
  reconnectBtn: {
    margin: '10px auto'
  }
}));

const ReconnectC = (props) => {
    const classes = useStyles();
    const historyPages = useHistory();
    const user = AuthService.getCurrentUser();
    const { state, dispatch } = useContext(store);
    const { loadingState, dispatchLoading } = useContext(loadingStore);
    const [socket, setSocket] = useState(state.socket);
    const [room, setRoom] = useState({});

    useEffect(() => {
        ReconnectRes(socket, setRoom);
    })
  
    const handleAction = async () => {
        historyPages.push({ pathname: "/game", state: { roomID: room.roomID, turn: room.type } });
      Reconnect(socket, room.roomID, user);
    };
  
    return (
      <div className={classes.container} style={{display: room.roomID ? 'block' : 'none' }}>
        <Card className={classes.root}>
            <CardActionArea>
            <CardContent>
                <Typography className={classes.title} gutterBottom variant="h5" component="h2">
                On-going Game
                </Typography>
                <Typography className={classes.roomName}>
                    <Typography variant="body"><b>Room Name: </b></Typography>
                    {room.title}
                </Typography>
                <Typography className={classes.roomName}>
                    <Typography variant="body"><b>ID: </b></Typography>
                    {room.roomID}
                </Typography>
                <Typography className={classes.roomName}>
                    <Typography variant="body"><b>Creator: </b></Typography>
                    {room.creator}
                </Typography>
            </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.reconnectBtn}
                    onClick={handleAction}
                >
                    {config.string.MT_RECONNECT}
                </Button>
            </CardActions>
        </Card>
      </div>
    )
  }

export default ReconnectC;