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
import Utils from "../../../Utils";
import { config } from "../../../config";

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: fade("#000000", 0.6),
    position: 'fixed',
    zIndex: '10000',
    textAlign: 'center',
    marginLeft: '-23px'
  },
  root: {
    maxWidth: 500,
    margin: '15% auto',
  },
  media: {
    height: 140,
  },
  title: {
    textAlign: 'center',
    color: '#e60000'
  },
  reconnectBtn: {
    margin: '10px auto'
  }
}));

const PlayerDisconnect = ({display, time}) => {
    const classes = useStyles();
    const user = AuthService.getCurrentUser();
    const { state, dispatch } = useContext(store);
    const { loadingState, dispatchLoading } = useContext(loadingStore);
    const [socket, setSocket] = useState(state.socket);
  
    return (
      <div className={classes.container} style={{display: display ? 'block' : 'none' }}>
        <Card className={classes.root}>
            <CardActionArea>
            <CardContent>
                <Typography className={classes.title} gutterBottom variant="h5" component="h2">
                The other player has been DISCONNECTED
                </Typography>
                <Typography>{Utils.milliSecondToMinSecFormat(time)}</Typography>
                <Typography gutterBottom variant="h6" component="h2">
                Until you win
                </Typography>
            </CardContent>
            </CardActionArea>
        </Card>
      </div>
    )
  }

export default PlayerDisconnect;