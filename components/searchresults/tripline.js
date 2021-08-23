import { Divider, makeStyles } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  line: { border: "1px solid" },
}));

export default function TripLine() {
  const classes = styles();
  return <hr className={classes.line} />;
}
