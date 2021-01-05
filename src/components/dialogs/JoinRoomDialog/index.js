import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { config } from "../../../config";
import { IconButton } from "@material-ui/core";

export default function JoinRoomDialog({
  value,
  onJoin,
  onClose,
  initialRoomID,
}) {
  const [roomID, setRoomID] = useState(`${initialRoomID}`);
  const [checkPassword, setCheckPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleOnChange = (e) => {
    setRoomID(e.target.value);
  };

  const handleOnCheckPassword = (event) => {
    setPassword("");
    setCheckPassword(!checkPassword);
  };

  const handleOnChangePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Dialog
        maxWidth="lg"
        open={value}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {config.string.MT_JOIN_ROOM}
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ width: 300 }}
            autoFocus
            margin="dense"
            id={config.string.PH_ROOM_ID}
            label={config.string.PH_ROOM_ID}
            type="text"
            fullWidth
            onChange={handleOnChange}
            value={roomID}
            defaultValue={initialRoomID}
          />
        </DialogContent>
        <DialogContent style={{ display: "flex", alignItems: "center" }}>
          <TextField
            style={{ width: 300 }}
            margin="dense"
            id="password"
            label={config.string.PH_PASSWORD}
            type="password"
            fullWidth
            disabled={checkPassword}
            onChange={handleOnChangePassword}
            value={password}
          />
          <IconButton onClick={handleOnCheckPassword}>
            {checkPassword ? <LockIcon /> : <LockOpenIcon />}
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {config.string.MT_CANCEL}
          </Button>
          <Button onClick={() => onJoin(roomID, password)} color="primary">
            {config.string.MT_JOIN}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
