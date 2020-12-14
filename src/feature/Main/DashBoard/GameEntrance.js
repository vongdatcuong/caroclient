import React from 'react';
import './DashBoard.css';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import GameAvatar from '../../../vendors/images/game-avatar.png';

// Material UI Icon
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import StarsIcon from '@material-ui/icons/Stars';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMediaWrapper: {
      padding: '10px'
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  iconHeader: {
    marginRight: '5px',
    verticalAlign: 'text-bottom'
  },
  icon: {
      marginRight: '5px',
      verticalAlign: 'bottom'
  },
  roomName: {
      height: '50px',
      marginBottom: '5px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
  },
  username: {
      color: '#666666'
  }
}));

const GameEntrance = (props) => {
  const classes = useStyles();
  const data = props.data;
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
            <Typography gutterBottom variant="h6" component="h6">
                <VpnKeyIcon className={classes.iconHeader}/>
                <b>{data.title}</b>
            </Typography>
            <Typography className={classes.roomName}>
                <VideogameAssetIcon className={classes.icon}/>
                <b>{data.roomName}</b>
            </Typography>
            <Typography className={classes.username}>
                <StarsIcon className={classes.icon}/>
                {data.username}
            </Typography>
        </CardContent>
        {/*<CardActions>
            <Button size="small" color="primary">
                View
            </Button>
            <Button size="small" color="primary">
                Edit
            </Button>
        </CardActions>*/}
    </Card>
  );
}

export default GameEntrance