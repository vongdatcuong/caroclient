import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { store } from "../../../../context/socket-context";

// Material UI Icon
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { Card, Grid, Paper, Tab, Tabs } from "@material-ui/core";

import {
  GetGlobalUsers,
  JoinGlobalRoom,
} from "../../../../services/socket/base-socket";
import authService from "../../../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  box: {
    width: 300,
    height: "250px",

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
  online: {
    color: "green",
  },
  bold: {
    fontWeight: "600",
  },
  more: {
    textAlign: "center",
    color: "#016310",
    fontWeight: "600",
    textDecoration: "underline",
  },
  button: {
    width: 140,
    marginBottom: 10,
  },
  tab: {
    minWidth: 142, // a number of your choice
    width: 142, // a number of your choice
  },
}));

function ListUser({ roomData, onInvite }) {
  const classes = useStyles();
  const { state, dispatch } = useContext(store);
  const [socket, setSocket] = useState(state.socket);
  const [value, setValue] = React.useState(0);
  const user = authService.getCurrentUser();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!state.isCheck && user) {
      GetGlobalUsers(socket, dispatch);
      dispatch({ type: "Check-listener" });
    }
  }, []);

  return (
    <div style={{ width: 300 }}>
      <Card className={classes.box}>
        <div className={classes.onlineUserWrapper}>
          <Paper square>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              aria-label="disabled tabs example"
              onChange={handleChange}
            >
              <Tab className={classes.tab} label="Global" />
              <Tab className={classes.tab} label="Room" />
            </Tabs>
          </Paper>
          {value === 0 ? (
            <List dense={true}>
              {state.globalUsers.map((user, index) => {
                return (
                  <ListItem>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="large" />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.username}
                      className={classes.bold}
                      disableTypography={true}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onInvite(user.id)}
                      >
                        <FiberManualRecordIcon
                          fontSize="small"
                          className={classes.online}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <List dense={true}>
              {roomData.map((value, index) => {
                return (
                  <ListItem>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="large" />
                    </ListItemIcon>

                    <ListItemText
                      primary={value.user.username}
                      secondary={` (${value.role})`}
                      className={classes.bold}
                      disableTypography={true}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </div>
        <div className={classes.moreWrapper}>
          <Typography variant="h6" component="h6" className={classes.more}>
            More
          </Typography>
        </div>
      </Card>
    </div>
  );
}

export default ListUser;
