import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { useEffect, useState } from "react";
import DayjsUtils from "@date-io/dayjs";
import dayjs from "dayjs";
import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import RemoveOutlinedIcon from "@material-ui/icons/RemoveOutlined";
import { min } from "lodash";
import { FormControl } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const styles = makeStyles((theme) => ({
  input: { width: "120px" },
  formHelperTextPropsRoot: { position: "absolute", top: "50px" },
  toolBarComponent: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  label: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "start",
  },
  buttonRoot: {},
}));

export default function DateSelector({
  onChange,
  disablePast = false,
  value,
  isError = false,
  disableFuture = false,
  maxDate,
  minDate = "1900-01-01",
  title,
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const classes = styles();
  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Grid
      container
      justifyContent="space-between"
      spacing={2}
      alignItems="center"
      alignContent="center"
    >
      <Grid
        item
        xs={12}
        style={{ marginRight: theme.spacing(1), marginLeft: theme.spacing(1) }}
        component={Paper}
        variant="outlined"
      >
        <Typography>
          <Typography>{title}</Typography>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          classes={{ label: classes.label }}
          className={classes.buttonRoot}
          style={{ borderColor: isError ? theme.palette.error.main : "" }}
          fullWidth
          variant="outlined"
          disableFocusRipple
          disableTouchRipple
          disableRipple
          startIcon={<CalendarTodayIcon color="primary" />}
          onClick={() => setOpen(true)}
        >
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <DatePicker
              minDate={minDate}
              maxDate={maxDate}
              openTo="year"
              minDateMessage="Invalid date"
              orientation="portrait"
              // disableToolbar
              animateYearScrolling
              disablePast={disablePast}
              disableFuture={disableFuture}
              autoOk={mobile ? false : true}
              variant={mobile ? "dialog" : "inline"}
              onClose={(e) => setTimeout(() => setOpen(false), 500)}
              open={open}
              InputProps={{
                classes: {
                  input: classes.input,
                  // root: classes.textFieldRoot,
                },
                disableUnderline: true,
              }}
              format="DD MMM YYYY"
              value={value}
              // @ts-ignore
              onChange={(date) => onChange(date)}
            />
          </MuiPickersUtilsProvider>
        </Button>
      </Grid>
    </Grid>
  );
}
