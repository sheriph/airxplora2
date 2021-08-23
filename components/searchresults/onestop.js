import { Box, useMediaQuery } from "@material-ui/core";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { lowerCase, startCase, truncate } from "lodash";
import React from "react";
import Stop from "./stop";
import TripLine from "./tripline";

const styles = makeStyles((theme) => ({
  text: { position: "relative", bottom: "7px" },
}));

export default function OneStop({
  departureTime,
  arrivalTime,
  arrivalAirport,
  departureAirport,
  stopOver,
  duration,
  cabin,
}) {
  const classes = styles();
  const mobile = useMediaQuery("(max-width:600px)");
  return (
    <Box>
      <Grid container alignContent="center" alignItems="center">
        <Grid item>
          <Box pr={1}>
            <Typography>{departureTime}</Typography>
          </Box>
        </Grid>
        <Grid xs item>
          <TripLine />
        </Grid>
        <Grid item>
          <Stop />
        </Grid>
        <Grid xs item>
          <TripLine />
        </Grid>
        <Box pl={1}>
          <Typography>{arrivalTime}</Typography>
        </Box>
      </Grid>
      <Grid container justifyContent="space-between" className={classes.text}>
        <Grid item>
          <Box pr={1}>
            <Typography>{departureAirport}</Typography>
          </Box>
        </Grid>
        <Grid item xs>
          <Box display="flex" justifyContent="center">
            <Typography variant="caption">
              {truncate(startCase(lowerCase(cabin)), {
                length: mobile ? 3 : 9,
                omission: "",
              })}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="caption">{duration}</Typography>
        </Grid>
        <Grid item xs>
          <Grid container justifyContent="center">
            <Typography variant="caption">{stopOver}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography>{arrivalAirport}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
