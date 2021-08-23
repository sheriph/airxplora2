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

export function MyDate({ onChange, value, isError }) {
  // const [value, handleDateChange] = useState(dayjs());
  // const [value, handleDateChange2] = useState(dayjs());
  const [helperText, setHelperText] = useState("");
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const classes = styles();
  const mobile = useMediaQuery("(max-width:600px)");

  return (
    <Button
      classes={{ label: classes.label }}
      className={classes.buttonRoot}
      style={{ borderColor: isError ? theme.palette.error.main : "" }}
      fullWidth
      variant="outlined"
      disableFocusRipple
      disableTouchRipple
      disableRipple
      startIcon={<CalendarTodayIcon />}
      onClick={() => setOpen(true)}
    >
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <DatePicker
          orientation="portrait"
          disableToolbar
          animateYearScrolling
          disablePast
          autoOk={mobile ? false : true}
          variant={mobile ? "dialog" : "inline"}
          //TextFieldComponent={TextField}
          onClose={(e) => setTimeout(() => setOpen(false), 50)}
          open={open}
          InputProps={{
            classes: {
              input: classes.input,
              // root: classes.textFieldRoot,
            },
            disableUnderline: true,
          }}
          format="ddd, DD MMM"
          value={value}
          // @ts-ignore
          onChange={(date) => onChange(date)}
        />
      </MuiPickersUtilsProvider>
    </Button>
  );
}

export function RetDate({ onChange, value, depDate, isError }) {
  const theme = useTheme();
  useEffect(() => {
    console.log("effect running");
    if (value.diff(depDate) < 0) onChange(depDate);
  }, [depDate.toDate().toLocaleDateString()]);
  const [helperText, setHelperText] = useState("");
  const [open2, setOpen2] = useState(false);

  const classes = styles();
  const mobile = useMediaQuery("(max-width:600px)");

  const max = `${value.year() + 1}-${value.month()}-${value.date()}`;

  const getDayElement = (
    renderDay,
    activeDate,
    isInCurrentMonth,
    dayComponent
  ) => {
    const updatedComp = {
      ...dayComponent,
      props: {
        ...dayComponent.props,
        selected:
          (activeDate.unix() >= renderDay.unix() &&
            depDate.unix() <= renderDay.unix()) ||
          depDate.toDate().toLocaleDateString() ===
            renderDay.toDate().toLocaleDateString()
            ? true
            : false,
      },
    };

    return updatedComp;
  };

  return (
    <Button
      classes={{ label: classes.label }}
      fullWidth
      style={{ borderColor: isError ? theme.palette.error.main : "" }}
      variant="outlined"
      disableFocusRipple
      disableTouchRipple
      disableRipple
      startIcon={<CalendarTodayIcon />}
      onClick={() => setOpen2(true)}
    >
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <DatePicker
          open={open2}
          onClose={(e) => setTimeout(() => setOpen2(false), 500)}
          orientation="portrait"
          maxDate={dayjs(max)}
          renderDay={(renderDay, activeDate, isInCurrentMonth, dayComponent) =>
            getDayElement(renderDay, activeDate, isInCurrentMonth, dayComponent)
          }
          variant={mobile ? "dialog" : "inline"}
          animateYearScrolling
          ToolbarComponent={(data) => {
            const returnDate = data.date;
            const diff = returnDate.diff(depDate, "d");
            return (
              <Box className={classes.toolBarComponent}>
                <Container>
                  {diff ? <Typography variant="h6">Return in</Typography> : ""}
                  {diff ? (
                    <Typography align="right" variant="h5">
                      {diff} Days
                    </Typography>
                  ) : (
                    <Typography align="right" variant="h5">
                      Return Date ?
                    </Typography>
                  )}
                </Container>
              </Box>
            );
          }}
          disablePast
          //disableToolbar
          // className={classes.returnDateRoot}
          autoOk={mobile ? false : true}
          TextFieldComponent={TextField}
          FormHelperTextProps={{
            classes: { root: classes.formHelperTextPropsRoot },
          }}
          helperText={helperText}
          InputProps={{
            classes: {
              input: classes.input,
              // root: classes.textFieldRoot,
            },
            disableUnderline: true,
          }}
          format="ddd, DD MMM"
          //  minDate={"2021-08-1"}
          value={value}
          // @ts-ignore
          onChange={(date) => {
            // @ts-ignore
            onChange(date);
          }}
          onError={(error, value) => {
            if (error === "Date should not be before minimal date") {
              // @ts-ignore
              onChange(value);
              // @ts-ignore
              // setHelperText(error);
            }
          }}
        />
      </MuiPickersUtilsProvider>
    </Button>
  );
}
