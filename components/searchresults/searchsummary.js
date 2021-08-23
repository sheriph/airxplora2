import {
  Avatar,
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { useState } from "react";
import StyleDate from "./styledate";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import BookingForm from "../bookingform/bookingForm";
import { Collapse } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Paper } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  avatarRoot: {
    backgroundColor: theme.palette.secondary.main,
    width: "70px",
    height: "70px",
  },
  box: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
}));

export default function SearchSummary() {
  const classes = styles();
  const [showBookingForm, setBookingForm] = useState(false);
  const mobile = useMediaQuery("(max-width:400px)");

  return (
    <Box className={classes.box}>
      <Grid
        container
        alignContent="center"
        alignItems="center"
        justifyContent="space-around"
      >
        <Grid item container={mobile ? true : false}>
          <StyleDate />
        </Grid>
        {mobile ? (
          <Grid
            onClick={() => setBookingForm(!showBookingForm)}
            item
            xs={12}
            component={Paper}
            square
          >
            <Box display="flex" alignContent="center" justifyContent="center">
              <KeyboardArrowDownIcon
                style={{ transform: showBookingForm ? "rotate(180deg)" : "" }}
              />
            </Box>
          </Grid>
        ) : (
          <Grid
            item
            // xs={mobile ? 12 : false}
          //  justifyContent="center"
            container={mobile ? true : false}
            onClick={() => setBookingForm(!showBookingForm)}
          >
            <Avatar classes={{ root: classes.avatarRoot }}>
              {showBookingForm ? <span>Close</span> : <span>Edit</span>}
            </Avatar>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Collapse in={showBookingForm} timeout={500}>
          <BookingForm square={true} />
        </Collapse>
      </Grid>
    </Box>
  );
}
