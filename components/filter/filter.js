import { makeStyles, Paper } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { result } from "lodash";
import { useEffect, useState } from "react";
import StopFilter from "./stopfilter";
import PriceRange from "./pricerange";
import AirlineFilter from "./airlinefilter";
import { filterAirline, filterPrice, filterStop } from "../../lib/utilities";
import ClearIcon from "@material-ui/icons/Clear";
import { useRecoilState } from "recoil";
import { xpaOffersFixed_, xpaOffers_ } from "../../lib/state";

const styles = makeStyles((theme) => ({
  gridItem: { padding: theme.spacing(1), marginBottom: theme.spacing(1) },
  gridContainer: { padding: "10px" },
}));

export default function Filter({ handleClose = null, carriers }) {
  const classes = styles();
  const [flightOffersFlexible, setFlexibleOffers] = useRecoilState(xpaOffers_);
  const [flightOffersFixed, setFixedOffers] = useRecoilState(xpaOffersFixed_);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stopData, setStopData] = useState({ 1: false });
  const [airlineData, setAirlineData] = useState({ KQ: false });

  if (!flightOffersFixed) return <></>;

  useEffect(() => {
    let offers;
    offers = filterPrice(priceRange, flightOffersFixed);
    offers = filterStop(stopData, offers);
    offers = filterAirline(airlineData, offers);
    // console.log(`offers`, offers);
    setFlexibleOffers(offers);
  }, [
    JSON.stringify(priceRange),
    JSON.stringify(stopData),
    JSON.stringify(airlineData),
  ]);

  console.log(`flightOffersFlexible`, flightOffersFlexible);

  return (
    <Grid container direction="column">
      <Grid component={Paper} className={classes.gridItem} item>
        <Grid
          container
          justifyContent="space-between"
          alignContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Filter Result
            </Typography>
          </Grid>
          {handleClose && (
            <Grid item onClick={handleClose}>
              <ClearIcon fontSize="large" color="primary" />
            </Grid>
          )}
        </Grid>
        <Typography>
          {flightOffersFlexible.length === flightOffersFixed.length
            ? "Showing All Result"
            : `Showing ${flightOffersFlexible.length} from ${flightOffersFixed.length} Options`}
        </Typography>
      </Grid>
      <Grid item component={Paper} className={classes.gridItem}>
        <PriceRange
          setPriceRange={setPriceRange}
          flightOffersFixed={flightOffersFixed}
        />
      </Grid>
      <Grid item component={Paper} className={classes.gridItem}>
        <StopFilter
          setStopData={setStopData}
          flightOffersFixed={flightOffersFixed}
        />
      </Grid>
      <Grid item component={Paper} className={classes.gridItem}>
        <AirlineFilter
          carriers={carriers}
          setAirlineData={setAirlineData}
          flightOffersFixed={flightOffersFixed}
        />
      </Grid>
    </Grid>
  );
}

const offersFlexible = [
  {
    type: "flight-offer",
    id: "1",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T10:00:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T13:30:00",
            },
            carrierCode: "UX",
            number: "1014",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "9",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T09:00:00",
            },
            carrierCode: "UX",
            number: "1013",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "25",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "35064.00",
      base: "9708.00",
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
      grandTotal: "35064.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "35064.00",
          base: "9708.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "9",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "25",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
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
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T17:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:55:00",
            },
            carrierCode: "UX",
            number: "1016",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "11",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T09:00:00",
            },
            carrierCode: "UX",
            number: "1013",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "25",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "35064.00",
      base: "9708.00",
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
      grandTotal: "35064.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "35064.00",
          base: "9708.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "11",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "25",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "3",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T10:00:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T13:30:00",
            },
            carrierCode: "UX",
            number: "1014",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "9",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:00:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T16:25:00",
            },
            carrierCode: "UX",
            number: "1015",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "27",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "39632.00",
      base: "14276.00",
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
      grandTotal: "39632.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "39632.00",
          base: "14276.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "9",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "27",
            cabin: "ECONOMY",
            fareBasis: "NYYR5L",
            brandedFare: "LITE",
            class: "N",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "4",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T17:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:55:00",
            },
            carrierCode: "UX",
            number: "1016",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "11",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:00:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T16:25:00",
            },
            carrierCode: "UX",
            number: "1015",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "27",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "39632.00",
      base: "14276.00",
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
      grandTotal: "39632.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "39632.00",
          base: "14276.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "11",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "27",
            cabin: "ECONOMY",
            fareBasis: "NYYR5L",
            brandedFare: "LITE",
            class: "N",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "5",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T18:50:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T22:10:00",
            },
            carrierCode: "IB",
            number: "3167",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "5",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "6",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T18:50:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T22:10:00",
            },
            carrierCode: "IB",
            number: "3167",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "5",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "7",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T18:50:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T22:10:00",
            },
            carrierCode: "IB",
            number: "3167",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "5",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "8",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T10:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T14:00:00",
            },
            carrierCode: "IB",
            number: "3163",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "8",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "8",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "9",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T10:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T14:00:00",
            },
            carrierCode: "IB",
            number: "3163",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "8",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "8",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "10",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T10:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T14:00:00",
            },
            carrierCode: "IB",
            number: "3163",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "8",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "8",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "11",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T16:40:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:10:00",
            },
            carrierCode: "IB",
            number: "3177",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "10",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "10",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "12",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T16:40:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:10:00",
            },
            carrierCode: "IB",
            number: "3177",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "10",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "10",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "13",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T16:40:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:10:00",
            },
            carrierCode: "IB",
            number: "3177",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "10",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "10",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "14",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: "PT5H5M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "S",
              at: "2021-08-24T12:55:00",
            },
            arrival: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T16:10:00",
            },
            carrierCode: "IB",
            number: "5393",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT2H15M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T17:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4",
              at: "2021-08-24T19:00:00",
            },
            carrierCode: "IB",
            number: "5256",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT1H25M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "77065.00",
      base: "45684.00",
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
      grandTotal: "77065.00",
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "77065.00",
          base: "45684.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "3",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "4",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            brandedFare: "BAGSEAT",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "15",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: "PT5H5M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "S",
              at: "2021-08-24T12:55:00",
            },
            arrival: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T16:10:00",
            },
            carrierCode: "IB",
            number: "5393",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT2H15M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T17:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4",
              at: "2021-08-24T19:00:00",
            },
            carrierCode: "IB",
            number: "5256",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT1H25M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "77065.00",
      base: "45684.00",
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
      grandTotal: "77065.00",
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "77065.00",
          base: "45684.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "3",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "4",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            brandedFare: "BAGSEAT",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "16",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: "PT5H5M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "S",
              at: "2021-08-24T12:55:00",
            },
            arrival: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T16:10:00",
            },
            carrierCode: "IB",
            number: "5393",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT2H15M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T17:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4",
              at: "2021-08-24T19:00:00",
            },
            carrierCode: "IB",
            number: "5256",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT1H25M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "77065.00",
      base: "45684.00",
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
      grandTotal: "77065.00",
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "77065.00",
          base: "45684.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "3",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "4",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            brandedFare: "BAGSEAT",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "17",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "18",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "19",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "20",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "21",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "22",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "23",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "24",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "25",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "26",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "27",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "28",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "29",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "30",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "31",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "32",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "33",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "84740.00",
      base: "10850.00",
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
      grandTotal: "84740.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "84740.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "34",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "84740.00",
      base: "10850.00",
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
      grandTotal: "84740.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "84740.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "35",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "85918.00",
      base: "8566.00",
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
      grandTotal: "85918.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "85918.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "36",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "85918.00",
      base: "8566.00",
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
      grandTotal: "85918.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "85918.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "37",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "38",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "39",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "40",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "41",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "42",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "43",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT10H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "31",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T22:00:00",
            },
            carrierCode: "LH",
            number: "4402",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "32",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "31",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "32",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "44",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "45",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "46",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "47",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT10H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "31",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T22:00:00",
            },
            carrierCode: "LH",
            number: "4402",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "32",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "31",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "32",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "48",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "49",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "50",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
];

const offersFixed = [
  {
    type: "flight-offer",
    id: "1",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T10:00:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T13:30:00",
            },
            carrierCode: "UX",
            number: "1014",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "9",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T09:00:00",
            },
            carrierCode: "UX",
            number: "1013",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "25",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "35064.00",
      base: "9708.00",
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
      grandTotal: "35064.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "35064.00",
          base: "9708.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "9",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "25",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
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
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T17:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:55:00",
            },
            carrierCode: "UX",
            number: "1016",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "11",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T09:00:00",
            },
            carrierCode: "UX",
            number: "1013",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "25",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "35064.00",
      base: "9708.00",
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
      grandTotal: "35064.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "35064.00",
          base: "9708.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "11",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "25",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "3",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T10:00:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T13:30:00",
            },
            carrierCode: "UX",
            number: "1014",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "9",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:00:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T16:25:00",
            },
            carrierCode: "UX",
            number: "1015",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "27",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "39632.00",
      base: "14276.00",
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
      grandTotal: "39632.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "39632.00",
          base: "14276.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "9",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "27",
            cabin: "ECONOMY",
            fareBasis: "NYYR5L",
            brandedFare: "LITE",
            class: "N",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "4",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-24T17:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:55:00",
            },
            carrierCode: "UX",
            number: "1016",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H30M",
            id: "11",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:00:00",
            },
            arrival: {
              iataCode: "LGW",
              terminal: "N",
              at: "2021-08-31T16:25:00",
            },
            carrierCode: "UX",
            number: "1015",
            aircraft: {
              code: "73H",
            },
            operating: {
              carrierCode: "UX",
            },
            duration: "PT2H25M",
            id: "27",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "39632.00",
      base: "14276.00",
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
      grandTotal: "39632.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
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
          total: "39632.00",
          base: "14276.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "11",
            cabin: "ECONOMY",
            fareBasis: "ZYYR5L",
            brandedFare: "LITE",
            class: "Z",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "27",
            cabin: "ECONOMY",
            fareBasis: "NYYR5L",
            brandedFare: "LITE",
            class: "N",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "5",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T18:50:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T22:10:00",
            },
            carrierCode: "IB",
            number: "3167",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "5",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "6",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T18:50:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T22:10:00",
            },
            carrierCode: "IB",
            number: "3167",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "5",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "7",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T18:50:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T22:10:00",
            },
            carrierCode: "IB",
            number: "3167",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "5",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "8",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T10:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T14:00:00",
            },
            carrierCode: "IB",
            number: "3163",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "8",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "8",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "9",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T10:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T14:00:00",
            },
            carrierCode: "IB",
            number: "3163",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "8",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "8",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "10",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T10:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T14:00:00",
            },
            carrierCode: "IB",
            number: "3163",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "8",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "8",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "11",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T16:40:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:10:00",
            },
            carrierCode: "IB",
            number: "3177",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "10",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "10",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "12",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T16:40:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:10:00",
            },
            carrierCode: "IB",
            number: "3177",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "10",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "10",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "13",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-24T16:40:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-24T20:10:00",
            },
            carrierCode: "IB",
            number: "3177",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "10",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "72920.00",
      base: "39974.00",
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
      grandTotal: "72920.00",
      additionalServices: [
        {
          amount: "31958",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "72920.00",
          base: "39974.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "10",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "14",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: "PT5H5M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "S",
              at: "2021-08-24T12:55:00",
            },
            arrival: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T16:10:00",
            },
            carrierCode: "IB",
            number: "5393",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT2H15M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T17:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4",
              at: "2021-08-24T19:00:00",
            },
            carrierCode: "IB",
            number: "5256",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT1H25M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H20M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T15:45:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T17:05:00",
            },
            carrierCode: "IB",
            number: "3166",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H20M",
            id: "24",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "77065.00",
      base: "45684.00",
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
      grandTotal: "77065.00",
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "77065.00",
          base: "45684.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "3",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "4",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            brandedFare: "BAGSEAT",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "24",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "15",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: "PT5H5M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "S",
              at: "2021-08-24T12:55:00",
            },
            arrival: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T16:10:00",
            },
            carrierCode: "IB",
            number: "5393",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT2H15M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T17:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4",
              at: "2021-08-24T19:00:00",
            },
            carrierCode: "IB",
            number: "5256",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT1H25M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H25M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T13:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "IB",
            number: "3176",
            aircraft: {
              code: "330",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H25M",
            id: "26",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "77065.00",
      base: "45684.00",
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
      grandTotal: "77065.00",
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "77065.00",
          base: "45684.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "3",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "4",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            brandedFare: "BAGSEAT",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "26",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "16",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-21",
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: "PT5H5M",
        segments: [
          {
            departure: {
              iataCode: "LGW",
              terminal: "S",
              at: "2021-08-24T12:55:00",
            },
            arrival: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T16:10:00",
            },
            carrierCode: "IB",
            number: "5393",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT2H15M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BCN",
              terminal: "1",
              at: "2021-08-24T17:35:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "4",
              at: "2021-08-24T19:00:00",
            },
            carrierCode: "IB",
            number: "5256",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "VY",
            },
            duration: "PT1H25M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "4S",
              at: "2021-08-31T07:35:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2021-08-31T09:05:00",
            },
            carrierCode: "IB",
            number: "3170",
            aircraft: {
              code: "359",
            },
            operating: {
              carrierCode: "IB",
            },
            duration: "PT2H30M",
            id: "28",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "77065.00",
      base: "45684.00",
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
      grandTotal: "77065.00",
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["IB"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "77065.00",
          base: "45684.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "3",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "4",
            cabin: "ECONOMY",
            fareBasis: "ARYNVY",
            brandedFare: "BAGSEAT",
            class: "A",
            includedCheckedBags: {
              quantity: 1,
            },
          },
          {
            segmentId: "28",
            cabin: "ECONOMY",
            fareBasis: "OZ0S",
            brandedFare: "NOBAG",
            class: "O",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "17",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "18",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "19",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "20",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "21",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "22",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "23",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "24",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "79530.00",
      base: "10850.00",
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
      grandTotal: "79530.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "79530.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "25",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "26",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "27",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "28",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "29",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "30",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "31",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "32",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "80708.00",
      base: "8566.00",
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
      grandTotal: "80708.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "80708.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "33",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT5H10M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "20",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-08-31T17:10:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T17:55:00",
            },
            carrierCode: "LX",
            number: "326",
            aircraft: {
              code: "223",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H45M",
            id: "21",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "84740.00",
      base: "10850.00",
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
      grandTotal: "84740.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "84740.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "20",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "21",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "34",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT18H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T13:45:00",
            },
            arrival: {
              iataCode: "ZRH",
              at: "2021-08-31T16:00:00",
            },
            carrierCode: "LX",
            number: "2021",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT2H15M",
            id: "35",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "ZRH",
              at: "2021-09-01T06:55:00",
            },
            arrival: {
              iataCode: "LCY",
              at: "2021-09-01T07:35:00",
            },
            carrierCode: "LX",
            number: "450",
            aircraft: {
              code: "221",
            },
            operating: {
              carrierCode: "LX",
            },
            duration: "PT1H40M",
            id: "36",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "84740.00",
      base: "10850.00",
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
      grandTotal: "84740.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "84740.00",
          base: "10850.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "35",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "36",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "35",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT4H55M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T17:35:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T19:50:00",
            },
            carrierCode: "SN",
            number: "3728",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "37",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "38",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "85918.00",
      base: "8566.00",
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
      grandTotal: "85918.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "85918.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "37",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "38",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "36",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT23H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "16",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-25T09:25:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-25T11:50:00",
            },
            carrierCode: "SN",
            number: "3721",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "17",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H50M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:40:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "SN",
            number: "3722",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H15M",
            id: "33",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-31T21:20:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:30:00",
            },
            carrierCode: "SN",
            number: "2103",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "34",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "85918.00",
      base: "8566.00",
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
      grandTotal: "85918.00",
      additionalServices: [
        {
          amount: "29052",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "85918.00",
          base: "8566.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "16",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "17",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "33",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "34",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "37",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "38",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "39",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT4H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "12",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "13",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "12",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "13",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "40",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "41",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "42",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "43",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT9H",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T14:20:00",
            },
            arrival: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-24T16:45:00",
            },
            carrierCode: "SN",
            number: "3727",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H25M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT10H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "31",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T22:00:00",
            },
            carrierCode: "LH",
            number: "4402",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "32",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "2",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "31",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "32",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "44",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "45",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "46",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "47",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT11H20M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T11:05:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T13:15:00",
            },
            carrierCode: "SN",
            number: "2094",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "7",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT10H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "31",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T22:00:00",
            },
            carrierCode: "LH",
            number: "4402",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "32",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "6",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "7",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "31",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "32",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "48",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT7H5M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "18",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "19",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "18",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "19",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "49",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT12H15M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T07:15:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T09:45:00",
            },
            carrierCode: "LH",
            number: "1807",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "22",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T17:30:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T18:30:00",
            },
            carrierCode: "LH",
            number: "2486",
            aircraft: {
              code: "CR9",
            },
            operating: {
              carrierCode: "CL",
            },
            duration: "PT2H",
            id: "23",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "22",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "23",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
  {
    type: "flight-offer",
    id: "50",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2021-08-22",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT15H40M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-24T06:45:00",
            },
            arrival: {
              iataCode: "BRU",
              at: "2021-08-24T08:55:00",
            },
            carrierCode: "SN",
            number: "2104",
            aircraft: {
              code: "320",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT1H10M",
            id: "14",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "BRU",
              at: "2021-08-24T20:55:00",
            },
            arrival: {
              iataCode: "MAD",
              at: "2021-08-24T23:25:00",
            },
            carrierCode: "SN",
            number: "3731",
            aircraft: {
              code: "319",
            },
            operating: {
              carrierCode: "SN",
            },
            duration: "PT2H30M",
            id: "15",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
      {
        duration: "PT9H35M",
        segments: [
          {
            departure: {
              iataCode: "MAD",
              terminal: "1",
              at: "2021-08-31T12:25:00",
            },
            arrival: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T14:55:00",
            },
            carrierCode: "LH",
            number: "1801",
            aircraft: {
              code: "32N",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H30M",
            id: "29",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: {
              iataCode: "MUC",
              terminal: "2",
              at: "2021-08-31T20:00:00",
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2021-08-31T21:00:00",
            },
            carrierCode: "LH",
            number: "4404",
            aircraft: {
              code: "321",
            },
            operating: {
              carrierCode: "LH",
            },
            duration: "PT2H",
            id: "30",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: {
      currency: "NGN",
      total: "86139.00",
      base: "11992.00",
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
      grandTotal: "86139.00",
      additionalServices: [
        {
          amount: "14526",
          type: "CHECKED_BAGS",
        },
      ],
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: ["SN"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "NGN",
          total: "86139.00",
          base: "11992.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "14",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "15",
            cabin: "ECONOMY",
            fareBasis: "K03LGTE8",
            brandedFare: "LIGHT",
            class: "K",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "29",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
          {
            segmentId: "30",
            cabin: "ECONOMY",
            fareBasis: "L03LGTE8",
            brandedFare: "LIGHT",
            class: "L",
            includedCheckedBags: {
              quantity: 0,
            },
          },
        ],
      },
    ],
  },
];
