import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { Box, ButtonBase, Collapse, Grid, IconButton } from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
  icon: {
    backgroundColor: theme.palette.grey[100],
    borderRadius: "15%",
  },
  iconRoot: { padding: "0" },
}));

export default function PassengerSelector({ onChange, value }) {
  const classes = useStyles();
  const [infantError, setInfantError] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [value, setPassengers] = useState(value);
  const adultCount = value.filter((item) => item.type === "Adult")[0].count;

  const totalPassengers = value
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = (type, count, index) => {
    const newPassengers = value.map((item) => {
      if (item.type === type) {
        switch (type) {
          case "Adult":
            return { ...item, count: count > 1 ? count - 1 : count };
          default:
            return { ...item, count: count ? count - 1 : count };
        }
      } else {
        return item;
      }
    });
    // setPassengers(newPassengers);
    onChange(newPassengers);
  };

  const handleAdd = (type, count, index) => {
    const newPassengers = value.map((item) => {
      if (item.type === type) {
        switch (type) {
          case "Infant":
            if (adultCount > count) {
              return { ...item, count: count + 1 };
            } else {
              setInfantError(true);
              setTimeout(() => {
                setInfantError(false);
              }, 5000);
              return { ...item, count: count };
            }
          default:
            return { ...item, count: count + 1 };
        }
      } else {
        return item;
      }
    });

    // setPassengers(newPassengers);
    onChange(newPassengers);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // console.log("render PassengerSelector");
  return (
    <div>
      <ButtonBase
        color={anchorEl ? "primary" : "inherit"}
        component={Button}
        aria-describedby={id}
        onClick={handleClick}
        startIcon={<PersonIcon fontSize="large" />}
        endIcon={
          anchorEl ? (
            <ArrowDropUpIcon fontSize="large" />
          ) : (
            <ArrowDropDownIcon fontSize="large" />
          )
        }
      >
        {totalPassengers}
      </ButtonBase>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={3} width="250px">
          <Grid container spacing={3}>
            {value.map(({ type, count }, index) => (
              <Grid
                item
                container
                spacing={1}
                alignContent="center"
                alignItems="center"
                key={index}
              >
                <Grid xs={5} item>
                  <Typography>{type}</Typography>
                </Grid>
                <Grid item className={classes.icon}>
                  <IconButton
                    onClick={() => handleRemove(type, count, index)}
                    classes={{ root: classes.iconRoot }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Grid>
                <Grid item style={{ width: "32px", textAlignLast: "center" }}>
                  <Typography align="center" variant="button">
                    {count}
                  </Typography>
                </Grid>
                <Grid
                  item
                  onClick={() => handleAdd(type, count, index)}
                  className={classes.icon}
                >
                  <IconButton classes={{ root: classes.iconRoot }}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Collapse style={{ width: "250px" }} in={infantError} timeout={500}>
          <Alert severity="error">
            You cannot have more Infants than Adults
          </Alert>
        </Collapse>
      </Popover>
    </div>
  );
}
