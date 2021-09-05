import { Grid, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useRecoilState } from "recoil";
import {
  flightOfferExtended_,
  flightOffer_,
  included_,
  travelerRequirements_,
  xpaCarriers_,
  xpaDictionary_,
} from "../../lib/state";
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


  useEffect(() => {
    if (window !== undefined) {
      const response = window.sessionStorage.getItem("xpaBookingOffer");
      if (response) {
        const { data, included } = JSON.parse(response);
        const { flightOffers, bookingRequirements } = data;
        //  console.log(`bookingRequirements`, bookingRequirements);
        setRequirements(bookingRequirements?.travelerRequirements);
        setIncluded(included);
        // setOfferExtended(flightOffers[0]);
      }
    }
  }, [null]);

  if (!flightOffer)
    return (
      <Typography>No data/Expired data. Please make a new search</Typography>
    );
  console.log(`flightOff`, flightOffer, dictionaries);
  // if (!flightOfferExtended || !flightOffer) return <>Loading...</>;
  //console.log(`object`, travelerRequirements, included, flightOfferExtended);
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
