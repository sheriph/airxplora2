import React, { useEffect, useState } from "react";
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
import {
  flightOffer_,
  openDrawer_,
  tab_,
  xpaCarriers_,
  xpaDictionary_,
  xpaOffersFixed_,
  xpaOffers_,
} from "../lib/state";
import FinaliseBooking from "../components/finalisebooking/finalisebooking";
import DetailedTripInfo from "../components/searchresults/detailedtripinfo";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
});

export default function Airxplora() {
  const classes = useStyles();

  const [tab, setTab] = useRecoilState(tab_);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const [flightOfferState, setFlightOffer] = useRecoilState(flightOffer_);
  const [open, setOpen] = useRecoilState(openDrawer_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);
  const [carriers, setCarriers] = useRecoilState(xpaCarriers_);
  const [flightOffers, setOffers] = useRecoilState(xpaOffers_);
  const [flightOffersFixed, setOffersFixed] = useRecoilState(xpaOffersFixed_);

  // const [results, setResults] = useRecoilState(xpaOffers_);
  // console.log("?result", results);

  useEffect(() => {
    if (window !== "undefined" && !flightOffers) {
      const results = window.localStorage.getItem("xpaOffers");
      if (results) {
        const {
          data,
          dictionaries: { carriers },
          dictionaries,
        } = JSON.parse(results);
        setDictionary(dictionaries);
        setOffers(data);
        setOffersFixed(data);
        setCarriers(carriers);
      }
    }
  }, [null]);

 // console.log(`index flightOffers`, flightOffers);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <MyDrawer handleClose={handleClose} open={open}>
        <DetailedTripInfo
          dictionary={dictionary}
          flightOffer={flightOfferState}
          handleClose={handleClose}
        />
      </MyDrawer>
      <TabContext value={tab}>
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
          <ResultPage
            flightOffers={flightOffers}
            carriers={carriers}
            dictionary={dictionary}
          />
        </TabPanel>
        <TabPanel value="3">
          <FinaliseBooking />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
