import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Button,
  CircularProgress,
  Grid,
  useMediaQuery,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ClearIcon from "@material-ui/icons/Clear";
import { Box } from "@material-ui/core";
import PriceTable from "./pricetable";
import { useMoney, verifyPrice } from "../../lib/utilities";
import {
  fareDifference_,
  flightOfferExtended_,
  flightOffer_,
  included_,
  openDrawer_,
  tab_,
  travelerRequirements_,
  xpaBookingOffer_,
} from "../../lib/state";
import { useRecoilState } from "recoil";
import { useSnackbar } from "notistack";
import { first } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function TripDetailHeader({
  grandTotal,
  flightOffer,
  travelerPricings,
  handleClose,
  booked,
}) {
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const mini = useMediaQuery("(max-width:400px)");
  const [open, setOpen] = useRecoilState(openDrawer_);
  const [bookingOffer, setOffer] = useRecoilState(xpaBookingOffer_);
  const [isVerifying, setIsVerifying] = useState(false);
  const [tab, setTab] = useRecoilState(tab_);
  const [travelerRequirements, setRequirements] = useRecoilState(
    travelerRequirements_
  );
  const [included, setIncluded] = useRecoilState(included_);
  /*   const [flightOfferExtended, setOfferExtended] =
    useRecoilState(flightOfferExtended_); */
  const theme = useTheme();
  const [flightOfferState, setFlightOffer] = useRecoilState(flightOffer_);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [fareDiff, setDiff] = useRecoilState(fareDifference_);

  const bookNow = async () => {
    try {
      setIsVerifying(true);
      const response = await verifyPrice(flightOffer);
      setIsVerifying(false);
      window.sessionStorage.setItem(
        "xpaBookingOffer",
        JSON.stringify(response)
      );
      const { data, included } = response;
      const { flightOffers, bookingRequirements } = data;
      const floPriced = first(flightOffers);
      const updatedOffer = {
        ...floPriced,
        itineraries: flightOffer.itineraries,
      };
      setFlightOffer(updatedOffer);
      if (floPriced.price.grandTotal !== flightOffer.price.grandTotal) {
        setDiff([flightOffer.price.grandTotal, floPriced.price.grandTotal]);
      }
      console.log(`bookingRequirements`, bookingRequirements);
      setRequirements(bookingRequirements?.travelerRequirements);
      setIncluded(included);
      setTab("3");
      console.log(`response`, response);
      handleClose();
    } catch (error) {
      console.log(`fare pricing error`, error);
      enqueueSnackbar(
        "Seems like the seat has just been sold, please search again to verify available and book again",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 10000,
        }
      );
    }
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expand}>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid
            container
            alignContent="center"
            alignItems="center"
            justifyContent="space-around"
          >
            {handleClose && (
              <Grid
                item
                xs={mini ? false : true}
                onClick={() => setOpen(false)}
              >
                <ClearIcon />
              </Grid>
            )}
            <Grid item xs>
              <Button
                size="small"
                disableFocusRipple
                disableRipple
                disableTouchRipple
                endIcon={
                  <KeyboardArrowDownIcon
                    style={{
                      transform: expand ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.5s",
                    }}
                  />
                }
                onClick={() => setExpand(!expand)}
              >
                <Typography
                  component="span"
                  style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                >
                  {useMoney(grandTotal)}
                </Typography>
              </Button>
            </Grid>
            <Grid item xs>
              {tab === "2" && (
                <Box display="flex" justifyContent="flex-end">
                  <Grid
                    container
                    justifyContent="flex-end"
                    direction={isVerifying ? "column" : "row"}
                  >
                    <Grid item>
                      <Button
                        disabled={isVerifying}
                        endIcon={
                          isVerifying ? <CircularProgress size="20px" /> : ""
                        }
                        onClick={bookNow}
                        variant="contained"
                        color="primary"
                        // size="small"
                      >
                        <span style={{ whiteSpace: "nowrap" }}>Book Now</span>
                      </Button>
                    </Grid>
                    {isVerifying && (
                      <Grid item>
                        <span>Please wait...</span>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
              {booked && (
                <Box display="flex" justifyContent="flex-end">
                  <Grid
                    container
                    justifyContent="flex-end"
                    direction={isVerifying ? "column" : "row"}
                  >
                    <Grid item>
                      <Typography display="block" variant="caption">
                        Yet to pay ?
                      </Typography>
                      <Button
                        disabled={isVerifying}
                        endIcon={
                          isVerifying ? <CircularProgress size="20px" /> : ""
                        }
                        onClick={null}
                        variant="contained"
                        color="primary"
                        // size="small"
                      >
                        <span style={{ whiteSpace: "nowrap" }}>Pay Now</span>
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <PriceTable
            travelerPricings={travelerPricings}
            grandTotal={grandTotal}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
