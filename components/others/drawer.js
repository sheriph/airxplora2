import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

const styles = makeStyles((theme) => ({
  drawer: {
    maxWidth: "550px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingBottom: "10px",
    },
  },
}));

export default function MyDrawer({
  children,
  open,
  handleClose,
  elevation = 16,
  anchor = "right",
}) {
  const classes = styles();
  return (
    <Drawer
      // @ts-ignore
      anchor={anchor}
      elevation={elevation}
      onClose={handleClose}
      open={open}
      classes={{ paperAnchorRight: classes.drawer }}
    >
      {children}
    </Drawer>
  );
}
