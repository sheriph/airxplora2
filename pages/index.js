import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchIcon from "@material-ui/icons/Search";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { AppBar, Box, Collapse, useMediaQuery } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import BookingForm from "../components/bookingform/bookingForm";
import { ResultPage } from "../components/searchresults/resultpage";
import MyDrawer from "../components/others/drawer";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import { useRecoilState } from "recoil";
import {
  commissions_,
  flightOffer_,
  openDrawer_,
  profile_,
  tab_,
  xpaCarriers_,
  xpaDictionary_,
  xpaOffersFixed_,
  xpaOffers_,
} from "../lib/state";
import FinaliseBooking from "../components/finalisebooking/finalisebooking";
import DetailedTripInfo from "../components/searchresults/detailedtripinfo";
import MyBooking from "../components/mybooking/mybooking";
import { axiosAirxplora } from "../lib/utilities";
import Loader from "../components/others/loader";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
  panelRoot: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: { padding: theme.spacing(1) },
  },
}));

export default function Airxplora() {
  const classes = useStyles();

  const [commissions, setCommissions] = useRecoilState(commissions_);

  const [tab, setTab] = useRecoilState(tab_);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const [isloading, setLoading] = useState(false);
  const [flightOfferState, setFlightOffer] = useRecoilState(flightOffer_);
  const [open, setOpen] = useRecoilState(openDrawer_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);
  const [carriers, setCarriers] = useRecoilState(xpaCarriers_);
  const [flightOffers, setOffers] = useRecoilState(xpaOffers_);
  const [profile, setProfile] = useRecoilState(profile_);
  const [flightOffersFixed, setOffersFixed] = useRecoilState(xpaOffersFixed_);
  useEffect(() => {
    if (window !== undefined && !flightOffers) {
      const results = window.sessionStorage.getItem("xpaOffers");
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

    const getCommissions = async () => {
      const commissions = window.sessionStorage.getItem("commissions");
      if (commissions) {
        setCommissions(JSON.parse(commissions));
        return;
      }
      let config = {
        method: "get",
        url: "/api/getcommission",
      };
      try {
        setLoading(true);
        const commissions = await axiosAirxplora(config, 2);
        console.log(`commissions`, commissions.data.commissions);
        setLoading(false);
        window.sessionStorage.setItem(
          "commissions",
          JSON.stringify(commissions.data.commissions)
        );
        setCommissions(commissions.data.commissions);
      } catch (error) {
        console.log(` commission error`, error);
      }
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
    if (window !== undefined) {
      getCommissions();
      getProfile();
    }
  }, [null]);

  // console.log(`index flightOffers`, flightOffers);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Loader open={isloading} />
      <MyDrawer handleClose={handleClose} open={open}>
        <DetailedTripInfo
          ticketingAgreement={null}
          associatedRecords={null}
          travelers={null}
          contacts={null}
          dictionary={dictionary}
          flightOffer={flightOfferState}
          handleClose={handleClose}
          booked={false}
        />
      </MyDrawer>
      <TabContext value={tab}>
        <AppBar position="static">
          {tab === "3" ? (
            <TabList onChange={handleChange} aria-label="flight booking tab">
              <Tab
                icon={<SearchIcon fontSize="small" />}
                label="Search"
                value="1"
              />
              <Tab
                disabled={!flightOffers ? true : false}
                icon={<PlaylistAddCheckIcon fontSize="small" />}
                label="Select"
                value="2"
              />
              <Tab
                disabled
                icon={<AccountCircleIcon fontSize="small" />}
                label="Book"
                value="3"
              />
              <Tab
                icon={<FindInPageIcon fontSize="small" />}
                label="MY BOOKING"
                value="4"
              />
            </TabList>
          ) : (
            <TabList onChange={handleChange} aria-label="flight booking tab">
              <Tab
                icon={<SearchIcon fontSize="small" />}
                label="Search"
                value="1"
              />
              <Tab
                disabled={!flightOffers ? true : false}
                icon={<PlaylistAddCheckIcon fontSize="small" />}
                label="Select"
                value="2"
              />
              <Tab
                icon={<FindInPageIcon fontSize="small" />}
                label="MY BOOKING"
                value="4"
              />
            </TabList>
          )}
        </AppBar>
        <TabPanel classes={{ root: classes.panelRoot }} value="1">
          <BookingForm />
        </TabPanel>
        <TabPanel classes={{ root: classes.panelRoot }} value="2">
          <ResultPage
            flightOffers={flightOffers}
            carriers={carriers}
            dictionary={dictionary}
          />
        </TabPanel>
        <TabPanel classes={{ root: classes.panelRoot }} value="3">
          <FinaliseBooking />
        </TabPanel>
        <TabPanel classes={{ root: classes.panelRoot }} value="4">
          <MyBooking />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
