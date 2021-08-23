import {
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useState } from "react";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import LowPriorityIcon from "@material-ui/icons/LowPriority";
import CheckIcon from "@material-ui/icons/Check";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { truncate } from "lodash";

const styles = makeStyles((theme) => ({
  select: { paddingRight: "8px !important" },
  menuprops: { top: "30px !important", width: "250px" },
  startAdornment: { marginRight: theme.spacing(1) },
  listIcon: { minWidth: "40px" },
}));

export default function TripSelector({ onChange, value }) {
  const classes = styles();
  const listItem = ["Return Trip", "One Way", "Multi-City"];
  //const [value, onChange] = useState("Return Trip");
  const [isOpen, setOpen] = useState(false);
  const mobile500 = useMediaQuery("(max-width:500px)");

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  function startAdornment(key) {
    switch (key) {
      case "Return Trip":
        return (
          <SyncAltIcon
            color={isOpen ? "primary" : "inherit"}
            className={classes.startAdornment}
          />
        );
      case "One Way":
        return (
          <ArrowRightAltIcon
            color={isOpen ? "primary" : "inherit"}
            className={classes.startAdornment}
          />
        );
      case "Multi-City":
        return (
          <LowPriorityIcon
            color={isOpen ? "primary" : "inherit"}
            className={classes.startAdornment}
          />
        );
      default:
        return "";
    }
  }

  function endAdornment(key) {
    if (key) return <ArrowDropUpIcon color="primary" />;
    return <ArrowDropDownIcon />;
  }

  // const listItem = ["Return Trip", "One Way", "Multi-City"];

  return (
    <Select
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      startAdornment={startAdornment(value)}
      endAdornment={endAdornment(isOpen)}
      IconComponent="span"
      disableUnderline
      labelId="demo-simple-select-filled-label"
      id="demo-simple-select-filled"
      value={value}
      onChange={handleChange}
      // className={classes.select}
      classes={{ select: classes.select }}
      MenuProps={{ classes: { paper: classes.menuprops } }}
      renderValue={() => (
        <Typography color={isOpen ? "primary" : "inherit"}>
          {truncate(value, { length: mobile500 ? 5 : 1000, omission: ".." })}
        </Typography>
      )}
    >
      {listItem.map((item, index) => (
        <MenuItem dense key={index} value={item}>
          <ListItemIcon classes={{ root: classes.listIcon }}>
            {value === item ? <CheckIcon color="primary" /> : ""}
          </ListItemIcon>
          <ListItemText primary={item} />
        </MenuItem>
      ))}
    </Select>
  );
}
