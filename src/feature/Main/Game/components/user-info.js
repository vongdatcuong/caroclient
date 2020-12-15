import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import React from "react";
import "../index.css";
const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    height: 437,
    flex: 1,
    justifyContent: "center",
  },
  media: {},
  timeButton: {
    flex: 1,
    background: "green",
    color: "white",
    width: 139,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  avatar: {
    borderRadius: "50%",
    height: 130,
    width: 130,
  },
}));

export default function UserInfo(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      {props.user !== null ? (
        <div>
          <CardContent className={classes.media}>
            <CardMedia
              className={classes.avatar}
              component="img"
              alt="Contemplative Reptile"
              image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
              title={props.user.username}
            />
          </CardContent>
          <CardContent style={{ justifyContent: "center" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ textAlign: "center" }}
            >
              {props.user.username}
            </Typography>
            <Typography variant="body" color="textSecondary" component="p">
              <Typography style={{ fontSize: 18 }}>
                Rank: {props.user.rank}
              </Typography>
              <Typography style={{ fontSize: 18 }}>
                Point: {props.user.point}
              </Typography>
              <Typography style={{ fontSize: 18 }}>
                Win: {props.user.win}
              </Typography>
              <Typography style={{ fontSize: 18 }}>
                Lose: {props.user.lose}
              </Typography>
            </Typography>
          </CardContent>
          <CardActions style={{ alignSelf: "flex-end" }}>
            <Button
              className={classes.timeButton}
              endIcon={<QueryBuilderIcon />}
            >
              20:00
            </Button>
            <IconButton
              children={
                props.type === "X" ? (
                  <CloseIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )
              }
              color="primary"
            />
          </CardActions>
        </div>
      ) : null}
    </Card>
  );
}
