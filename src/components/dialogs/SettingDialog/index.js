import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Settings from "../../../feature/Main/Game/components/settings";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  timeButton: {
    flex: 1,
    width: 290,
    background: "red",
    color: "white",
    alignItems: "flex-end",
  },
}));

export default function SettingRoomDialog({ value, onLeave, onClose }) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        maxWidth="lg"
        open={value}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <div style={{ height: 300 }}>
          <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
            Setting
          </DialogTitle>
          <DialogContent>
            <Button onClick={onLeave} className={classes.timeButton}>
              Leave Room
            </Button>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
