import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

export default function MyDrawer({
  children,
  open,
  handleClose,
  elevation = 16,
  anchor = "right",
  keepMounted = false,
  width = "",
}) {
  const styles = makeStyles((theme) => ({
    drawer: {
      maxWidth: "600px",
      width: width,
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
  const classes = styles();
  return (
    <Drawer
      // @ts-ignore
      anchor={anchor}
      keepMounted={keepMounted}
      elevation={elevation}
      onClose={handleClose}
      // @ts-ignore
      open={open}
      classes={{ paperAnchorRight: classes.drawer }}
    >
      {children}
    </Drawer>
  );
}
