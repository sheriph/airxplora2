import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useRecoilState } from "recoil";
import { xpaOffers_ } from "../../lib/state";
import { Countdown } from "../../lib/utilities";
import TripCard from "./tripcard";

export default function SearchResult() {
  const [results, setResults] = useRecoilState(xpaOffers_);
  console.log("?result", results);

  useEffect(() => {
    if (window !== "undefined" && !results) {
      const results = window.localStorage.getItem("xpaOffers");
      if (results) {
        setResults(JSON.parse(results));
      }
    }
  }, [null]);

  if (!results) return <Typography>Please Make a new search ...</Typography>;

  const {
    data,
    dictionaries: { carriers },
    dictionaries,
  } = results;

  return (
    <Grid container>
      {data.map((flightOffer, index) => (
        <LazyLoad
          style={{ width: "100%", paddingBottom: "15px" }}
          key={index}
          height={200}
        >
          <Grid item xs={12}>
            <TripCard
              flightOffer={flightOffer}
              dictionaries={dictionaries}
              carriers={carriers}
            />
          </Grid>
        </LazyLoad>
      ))}
    </Grid>
  );
}

/* const results = {
  meta: {
    count: 2,
  },
  data: [
    {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2021-08-17",
      numberOfBookableSeats: 7,
      itineraries: [
        {
          duration: "PT13H30M",
          segments: [
            {
              departure: {
                iataCode: "SDU",
                at: "2021-11-01T11:45:00",
              },
              arrival: {
                iataCode: "GRU",
                terminal: "2",
                at: "2021-11-01T12:55:00",
              },
              carrierCode: "G3",
              number: "1083",
              aircraft: {
                code: "738",
              },
              operating: {
                carrierCode: "G3",
              },
              duration: "PT1H10M",
              id: "1",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "GRU",
                terminal: "3",
                at: "2021-11-01T15:10:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "4S",
                at: "2021-11-02T05:15:00",
              },
              carrierCode: "UX",
              number: "58",
              aircraft: {
                code: "789",
              },
              operating: {
                carrierCode: "UX",
              },
              duration: "PT10H5M",
              id: "2",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT13H45M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "4S",
                at: "2021-11-05T23:45:00",
              },
              arrival: {
                iataCode: "GRU",
                terminal: "3",
                at: "2021-11-06T06:20:00",
              },
              carrierCode: "UX",
              number: "57",
              aircraft: {
                code: "789",
              },
              operating: {
                carrierCode: "UX",
              },
              duration: "PT10H35M",
              id: "3",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "GRU",
                terminal: "2",
                at: "2021-11-06T08:20:00",
              },
              arrival: {
                iataCode: "SDU",
                at: "2021-11-06T09:30:00",
              },
              carrierCode: "AD",
              number: "4084",
              aircraft: {
                code: "E95",
              },
              operating: {
                carrierCode: "AD",
              },
              duration: "PT1H10M",
              id: "4",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "958622.00",
        base: "912730.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "958622.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["UX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "563563.00",
            base: "540617.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "ECONOMY",
              fareBasis: "IYYRPO",
              class: "Y",
              includedCheckedBags: {
                quantity: 3,
              },
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "IYYRPO",
              brandedFare: "BUSINESS",
              class: "I",
              includedCheckedBags: {
                quantity: 3,
              },
            },
            {
              segmentId: "3",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              class: "Z",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "4",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              brandedFare: "STANDARD",
              class: "T",
              includedCheckedBags: {
                quantity: 1,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "395059.00",
            base: "372113.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "ECONOMY",
              fareBasis: "IYYRPO",
              class: "Y",
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "IYYRPO",
              brandedFare: "BUSINESS",
              class: "I",
            },
            {
              segmentId: "3",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              class: "Z",
            },
            {
              segmentId: "4",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              brandedFare: "STANDARD",
              class: "T",
            },
          ],
        },
      ],
    },
    {
      type: "flight-offer",
      id: "2",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: "2021-08-17",
      numberOfBookableSeats: 7,
      itineraries: [
        {
          duration: "PT13H30M",
          segments: [
            {
              departure: {
                iataCode: "SDU",
                at: "2021-11-01T11:45:00",
              },
              arrival: {
                iataCode: "GRU",
                terminal: "2",
                at: "2021-11-01T12:55:00",
              },
              carrierCode: "G3",
              number: "1083",
              aircraft: {
                code: "738",
              },
              operating: {
                carrierCode: "G3",
              },
              duration: "PT1H10M",
              id: "1",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "GRU",
                terminal: "3",
                at: "2021-11-01T15:10:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "4S",
                at: "2021-11-02T05:15:00",
              },
              carrierCode: "UX",
              number: "58",
              aircraft: {
                code: "789",
              },
              operating: {
                carrierCode: "UX",
              },
              duration: "PT10H5M",
              id: "2",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
        {
          duration: "PT17H55M",
          segments: [
            {
              departure: {
                iataCode: "MAD",
                terminal: "4S",
                at: "2021-11-05T23:45:00",
              },
              arrival: {
                iataCode: "GRU",
                terminal: "3",
                at: "2021-11-06T06:20:00",
              },
              carrierCode: "UX",
              number: "57",
              aircraft: {
                code: "789",
              },
              operating: {
                carrierCode: "UX",
              },
              duration: "PT10H35M",
              id: "5",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
            {
              departure: {
                iataCode: "GRU",
                terminal: "2",
                at: "2021-11-06T12:40:00",
              },
              arrival: {
                iataCode: "SDU",
                at: "2021-11-06T13:40:00",
              },
              carrierCode: "AD",
              number: "4373",
              aircraft: {
                code: "E95",
              },
              operating: {
                carrierCode: "AD",
              },
              duration: "PT1H",
              id: "6",
              numberOfStops: 0,
              blacklistedInEU: false,
            },
          ],
        },
      ],
      price: {
        currency: "NGN",
        total: "958622.00",
        base: "912730.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
        ],
        grandTotal: "958622.00",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: ["UX"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "NGN",
            total: "563563.00",
            base: "540617.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "ECONOMY",
              fareBasis: "IYYRPO",
              class: "Y",
              includedCheckedBags: {
                quantity: 3,
              },
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "IYYRPO",
              brandedFare: "BUSINESS",
              class: "I",
              includedCheckedBags: {
                quantity: 3,
              },
            },
            {
              segmentId: "5",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              class: "Z",
              includedCheckedBags: {
                quantity: 1,
              },
            },
            {
              segmentId: "6",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              brandedFare: "STANDARD",
              class: "T",
              includedCheckedBags: {
                quantity: 1,
              },
            },
          ],
        },
        {
          travelerId: "2",
          fareOption: "STANDARD",
          travelerType: "CHILD",
          price: {
            currency: "NGN",
            total: "395059.00",
            base: "372113.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "1",
              cabin: "ECONOMY",
              fareBasis: "IYYRPO",
              class: "Y",
            },
            {
              segmentId: "2",
              cabin: "BUSINESS",
              fareBasis: "IYYRPO",
              brandedFare: "BUSINESS",
              class: "I",
            },
            {
              segmentId: "5",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              class: "Z",
            },
            {
              segmentId: "6",
              cabin: "ECONOMY",
              fareBasis: "ZYYRPO",
              brandedFare: "STANDARD",
              class: "T",
            },
          ],
        },
      ],
    },
  ],
  dictionaries: {
    locations: {
      MAD: {
        cityCode: "MAD",
        countryCode: "ES",
      },
      SDU: {
        cityCode: "RIO",
        countryCode: "BR",
      },
      GRU: {
        cityCode: "SAO",
        countryCode: "BR",
      },
    },
    aircraft: {
      738: "BOEING 737-800",
      789: "BOEING 787-9",
      E95: "EMBRAER 195",
    },
    currencies: {
      NGN: "NIGERIAN NAIRA",
    },
    carriers: {
      UX: "AIR EUROPA",
      AD: "AZUL LINHAS AEREAS BRASILEIRAS",
      G3: "GOL LINHAS AEREAS S/A",
    },
  },
}; */
