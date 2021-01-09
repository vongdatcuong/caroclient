import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { httpGet } from "../../../services/api/base-api";
import { formatDate, formatTime } from "../../../Utils/datetimeHelper";
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import HistoryIcon from "@material-ui/icons/History";
import { config } from "../../../config";

const useStyles = makeStyles((theme) => ({
  list_container: {
    overflow: "auto",
    height: "50%",
  },
  itemIcon: {
    cursor: "pointer",
  },
}));

function ListHistory({ data, user, onClick }) {
  const classes = useStyles();
  return (
    <div className={classes.list_container}>
      <h2>{config.string.MT_HISTORY_LIST}</h2>
      <List dense={true}>
        {data.map((game, index) => {
          return (
            <CustomListItem
              key={index}
              value={game}
              userID={user}
              onClick={onClick}
            />
          );
        })}
      </List>
    </div>
  );
}

function CustomListItem({ key, value, userID, onClick }) {
  const classes = useStyles();
  const [winner, setWinner] = useState("");
  const [isWin, setIsWin] = useState("");

  useEffect(() => {
    let temp =
      value.player1ID === userID
        ? "X"
        : value.player2ID === userID
        ? "O"
        : null;
    httpGet({
      url: `/user/${value.winner === "X" ? value.player1ID : value.player2ID}`,
    }).then((value) => {
      setWinner(value.data.username);
    });
    if (temp === value.winner) {
      setIsWin("WIN");
    } else {
      setIsWin("LOSE");
    }
  }, []);
  return (
    <ListItem key={key}>
      <ListItemIcon
        className={classes.itemIcon}
        onClick={(evt) => onClick(value._id)}
      >
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          "Winner: " +
          winner +
          " - Time: " +
          formatTime(value.totalTime / 1000) +
          "s" +
          " - Result: " +
          isWin +
          "\n " +
          "Date: " +
          formatDate(value.created_at)
        }
        disableTypography={true}
      />
    </ListItem>
  );
}

export default ListHistory;
