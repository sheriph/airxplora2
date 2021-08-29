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
  const [flightOfferExtended, setOfferExtended] =
    useRecoilState(flightOfferExtended_);

  useEffect(() => {
    if (window !== undefined) {
      const response = window.localStorage.getItem("xpaBookingOffer");
      if (response) {
        const { data, included } = JSON.parse(response);
        const { flightOffers, bookingRequirements } = data;
      //  console.log(`bookingRequirements`, bookingRequirements);
        setRequirements(bookingRequirements?.travelerRequirements);
        setIncluded(included);
        setOfferExtended(flightOffers[0]);
      }
    }
  }, [null]);

  if (!flightOfferExtended) return <Typography>""</Typography>;

  // if (!flightOfferExtended || !flightOffer) return <>Loading...</>;
  //console.log(`object`, travelerRequirements, included, flightOfferExtended);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TripCardFinal
          flightOffer={flightOffer}
          dictionaries={dictionaries}
          carriers={carriers}
        />
      </Grid>
      <Grid item xs={12}>
        <Form
          travelerRequirements={travelerRequirements}
          flightOfferExtended={flightOfferExtended}
        />
      </Grid>
    </Grid>
  );
}

const req = [
  {
    travelerId: "1",
    genderRequired: true,
    documentRequired: true,
    dateOfBirthRequired: true,
    redressRequiredIfAny: true,
    residenceRequired: true,
  },
];

const offer = {
  type: "flight-offer",
  id: "1",
  source: "GDS",
  instantTicketingRequired: false,
  nonHomogeneous: false,
  paymentCardRequired: false,
  lastTicketingDate: "2021-09-01",
  itineraries: [
    {
      segments: [
        {
          departure: {
            iataCode: "LHR",
            terminal: "2",
            at: "2021-09-15T17:40:00",
          },
          arrival: {
            iataCode: "IST",
            at: "2021-09-15T23:25:00",
          },
          carrierCode: "TK",
          number: "1972",
          aircraft: {
            code: "789",
          },
          operating: {
            carrierCode: "TK",
          },
          duration: "PT3H45M",
          id: "49",
          numberOfStops: 0,
          co2Emissions: [
            {
              weight: 191,
              weightUnit: "KG",
              cabin: "ECONOMY",
            },
          ],
        },
        {
          departure: {
            iataCode: "IST",
            at: "2021-09-16T14:05:00",
          },
          arrival: {
            iataCode: "IAH",
            terminal: "D",
            at: "2021-09-16T19:10:00",
          },
          carrierCode: "TK",
          number: "33",
          aircraft: {
            code: "789",
          },
          operating: {
            carrierCode: "TK",
          },
          duration: "PT13H5M",
          id: "50",
          numberOfStops: 0,
          co2Emissions: [
            {
              weight: 514,
              weightUnit: "KG",
              cabin: "ECONOMY",
            },
          ],
        },
      ],
    },
    {
      segments: [
        {
          departure: {
            iataCode: "IAH",
            terminal: "D",
            at: "2021-09-30T20:50:00",
          },
          arrival: {
            iataCode: "IST",
            at: "2021-10-01T16:40:00",
          },
          carrierCode: "TK",
          number: "34",
          aircraft: {
            code: "789",
          },
          operating: {
            carrierCode: "TK",
          },
          duration: "PT11H50M",
          id: "190",
          numberOfStops: 0,
          co2Emissions: [
            {
              weight: 514,
              weightUnit: "KG",
              cabin: "ECONOMY",
            },
          ],
        },
        {
          departure: {
            iataCode: "IST",
            at: "2021-10-01T18:35:00",
          },
          arrival: {
            iataCode: "LHR",
            terminal: "2",
            at: "2021-10-01T20:45:00",
          },
          carrierCode: "TK",
          number: "1983",
          aircraft: {
            code: "321",
          },
          operating: {
            carrierCode: "TK",
          },
          duration: "PT4H10M",
          id: "191",
          numberOfStops: 0,
          co2Emissions: [
            {
              weight: 191,
              weightUnit: "KG",
              cabin: "ECONOMY",
            },
          ],
        },
      ],
    },
  ],
  price: {
    currency: "NGN",
    total: "350025.00",
    base: "56402.00",
    fees: [
      {
        amount: "0.00",
        type: "SUPPLIER",
      },
      {
        amount: "0.00",
        type: "TICKETING",
      },
      {
        amount: "0.00",
        type: "FORM_OF_PAYMENT",
      },
    ],
    grandTotal: "350025.00",
    billingCurrency: "NGN",
  },
  pricingOptions: {
    fareType: ["PUBLISHED"],
    includedCheckedBagsOnly: true,
  },
  validatingAirlineCodes: ["TK"],
  travelerPricings: [
    {
      travelerId: "1",
      fareOption: "STANDARD",
      travelerType: "ADULT",
      price: {
        currency: "NGN",
        total: "350025",
        base: "56402",
        taxes: [
          {
            amount: "2886.00",
            code: "XY",
          },
          {
            amount: "2309.00",
            code: "AY",
          },
          {
            amount: "186904.00",
            code: "YR",
          },
          {
            amount: "1633.00",
            code: "XA",
          },
          {
            amount: "2470.00",
            code: "YC",
          },
          {
            amount: "46250.00",
            code: "GB",
          },
          {
            amount: "23729.00",
            code: "UB",
          },
          {
            amount: "4818.00",
            code: "TR",
          },
          {
            amount: "15748.00",
            code: "US",
          },
          {
            amount: "1856.00",
            code: "XF",
          },
          {
            amount: "5020.00",
            code: "R1",
          },
        ],
        refundableTaxes: "89115",
      },
      fareDetailsBySegment: [
        {
          segmentId: "49",
          cabin: "ECONOMY",
          fareBasis: "PLXN2XPC",
          class: "P",
          includedCheckedBags: {
            quantity: 2,
          },
        },
        {
          segmentId: "50",
          cabin: "ECONOMY",
          fareBasis: "PLXN2XPC",
          class: "P",
          includedCheckedBags: {
            quantity: 2,
          },
        },
        {
          segmentId: "190",
          cabin: "ECONOMY",
          fareBasis: "PLXN2XPC",
          class: "P",
          includedCheckedBags: {
            quantity: 2,
          },
        },
        {
          segmentId: "191",
          cabin: "ECONOMY",
          fareBasis: "PLXN2XPC",
          class: "P",
          includedCheckedBags: {
            quantity: 2,
          },
        },
      ],
    },
  ],
};
