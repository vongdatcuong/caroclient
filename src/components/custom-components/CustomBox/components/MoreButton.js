import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { config } from "../../../../config";

const useStyles = makeStyles((theme) => ({
  moreWrapper: {
    marginTop: "5px",
  },
  more: {
    textAlign: "center",
    color: "#016310",
    fontWeight: "600",
    textDecoration: "underline",
  },
}));

function MoreButton(props) {
  const classes = useStyles();
  return (
    <div className={classes.moreWrapper}>
      <Typography variant="h6" component="h6" className={classes.more}>
        {config.string.MT_MORE}
      </Typography>
    </div>
  );
}

export default MoreButton;
