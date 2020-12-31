import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { config } from "../../../config";

export default function CreateFormDialog({ value, onCreate, onClose }) {
  const [title, setTitle] = useState("");

  const handleOnChange = (e) => {
    setTitle(e.target.value);
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
          {config.string.MT_CREATE_ROOM}
        </DialogTitle>
        <DialogContent>
          <TextField
            style={{ width: 300 }}
            autoFocus
            margin="dense"
            id="title"
            label={config.string.PH_TITLE}
            type="text"
            fullWidth
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {config.string.MT_CANCEL}
          </Button>
          <Button onClick={() => onCreate(title)} color="primary">
            {config.string.MT_CREATE}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
