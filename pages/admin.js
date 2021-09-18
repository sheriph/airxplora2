import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { useMediaQuery } from "@material-ui/core";
import { TabContext, TabPanel } from "@material-ui/lab";
import Bookings from "../components/admin/bookings";
import Commission from "../components/admin/commission";
import Profile from "../components/admin/profile";
import { axiosAirxplora } from "../lib/utilities";
import Loader from "../components/others/loader";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  panelRoot: {
    padding: "0",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const mobile = useMediaQuery("(max-width:600px)");
  const [myRows, setRows] = React.useState([]);
  const [commissionRows, setCommissionRows] = React.useState([]);
  const [profile, setProfile] = React.useState([]);
  const [isloading, setLoading] = React.useState(false);

  const [tab, setTab] = React.useState("Profile");

  const handleChange = (value) => setTab(value);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getProfile = async () => {
    const profile = window.sessionStorage.getItem("profile");
    if (profile) {
      setProfile(JSON.parse(profile));
      return;
    }
    let config = {
      method: "get",
      url: "/api/getprofile",
    };
    try {
      setLoading(true);
      const profile = await axiosAirxplora(config, 3);
      console.log(`profile`, profile.data.profile);
      window.sessionStorage.setItem(
        "profile",
        JSON.stringify(profile.data.profile)
      );
      setProfile(profile.data.profile);
    } catch (err) {
      console.log(`err`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      getProfile();
    }
  }, [null]);

  useEffect(() => {
    if (mobile) {
      setOpen(false);
    }
  }, [mobile]);

  return (
    <div className={classes.root}>
      <Loader open={isloading} />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["Profile", "Bookings", "Commission"].map((text, index) => (
            <ListItem onClick={() => handleChange(text)} button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        <TabContext value={tab}>
          <TabPanel classes={{ root: classes.panelRoot }} value="Profile">
            <Profile profile={profile} setProfile={setProfile} />
          </TabPanel>
          <TabPanel classes={{ root: classes.panelRoot }} value="Bookings">
            <Bookings myRows={myRows} setRows={setRows} />
          </TabPanel>
          <TabPanel classes={{ root: classes.panelRoot }} value="Commission">
            <Commission rows={commissionRows} setRows={setCommissionRows} />
          </TabPanel>
        </TabContext>
      </main>
    </div>
  );
}
