import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { config } from "../../../config";

const useStyles = makeStyles((theme) => ({
  roomOption: {
    height: "40px",
  },
  formControl: {
    marginTop: "10px",
    minWidth: 120,
    height: "50px",
  },
}));

function index({ open, onClose }) {
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle>{config.string.MT_GAME_RULE}</DialogTitle>
      <DialogContent>
        <DialogContentText>{config.string.D_GAME_RULE}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary">
          {config.string.MT_OK}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default index;
