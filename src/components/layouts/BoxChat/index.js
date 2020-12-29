import React from "react";

// Material UI Core
import Typography from "@material-ui/core/Typography";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";

// Material UI Icon
import SendIcon from "@material-ui/icons/Send";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";

// Services
import Utils from "../../../Utils";

const useStyles = makeStyles((theme) => ({
  box: {
    position: "relative",
    width: "90%",
    height: "325px",
    backgroundColor: "#F6F6F6",
    border: "2px solid #016310",
    paddingLeft: "5px",
    paddingRight: "5px",
    borderRadius: "5px",
    margin: '0 auto'
  },
  title: {
    color: "#016310",
    fontWeight: "600",
    padding: "5px",
    textAlign: "center",
    height: "10%",
    marginBottom: "7px",
  },
  chatContents: {
    overflow: "auto",
    height: "75%",
  },
  lineChat: {
    paddingTop: "2px",
    paddingBottom: "2px",
    display: "block"
  },
  username: {
    marginRight: "5px",
    fontWeight: "600",
    display: "inline-block",
    "& span": {
      display: "inline-block"
    }
  },
  lineTime: {
    textAlign: 'left',
    marginRight: "5px",
    display: "inline-block",
    "& span": {
      fontSize: '0.9em',
      marginRight: "0px",
      display: "inline-block",
    }
  },
  content: {
    display: "inline-block",
    "& span": {
      display: "inline-block"
    }
  },
  inputChat: {
    position: "absolute",
    bottom: "10px",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "95%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  sendBtn: {
    color: "#016310",
  },
  emojiIcon: {
    color: "#FBBC05",
  },
}));

const BoxChat = ({ data, title, value, onType, onSubmit, isDisabled=false }) => {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      <Typography
        textAlign="center"
        variant="h6"
        component="h6"
        className={classes.title}
      >
        {title}
      </Typography>
      <div className={classes.chatContents}>
        <List component="nav" aria-label="main mailbox folders">
          {data.map((line, index) => {
            const time = "[" + Utils.milliSecondToMinSecFormat(line.time) + "]";
            return (
              <ListItem key={index} className={classes.lineChat}>
                {(line.time)? (<ListItemText className={classes.lineTime} primary={time}/>) : ""}
                <Typography textAlign="center" className={classes.username}>
                  {line.username}:{" "}
                </Typography>
                <ListItemText className={classes.content} primary={line.content + 'sad'} />
              </ListItem>
            );
          })}
        </List>
      </div>

      {(!isDisabled)?
        <Paper className={classes.inputChat}>
          <form onSubmit={onSubmit}>
            <InputBase
              value={value}
              onChange={onType}
              className={classes.input}
              placeholder="Send your Message"
              inputProps={{ "aria-label": "send message" }}
            />
          </form>
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="send"
            onClick={onSubmit}
          >
            <SendIcon className={classes.sendBtn} />
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" flexItem />
          <IconButton
            color="primary"
            className={classes.iconButton}
            aria-label="emoji"
          >
            <EmojiEmotionsIcon className={classes.emojiIcon} />
          </IconButton>
        </Paper>
        :
        ""
      }
    </Box>
  );
};

export default BoxChat;
