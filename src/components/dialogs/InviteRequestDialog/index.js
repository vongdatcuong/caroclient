import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { config } from "../../../config";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1.5em",
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    minWidth: "350px",
    textAlign: "center",
  },
  action: {
    justifyContent: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
  contentText: {
    textAlign: "left",
    wordWrap: "break-word",
  },
}));

function InviteRequestDialog({ value, onAccept, onClose, room }) {
  const classes = useStyles();
  console.log(room.creator);
  return (
    <div>
      <Dialog
        open={value}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          className={classes.title}
          component="h1"
          id="form-dialog-title"
        >
          {config.string.MT_INVITE}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText className={classes.contentText}>
            {`${config.string.MT_CREATOR} ` +
              room.creator.username +
              " invite you to Room."}
          </DialogContentText>
          <DialogContentText className={classes.contentText}>
            {`${config.string.PH_ROOM_ID}: ` + room.id}
          </DialogContentText>
          <DialogContentText className={classes.contentText}>
            {`${config.string.PH_TITLE}: ` + room.title}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.action}>
          <Button
            onClick={onAccept}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            {config.string.MT_OK}
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="secondary"
            className={classes.button}
          >
            {config.string.MT_CANCEL}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteRequestDialog;
