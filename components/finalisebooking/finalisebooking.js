import { Button, Grid, Typography } from "@material-ui/core";
import { first, last } from "lodash";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useRecoilState } from "recoil";
import {
  fareDifference_,
  flightOfferExtended_,
  flightOffer_,
  included_,
  travelerRequirements_,
  xpaCarriers_,
  xpaDictionary_,
} from "../../lib/state";
import { useMoney } from "../../lib/utilities";
import TripCard from "../searchresults/tripcard";
import Form from "./form";
import TripCardFinal from "./tripcardfinal";

export default function FinaliseBooking() {
  const [travelerRequirements, setRequirements] = useRecoilState(
    travelerRequirements_
  );
  const [included, setIncluded] = useRecoilState(included_);
  const [carriers, setCarriers] = useRecoilState(xpaCarriers_);
  const [dictionaries, setDictionary] = useRecoilState(xpaDictionary_);
  const [flightOffer, setOffer] = useRecoilState(flightOffer_);
  const [fareDiff, setDiff] = useRecoilState(fareDifference_);
  const price1 = useMoney(first(fareDiff));
  const price2 = useMoney(last(fareDiff));
  const variant = `${
    Number(first(fareDiff)) < Number(last(fareDiff)) ? "warning" : "success"
  }`;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const String1 = () => (
    <>
      The fare has increased from {useMoney(first(fareDiff))} to{" "}
      {useMoney(last(fareDiff))}
    </>
  );
  const String2 = () => (
    <>
      The fare has reduced from {useMoney(first(fareDiff))} to{" "}
      {useMoney(last(fareDiff))}
    </>
  );
  useEffect(() => {
    if (window !== undefined) {
      if (fareDiff)
        setTimeout(() => {
          notifyPriceChange();
        }, 1000);
      /*  const response = window.sessionStorage.getItem("xpaBookingOffer");
      if (response) {
        const { data, included } = JSON.parse(response);
        const { flightOffers, bookingRequirements } = data;
        setRequirements(bookingRequirements?.travelerRequirements);
        setIncluded(included);
      } */
    }
    return () => {
      setOffer(null);
    };
  }, [null]);
  console.log(`price1`, price1, price2);
  const notifyPriceChange = () => {
    const action = (key) => (
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        Close
      </Button>
    );
    enqueueSnackbar(
      <Typography>
        {Number(first(fareDiff)) < Number(last(fareDiff)) ? (
          <String1 />
        ) : (
          <String2 />
        )}
      </Typography>,
      {
        // @ts-ignore
        variant: variant,
        persist: true,
        action: action,
        preventDuplicate: true,
        autoHideDuration: 5000,
      }
    );
  };

  if (!flightOffer)
    return (
      <Typography>No data/Expired data. Please make a new search</Typography>
    );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TripCard
          flightOffer={flightOffer}
          dictionaries={dictionaries}
          carriers={carriers}
        />
      </Grid>
      <Grid item xs={12}>
        <Form
          travelerRequirements={travelerRequirements}
          flightOffer={flightOffer}
        />
      </Grid>
    </Grid>
  );
}
