import React from "react";
import "./DashBoard.css";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import GameAvatar from "../../../vendors/images/game-avatar.png";

// Material UI Icon
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import StarsIcon from "@material-ui/icons/Stars";
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMediaWrapper: {
    padding: "10px",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  gameID: {
    fontSize: "16px",
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
    height: "50px",
    marginBottom: "5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "20px",
    position: 'relative'
  },
  username: {
    color: "#666666",
  },
  lockIcon: {
    color: "#d4af37",
    verticalAlign: 'middle',
    position: 'absolute',
    right: '0'
  }
}));

const GameEntrance = ({ onClick, data, onClickWatch }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <div className={classes.cardMediaWrapper}>
        <CardMedia
          className={classes.cardMedia}
          image={GameAvatar}
          title="Image title"
        />
      </div>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.roomName}>
          <VideogameAssetIcon className={classes.icon} />
          <b>{data.title}</b> {(data.password)? <LockIcon className={classes.lockIcon}/> : ""}
        </Typography>
        <Typography gutterBottom className={classes.gameID} component="h6">
          <VpnKeyIcon className={classes.iconHeader} />
          <b>{data.roomID}</b>
        </Typography>
        <Typography className={classes.username}>
          <StarsIcon className={classes.icon} />
          {data.creator.username}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          style={{ width: 100, marginLeft: 'auto' }}
          variant="contained"
          size="small"
          color="primary"
          disabled={((onClick)? false : true)}
          onClick={() => onClick(data.roomID, data.time, data.password)}
        >
          Play
        </Button>
        <Button
          style={{ width: 100, marginRight: 'auto' }}
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => onClickWatch(data.roomID, data.time, data.password)}
        >
          Watch
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameEntrance;
