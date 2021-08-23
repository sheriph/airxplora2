import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchIcon from "@material-ui/icons/Search";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { AppBar, Box } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import BookingForm from "../components/bookingform/bookingForm";
import ResultPage from "../components/searchresults/resultpage";
import MyDrawer from "../components/others/drawer";
import { useRecoilState } from "recoil";
import { dictionary_, flightOffer_, openDrawer_ } from "../lib/state";
import DetailedTripInfo from "../components/searchresults/detailedtripinfo";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
});

export default function Airxplora() {
  const classes = useStyles();

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [flightOffer, setFlightOffer] = useRecoilState(flightOffer_);
  const [open, setOpen] = useRecoilState(openDrawer_);
  const [dictionary, setDictionary] = useRecoilState(dictionary_);

  return (
    <Box>
      <MyDrawer handleClose={() => setOpen(false)} open={open}>
        <DetailedTripInfo dictionary={dictionary} flightOffer={flightOffer} />
      </MyDrawer>
      <TabContext value={value}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="flight booking tab">
            <Tab
              icon={<SearchIcon fontSize="small" />}
              label="Search"
              value="1"
            />
            <Tab
              icon={<PlaylistAddCheckIcon fontSize="small" />}
              label="Select"
              value="2"
            />
            <Tab
              icon={<AccountCircleIcon fontSize="small" />}
              label="Book"
              value="3"
            />
          </TabList>
        </AppBar>
        <TabPanel value="1">
          <BookingForm />
        </TabPanel>
        <TabPanel value="2">
          <ResultPage />
        </TabPanel>
        <TabPanel value="3">3</TabPanel>
      </TabContext>
    </Box>
  );
}
