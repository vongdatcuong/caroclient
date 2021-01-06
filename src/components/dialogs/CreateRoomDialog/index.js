import React, { useRef, useState } from "react";
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
import {
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

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

export default function CreateFormDialog({ value, onCreate, onClose }) {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const timeValue = [180000, 300000, 600000];
  const timeStr = ["3 Minutes", "5 Minutes", "10 Minutes"];
  const [timeOption, setTimeOption] = useState(timeValue[0]);
  const [checkPassword, setCheckPassword] = useState(false);
  const classes = useStyles();

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };

  const handleOnChangeTimeOption = (event) => {
    setTimeOption(event.target.value);
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
        <DialogTitle id="form-dialog-title" style={{ textAlign: 'center' }}>
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
            value={title}
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
        <DialogContent>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              {config.string.MT_OPTION}
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={timeOption}
              onChange={handleOnChangeTimeOption}
              autoFocus={false}
              label={config.string.MT_OPTION}
              className={classes.roomOption}
            >
              <MenuItem value={timeValue[0]}>{timeStr[0]}</MenuItem>
              <MenuItem value={timeValue[1]}>{timeStr[1]}</MenuItem>
              <MenuItem value={timeValue[2]}>{timeStr[2]}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {config.string.MT_CANCEL}
          </Button>
          <Button
            onClick={() => onCreate(title, password, timeOption)}
            color="primary"
          >
            {config.string.MT_CREATE}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
