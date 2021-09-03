import { Box, Grid, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { lowerCase, startCase } from "lodash";
import { useRecoilState } from "recoil";
import { flightOffer_, order_, xpaDictionary_ } from "../../lib/state";
import DetailedTripInfo from "../searchresults/detailedtripinfo";

export default function MyBooking() {
  // const records = flightOrder?.data?.associatedRecords;
  const [order, setOrder] = useRecoilState(order_);
  const [flightOffer, setOffer] = useRecoilState(flightOffer_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);

  if (!order) return <Typography>Loading...</Typography>;

  const { associatedRecords, contacts, ticketingAgreement, travelers } = order;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography gutterBottom align="center" variant="h5">
          Booking Confirmation
        </Typography>
        {associatedRecords.map((record, index) => (
          <Typography key={index} align="center">
            {record.originSystemCode === "GDS"
              ? `Amadeus Reference`
              : `${startCase(
                  lowerCase(dictionary.carriers[record.originSystemCode])
                )} Reference`}{" "}
            : {record.reference}
          </Typography>
        ))}
        <Box>
          <Alert
            severity={
              ticketingAgreement.option === "CONFIRM" ? "success" : "warning"
            }
          >
            <AlertTitle>Status</AlertTitle>
            {ticketingAgreement.option === "CONFIRM" ? (
              "Confirmed Booking! This ticket is valid for travel"
            ) : (
              <span>
                Temporary Reservation (Please make payment soon to avoid
                cancelation) <br />
                For Bank Transfer: 0124782296 : Gtbank : NaijaGoingAbroad LTD{" "}
                <br />
                For Onlint Payment, please click PAY NOW button below
              </span>
            )}
          </Alert>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DetailedTripInfo
          ticketingAgreement={ticketingAgreement}
          associatedRecords={associatedRecords}
          travelers={travelers}
          contacts={contacts}
          dictionary={dictionary}
          flightOffer={flightOffer}
          handleClose={null}
          booked={true}
          flightOrder={flightOrder}
        />
      </Grid>
    </Grid>
  );
}

const flightOrder = {
  data: {
    type: "flight-order",
    id: "eJzTd9f3snQxc3EBAAqIAis%3D",
    associatedRecords: [
      {
        reference: "J9D6DD",
        creationDate: "2021-09-03T09:31:00.000",
        originSystemCode: "GDS",
        flightOfferId: "1",
      },
    ],
    flightOffers: [
      {
        type: "flight-offer",
        id: "1",
        source: "GDS",
        nonHomogeneous: false,
        lastTicketingDate: "2021-09-04",
        itineraries: [
          {
            segments: [
              {
                departure: {
                  iataCode: "LGW",
                  terminal: "N",
                  at: "2021-09-15T10:00:00",
                },
                arrival: {
                  iataCode: "MAD",
                  terminal: "4S",
                  at: "2021-09-15T13:30:00",
                },
                carrierCode: "UX",
                number: "1014",
                aircraft: {
                  code: "73H",
                },
                operating: {},
                id: "3",
                numberOfStops: 0,
                co2Emissions: [
                  {
                    weight: 125,
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
                  iataCode: "MAD",
                  terminal: "4S",
                  at: "2021-09-30T07:35:00",
                },
                arrival: {
                  iataCode: "LGW",
                  terminal: "N",
                  at: "2021-09-30T09:00:00",
                },
                carrierCode: "UX",
                number: "1013",
                aircraft: {
                  code: "73H",
                },
                operating: {},
                id: "5",
                numberOfStops: 0,
                co2Emissions: [
                  {
                    weight: 125,
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
          total: "74113.00",
          base: "13041.00",
          fees: [
            {
              amount: "0.00",
              type: "TICKETING",
            },
            {
              amount: "0.00",
              type: "SUPPLIER",
            },
            {
              amount: "0.00",
              type: "FORM_OF_PAYMENT",
            },
          ],
          grandTotal: "74113.00",
          billingCurrency: "NGN",
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
              total: "31509.00",
              base: "6237.00",
              taxes: [
                {
                  amount: "7372.00",
                  code: "GB",
                },
                {
                  amount: "7263.00",
                  code: "JD",
                },
                {
                  amount: "302.00",
                  code: "OG",
                },
                {
                  amount: "1642.00",
                  code: "QV",
                },
                {
                  amount: "8693.00",
                  code: "UB",
                },
              ],
              refundableTaxes: "25272.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "3",
                cabin: "ECONOMY",
                fareBasis: "ZFLY5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
              {
                segmentId: "5",
                cabin: "ECONOMY",
                fareBasis: "ZFLY5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
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
              total: "24137.00",
              base: "6237.00",
              taxes: [
                {
                  amount: "7263.00",
                  code: "JD",
                },
                {
                  amount: "302.00",
                  code: "OG",
                },
                {
                  amount: "1642.00",
                  code: "QV",
                },
                {
                  amount: "8693.00",
                  code: "UB",
                },
              ],
              refundableTaxes: "17900.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "3",
                cabin: "ECONOMY",
                fareBasis: "ZFLY5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
              {
                segmentId: "5",
                cabin: "ECONOMY",
                fareBasis: "ZFLY5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
            ],
          },
          {
            travelerId: "3",
            fareOption: "STANDARD",
            travelerType: "HELD_INFANT",
            associatedAdultId: "1",
            price: {
              currency: "NGN",
              total: "18467.00",
              base: "567.00",
              taxes: [
                {
                  amount: "7263.00",
                  code: "JD",
                },
                {
                  amount: "302.00",
                  code: "OG",
                },
                {
                  amount: "1642.00",
                  code: "QV",
                },
                {
                  amount: "8693.00",
                  code: "UB",
                },
              ],
              refundableTaxes: "17900.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "3",
                cabin: "ECONOMY",
                fareBasis: "ZFLY5L",
                brandedFare: "LITE",
                class: "Z",
                includedCheckedBags: {
                  quantity: 0,
                },
              },
              {
                segmentId: "5",
                cabin: "ECONOMY",
                fareBasis: "ZFLY5L",
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
    ],
    travelers: [
      {
        id: "1",
        dateOfBirth: "1990-01-01",
        gender: "MALE",
        name: {
          firstName: "dddd",
          lastName: "asddd",
        },
        documents: [
          {
            number: "A0123456",
            issuanceDate: "1990-01-01",
            expiryDate: "2050-01-01",
            issuanceCountry: "NG",
            issuanceLocation: "Lagos",
            nationality: "NG",
            documentType: "PASSPORT",
            holder: true,
          },
        ],
        contact: {
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: "9065369929",
            },
          ],
          emailAddress: "shsh@djdj.com",
        },
      },
      {
        id: "2",
        dateOfBirth: "2021-09-02",
        gender: "MALE",
        name: {
          firstName: "dddd",
          lastName: "dddd",
        },
        documents: [
          {
            number: "A0123456",
            issuanceDate: "1990-01-01",
            expiryDate: "2050-01-01",
            issuanceCountry: "NG",
            issuanceLocation: "Lagos",
            nationality: "NG",
            documentType: "PASSPORT",
            holder: true,
          },
        ],
        contact: {
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: "9065369929",
            },
          ],
          emailAddress: "shsh@djdj.com",
        },
      },
      {
        id: "3",
        dateOfBirth: "2021-09-02",
        gender: "FEMALE",
        name: {
          firstName: "dddd",
          lastName: "dddd",
        },
        documents: [
          {
            number: "A0123456",
            issuanceDate: "1990-01-01",
            expiryDate: "2050-01-01",
            issuanceCountry: "NG",
            issuanceLocation: "Lagos",
            nationality: "NG",
            documentType: "PASSPORT",
            holder: true,
          },
        ],
        contact: {
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: "9065369929",
            },
          ],
          emailAddress: "shsh@djdj.com",
        },
      },
    ],
    remarks: {
      general: [
        {
          subType: "GENERAL_MISCELLANEOUS",
          text: "ONLINE BOOKING FROM INCREIBLE VIAJES",
        },
      ],
    },
    ticketingAgreement: {
      option: "DELAY_TO_CANCEL",
      delay: "6D",
    },
    contacts: [
      {
        addresseeName: {
          firstName: "Sheriff Adeniyi",
        },
        address: {
          lines: ["Opebi Rd, 65c"],
          postalCode: "23401",
          countryCode: "NG",
          cityName: "Ikeja",
        },
        purpose: "STANDARD",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: "234",
            number: "9065369929",
          },
        ],
        companyName: "NAIJAGOINGABROAD LTD",
        emailAddress: "info@naijagoingabroad.com",
      },
    ],
  },
  dictionaries: {
    locations: {
      MAD: {
        cityCode: "MAD",
        countryCode: "ES",
      },
      LGW: {
        cityCode: "LON",
        countryCode: "GB",
      },
    },
  },
};

const flightOffer = {
  type: "flight-offer",
  id: "1",
  source: "GDS",
  instantTicketingRequired: false,
  nonHomogeneous: false,
  oneWay: false,
  lastTicketingDate: "2021-09-03",
  numberOfBookableSeats: 9,
  itineraries: [
    {
      duration: "PT2H30M",
      segments: [
        {
          departure: {
            iataCode: "LGW",
            terminal: "N",
            at: "2021-09-15T10:00:00",
          },
          arrival: {
            iataCode: "MAD",
            terminal: "4S",
            at: "2021-09-15T13:30:00",
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
          id: "3",
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
            at: "2021-09-30T07:35:00",
          },
          arrival: {
            iataCode: "LGW",
            terminal: "N",
            at: "2021-09-30T09:00:00",
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
          id: "5",
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    },
  ],
  price: {
    currency: "NGN",
    total: "74113.00",
    base: "13041.00",
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
    grandTotal: "74113.00",
    additionalServices: [
      {
        amount: "29148",
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
        total: "31509.00",
        base: "6237.00",
      },
      fareDetailsBySegment: [
        {
          segmentId: "3",
          cabin: "ECONOMY",
          fareBasis: "ZFLY5L",
          brandedFare: "LITE",
          class: "Z",
          includedCheckedBags: {
            quantity: 0,
          },
        },
        {
          segmentId: "5",
          cabin: "ECONOMY",
          fareBasis: "ZFLY5L",
          brandedFare: "LITE",
          class: "Z",
          includedCheckedBags: {
            quantity: 0,
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
        total: "24137.00",
        base: "6237.00",
      },
      fareDetailsBySegment: [
        {
          segmentId: "3",
          cabin: "ECONOMY",
          fareBasis: "ZFLY5L",
          brandedFare: "LITE",
          class: "Z",
        },
        {
          segmentId: "5",
          cabin: "ECONOMY",
          fareBasis: "ZFLY5L",
          brandedFare: "LITE",
          class: "Z",
        },
      ],
    },
    {
      travelerId: "3",
      fareOption: "STANDARD",
      travelerType: "HELD_INFANT",
      associatedAdultId: "1",
      price: {
        currency: "NGN",
        total: "18467.00",
        base: "567.00",
      },
      fareDetailsBySegment: [
        {
          segmentId: "3",
          cabin: "ECONOMY",
          fareBasis: "ZFLY5L",
          brandedFare: "LITE",
          class: "Z",
        },
        {
          segmentId: "5",
          cabin: "ECONOMY",
          fareBasis: "ZFLY5L",
          brandedFare: "LITE",
          class: "Z",
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
    LIS: {
      cityCode: "LIS",
      countryCode: "PT",
    },
    LHR: {
      cityCode: "LON",
      countryCode: "GB",
    },
    LGW: {
      cityCode: "LON",
      countryCode: "GB",
    },
  },
  aircraft: {
    320: "AIRBUS A320",
    "73H": "BOEING 737-800 (WINGLETS)",
    E90: "EMBRAER 190",
    "32N": "AIRBUS A320NEO",
  },
  currencies: {
    NGN: "NIGERIAN NAIRA",
  },
  carriers: {
    UX: "AIR EUROPA",
    NI: "PORTUGALIA",
    TP: "TAP PORTUGAL",
  },
};

const submittedData = {
  phone: 9065369929,
  email: "shsh@djdj.com",
  "gender-ADULT-1": "Mr",
  "surname-ADULT-1": "asddd",
  "othernames-ADULT-1": "dddd",
  "gender-CHILD-2": "Mr",
  "surname-CHILD-2": "dddd",
  "othernames-CHILD-2": "dddd",
  "dob-CHILD-2": "2021-09-02T21:16:47.977Z",
  "gender-HELD_INFANT-3": "Mrs",
  "surname-HELD_INFANT-3": "dddd",
  "othernames-HELD_INFANT-3": "dddd",
  "dob-HELD_INFANT-3": "2021-09-02T21:16:47.978Z",
};
