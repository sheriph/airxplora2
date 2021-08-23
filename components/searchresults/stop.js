import { Box, makeStyles } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  box: {
    height: "10px",
    width: "10px",
    borderRadius: "50%",
    display: "inline-block",
    border: "1px solid",
    marginLeft: "5px",
    marginRight: "5px",
  },
}));

export default function Stop() {
  const classes = styles();
  return <Box className={classes.box}></Box>;
}
