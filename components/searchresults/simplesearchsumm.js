import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BookingForm from "../bookingform/bookingForm";
import { useCookies } from "react-cookie";
import dayjs from "dayjs";
import { useMediaQuery } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { defaultExpanded_ } from "../../lib/state";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  AccordionDetailsRoot: { padding: "0" },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionExpanded: { marginBottom: "50px !important" },
}));

export default function SimpleSearchSummary({ flightOffers }) {
  const classes = useStyles();
  const [defaultExpanded, setDefaultExpanded] =
    useRecoilState(defaultExpanded_);
  const [cookies, setCookie] = useCookies(["xpaformData", "xpaMultiTrip"]);
  const phone = useMediaQuery("(max-width:600px)");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [traveller, setTraveller] = useState(0);
 // console.log(`cookies`, cookies.xpaformData);

  const tripType = cookies.xpaformData?.tripType;
  const from = cookies.xpaformData?.from;
  const to = cookies.xpaformData?.to;
  const depDate = cookies.xpaformData?.depDate;
  const retDate = cookies.xpaformData?.retDate;

  useEffect(() => {
    const arr = cookies?.xpaMultiTrip;
    if (arr) {
      setStart(arr[0]);
      setEnd(arr[arr.length - 1]);
    }
    const passengers = cookies.xpaformData?.passengers;
    console.log(`arr`, arr, passengers);
    if (passengers) {
      setTraveller(passengers.map((a) => a.count).reduce((a, b) => a + b, 0));
    }
    if (window !== undefined) {
      // const results = window.localStorage.getItem("xpaOffers");
      if (!flightOffers) {
        setTimeout(() => {
          setDefaultExpanded(true);
        }, 5000);
      }
    }
  }, [null]);

  return (
    <div className={classes.root}>
      <Accordion
        expanded={defaultExpanded}
        classes={{ expanded: classes.accordionExpanded }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setDefaultExpanded(!defaultExpanded)}
        >
          {tripType === "Multi-City" ? (
            <Typography className={classes.heading}>
              {tripType} from {start?.from.iataCode} to {end?.to.iataCode} |{" "}
              {traveller} Traveller(s) {phone ? <br /> : " | "}
              {dayjs(start?.depDate).format("ddd, DD MMM")}{" "}
            </Typography>
          ) : (
            <Typography className={classes.heading}>
              {tripType} from {from?.iataCode} to {to?.iataCode} | {traveller}{" "}
              Traveller(s) {phone ? <br /> : " | "}
              {dayjs(depDate).format("ddd, DD MMM")}{" "}
              {tripType === "Return Trip" ? (
                <>- {dayjs(retDate).format("ddd, DD MMM")}</>
              ) : (
                ""
              )}
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.AccordionDetailsRoot }}>
          <BookingForm />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Low Fare Finder</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
