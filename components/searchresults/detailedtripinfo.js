import { Box } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TripDetailHeader from "./tripdetailheader";
import TripStop from "./tripstop";
import FlightIcon from "@material-ui/icons/Flight";
import { Typography } from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { Divider } from "@material-ui/core";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import dayjs from "dayjs";
import {
  getAirportName,
  getBaggage,
  getCabin,
  getLayover,
} from "../../lib/utilities";
import duration from "dayjs/plugin/duration";
import { lowerCase, startCase } from "lodash";
import { flightOfferExtended_ } from "../../lib/state";
import { useRecoilState } from "recoil";

export default function DetailedTripInfo({
  flightOffer,
  dictionary,
  handleClose,
}) {
  if (!flightOffer) return <>...</>;
  const [cookies, setCookie] = useCookies(["xpaformData", "xpaMultiTrip"]);
  console.log(`cookies`, cookies.xpaformData);
  const tripType = cookies?.xpaformData?.tripType;
  console.log(`flightOffer`, flightOffer, dictionary);
  dayjs.extend(duration);
  const [flightOfferExtended, setOfferExtended] =
    useRecoilState(flightOfferExtended_);

  const { aircraft, carriers } = dictionary;

  const {
    itineraries,
    price: { grandTotal },
    travelerPricings: [firstTraveller, ...rest],
    travelerPricings,
  } = flightOffer;
  const { fareDetailsBySegment } = firstTraveller;

  useEffect(() => {}, [null]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <TripDetailHeader
          grandTotal={grandTotal}
          flightOffer={flightOffer}
          travelerPricings={travelerPricings}
          handleClose={handleClose}
        />
      </Grid>
      {flightOffer.itineraries.map((itinerary, itineraryIndex, itineraries) => {
        const { duration, segments } = itinerary;
        return (
          <Grid item xs={12} key={itineraryIndex}>
            {segments.map((segment, segmentIndex, segments) => {
              const from = segments[0].departure.iataCode;
              const to = segments[segments.length - 1].arrival.iataCode;
              return (
                <Grid container key={segmentIndex}>
                  {segmentIndex === 0 && (
                    <Grid component={Box} pt={3} item xs={12}>
                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Grid
                            container
                            alignItems="center"
                            alignContent="center"
                          >
                            <Grid item>
                              <FlightIcon
                                style={{
                                  transform:
                                    tripType === "Return Trip" &&
                                    itineraryIndex === 0
                                      ? "rotate(145deg)"
                                      : "rotate(320deg)",
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography>
                                {getAirportName(from, "cityName")} -{" "}
                                {getAirportName(to, "cityName")}
                              </Typography>
                              {/* <Typography>
                                {startCase(
                                  lowerCase(
                                    `${getAirportName(from, "cityName")}`
                                  )
                                )}
                                {" - "}
                                {startCase(
                                  lowerCase(`${getAirportName(to, "cityName")}`)
                                )}
                              </Typography> */}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            alignItems="center"
                            alignContent="center"
                          >
                            <Grid item>
                              <AccessTimeIcon color="primary" />
                            </Grid>
                            <Grid item>
                              <Typography>
                                {duration.slice(2).toLocaleLowerCase()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box pt={1} pb={3}>
                      <TripStop
                        baggage={getBaggage(
                          flightOfferExtended,
                          segment.id,
                          flightOfferExtended?.pricingOptions
                            ?.includedCheckedBagsOnly
                        )}
                        // firstLeg={segmentIndex === 0 ? true : false}
                        lastLeg={
                          segments.length - 1 === segmentIndex ? true : false
                        }
                        // airportName={segment.departure.iataCode}
                        depart={dayjs(segment.departure.at).format(
                          "h:mma, ddd DD MMM"
                        )}
                        depAirport={getAirportName(
                          segment.departure.iataCode,
                          "airportName"
                        )}
                        arrive={dayjs(segment.arrival.at).format(
                          "h:mma, ddd DD MMM"
                        )}
                        arrAirport={getAirportName(
                          segment.arrival.iataCode,
                          "airportName"
                        )}
                        cabin={getCabin(segment.id, fareDetailsBySegment)}
                        aircraftCode={aircraft[segment.aircraft.code]}
                        operatingCarrierCode={
                          carriers[segment.operating.carrierCode]
                        }
                        layover={getLayover(segment, segments, segmentIndex)}
                        carrierCode={segment.carrierCode}
                        carriers={carriers}
                      />
                    </Box>
                  </Grid>
                  {segments.length - 1 === segmentIndex &&
                    tripType === "Return Trip" &&
                    itineraryIndex === 0 && (
                      <Grid item xs={12}>
                        <Divider />
                        <Divider />
                        <Typography variant="caption" align="center">
                          RETURN FLIGHT
                        </Typography>
                      </Grid>
                    )}
                </Grid>
              );
            })}
          </Grid>
        );
      })}
    </Grid>
  );
}
/* 
const flightOffer = {
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
};
const dictionary = {
  locations: {
    MAD: {
      cityCode: "MAD",
      countryCode: "ES",
    },
    ZRH: {
      cityCode: "ZRH",
      countryCode: "CH",
    },
    LCY: {
      cityCode: "LON",
      countryCode: "GB",
    },
    BRU: {
      cityCode: "BRU",
      countryCode: "BE",
    },
    LHR: {
      cityCode: "LON",
      countryCode: "GB",
    },
    MUC: {
      cityCode: "MUC",
      countryCode: "DE",
    },
    BCN: {
      cityCode: "BCN",
      countryCode: "ES",
    },
    LGW: {
      cityCode: "LON",
      countryCode: "GB",
    },
  },
  aircraft: {
    221: "AIRBUS  A220-100",
    223: "AIRBUS  A220-300",
    319: "AIRBUS A319",
    320: "AIRBUS A320",
    321: "AIRBUS A321",
    330: "AIRBUS INDUSTRIE A330",
    359: "AIRBUS A350-900",
    CR9: "CANADAIR REGIONAL JET 900",
    "73H": "BOEING 737-800 (WINGLETS)",
    "32N": "AIRBUS A320NEO",
  },
  currencies: {
    NGN: "NIGERIAN NAIRA",
  },
  carriers: {
    UX: "AIR EUROPA",
    VY: "VUELING AIRLINES",
    IB: "IBERIA",
    CL: "LUFTHANSA CITYLINE",
    SN: "BRUSSELS AIRLINES",
    LX: "SWISS INTERNATIONAL AIR LINES",
    LH: "LUFTHANSA",
  },
};

const flightOfferMulti = {
  type: "flight-offer",
  id: "1",
  source: "GDS",
  instantTicketingRequired: false,
  nonHomogeneous: false,
  oneWay: false,
  lastTicketingDate: "2021-08-24",
  numberOfBookableSeats: 7,
  itineraries: [
    {
      duration: "PT5H15M",
      segments: [
        {
          departure: {
            iataCode: "LHR",
            terminal: "2",
            at: "2021-08-24T17:10:00",
          },
          arrival: {
            iataCode: "AMS",
            at: "2021-08-24T19:35:00",
          },
          carrierCode: "KL",
          number: "1022",
          aircraft: {
            code: "73H",
          },
          operating: {
            carrierCode: "KL",
          },
          duration: "PT1H25M",
          id: "3",
          numberOfStops: 0,
          blacklistedInEU: false,
        },
        {
          departure: {
            iataCode: "AMS",
            at: "2021-08-24T20:50:00",
          },
          arrival: {
            iataCode: "MAD",
            terminal: "2",
            at: "2021-08-24T23:25:00",
          },
          carrierCode: "KL",
          number: "113",
          aircraft: {
            code: "73H",
          },
          operating: {
            carrierCode: "KL",
          },
          duration: "PT2H35M",
          id: "4",
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
    {
      duration: "PT8H10M",
      segments: [
        {
          departure: {
            iataCode: "MAD",
            terminal: "1",
            at: "2021-08-28T11:15:00",
          },
          arrival: {
            iataCode: "JFK",
            terminal: "4",
            at: "2021-08-28T13:25:00",
          },
          carrierCode: "AF",
          number: "3668",
          aircraft: {
            code: "76W",
          },
          operating: {
            carrierCode: "DL",
          },
          duration: "PT8H10M",
          id: "19",
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
    {
      duration: "PT13H35M",
      segments: [
        {
          departure: {
            iataCode: "JFK",
            terminal: "1",
            at: "2021-08-31T21:30:00",
          },
          arrival: {
            iataCode: "FCO",
            terminal: "3",
            at: "2021-09-01T12:10:00",
          },
          carrierCode: "AZ",
          number: "611",
          aircraft: {
            code: "330",
          },
          operating: {
            carrierCode: "AZ",
          },
          duration: "PT8H40M",
          id: "30",
          numberOfStops: 0,
          blacklistedInEU: false,
        },
        {
          departure: {
            iataCode: "FCO",
            terminal: "1",
            at: "2021-09-01T14:15:00",
          },
          arrival: {
            iataCode: "LHR",
            terminal: "2",
            at: "2021-09-01T16:05:00",
          },
          carrierCode: "AZ",
          number: "204",
          aircraft: {
            code: "32S",
          },
          operating: {
            carrierCode: "AZ",
          },
          duration: "PT2H50M",
          id: "31",
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
  ],
  price: {
    currency: "NGN",
    total: "653799.00",
    base: "483112.00",
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
    grandTotal: "653799.00",
  },
  pricingOptions: {
    fareType: ["PUBLISHED"],
    includedCheckedBagsOnly: true,
  },
  validatingAirlineCodes: ["AF"],
  travelerPricings: [
    {
      travelerId: "1",
      fareOption: "STANDARD",
      travelerType: "ADULT",
      price: {
        currency: "NGN",
        total: "653799.00",
        base: "483112.00",
      },
      fareDetailsBySegment: [
        {
          segmentId: "3",
          cabin: "ECONOMY",
          fareBasis: "KS00AESX",
          class: "K",
          includedCheckedBags: {
            quantity: 1,
          },
        },
        {
          segmentId: "4",
          cabin: "ECONOMY",
          fareBasis: "KS00AESX",
          class: "K",
          includedCheckedBags: {
            quantity: 1,
          },
        },
        {
          segmentId: "19",
          cabin: "ECONOMY",
          fareBasis: "KS00AESX",
          class: "K",
          includedCheckedBags: {
            quantity: 1,
          },
        },
        {
          segmentId: "30",
          cabin: "ECONOMY",
          fareBasis: "SLXLGUE",
          class: "S",
          includedCheckedBags: {
            quantity: 1,
          },
        },
        {
          segmentId: "31",
          cabin: "ECONOMY",
          fareBasis: "SLXLGUE",
          class: "S",
          includedCheckedBags: {
            quantity: 1,
          },
        },
      ],
    },
  ],
};
 */
