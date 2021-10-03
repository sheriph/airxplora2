import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { lowerCase, startCase, trim } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import {
  farerules_,
  flightOffer_,
  included_,
  order_,
  xpaDictionary_,
} from "../../lib/state";
import DetailedTripInfo from "../searchresults/detailedtripinfo";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import Loader from "../others/loader";
import {
  axiosAirxplora,
  getCookie,
  getMoreOrderData,
  sendEmail,
  useMoney,
} from "../../lib/utilities";
import { useSnackbar } from "notistack";
import CustomizedDialogs from "../others/dialog";
import { uniqBy } from "lodash";
import dayjs from "dayjs";

export default function MyBooking() {
  const [included, setIncluded] = useRecoilState(included_);
  const [order, setOrder] = useRecoilState(order_);
  const [flightOffer, setOffer] = useRecoilState(flightOffer_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);
  const [isLoading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [fareRules, setRules] = useRecoilState(farerules_);

  let dialogText;

  try {
    let fareRules = uniqBy(
      Object.values(included["detailed-fare-rules"]),
      (value) => value.fareBasis
    );
    dialogText = fareRules.map((item, index) => ({
      ...item,
      fareNotes: item.fareNotes.descriptions.filter(
        (des) => des.descriptionType === "PENALTIES"
      ),
    }));
  } catch (error) {
    // console.log(`fare rules error`, error);
  }



  const onSubmit = async (data) => {
    //eJzTd9f3cg%2F18HEBAAtYAmQ%3D
    const { surname, reference } = data;
    console.log(`data`, data, surname, reference);

    try {
      setLoading(true);
      const response = await getMoreOrderData(
        trim(surname.toLocaleUpperCase()),
        trim(reference.toLocaleUpperCase())
      );
      console.log(`response`, response);
      const { id, dictionary, flightOffer } = response.data;
      let config = {
        method: "get",
        url: `https://test.api.amadeus.com/v1/booking/flight-orders/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("access_token")
          )}`,
        },
      };
      const orderResponse = await axiosAirxplora(config, 2);
      console.log(`orderResponse`, orderResponse);
      setOffer(flightOffer);
      setDictionary(dictionary);
      setOrder(orderResponse.data.data);
    } catch (error) {
      console.log(`booking retrieval error`, error);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

/*   useEffect(() => {
    if (window !== undefined) {
      console.log(`working`);
      sendEmail(theOrder, theDictionary, theDialogText);
    }
  }, [null]); */

  if (!order) {
    return (
      <Paper component="form" onSubmit={handleSubmit(onSubmit)}>
        <Loader open={isLoading} />
        <CustomizedDialogs
          handleClose={() => setOpen(false)}
          open={open}
          title="Record Not Found"
        >
          <Typography gutterBottom>
            Sorry we could not find this booking ---
          </Typography>
          <Typography gutterBottom>
            This could mean any of the following
          </Typography>
          <Typography gutterBottom>
            Invalid Booking Reference and or surname
          </Typography>
          <Typography gutterBottom>
            Canceled Booking: Airline have rights to cancel unpaid bookings and
            this might just mean that you need to rebook another flight
          </Typography>
          <Typography gutterBottom>Network issue: You can try again</Typography>
        </CustomizedDialogs>
        <Grid component={Container} spacing={2} container>
          <Grid item xs={12}>
            <Typography align="center">Check Your Booking</Typography>
          </Grid>
          <Grid item xs={12} sm>
            <Controller
              name="surname"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  onChange={onChange}
                  size="small"
                  fullWidth
                  value={value}
                  id="surname"
                  label="Surname"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm>
            <Controller
              name="reference"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  size="small"
                  fullWidth
                  onChange={onChange}
                  value={value}
                  id="reference"
                  label="Reference"
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>
        <Box>
          <Grid
            container
            justifyContent="center"
            // style={{ marginBottom: "10px" }}
          >
            <Button
              color="primary"
              variant="contained"
              size="large"
              style={{
                position: "relative",
                top: "20px",
                borderRadius: "20px",
                textTransform: "capitalize",
              }}
              startIcon={<SearchIcon />}
              type="submit"
            >
              Search
            </Button>
          </Grid>
        </Box>
      </Paper>
    );
  }

  const { associatedRecords, contacts, ticketingAgreement, travelers } = order;

  /* console.log(
    `order`,
    order,
    travelers,
    contacts,
    dictionary,
    flightOffer,
    dialogText
  ); */

  useEffect(() => {
    if (window !== undefined && order && dictionary && fareRules)
      sendEmail(order, dictionary, fareRules);
  }, [null]);

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
                For Online Payment, please click PAY NOW button below
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
        />
      </Grid>
    </Grid>
  );
}
const theOrder = {
  type: "flight-order",
  id: "eJzTd9f39XPy8A8HAAtaAnE%3D",
  associatedRecords: [
    {
      reference: "MNBHOW",
      creationDate: "2021-09-23T20:02:00.000",
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
      lastTicketingDate: "2021-09-24",
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: "LGW",
                terminal: "N",
                at: "2021-09-30T10:05:00",
              },
              arrival: {
                iataCode: "MAD",
                terminal: "4S",
                at: "2021-09-30T13:30:00",
              },
              carrierCode: "UX",
              number: "1014",
              aircraft: {
                code: "73H",
              },
              operating: {},
              id: "44",
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
                at: "2021-10-20T07:35:00",
              },
              arrival: {
                iataCode: "LGW",
                terminal: "N",
                at: "2021-10-20T09:00:00",
              },
              carrierCode: "UX",
              number: "1013",
              aircraft: {
                code: "73H",
              },
              operating: {},
              id: "110",
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
        total: "31657.00",
        base: "6275.00",
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
        grandTotal: "31657.00",
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
            total: "31657.00",
            base: "6275.00",
            taxes: [
              {
                amount: "7416.00",
                code: "GB",
              },
              {
                amount: "7274.00",
                code: "JD",
              },
              {
                amount: "302.00",
                code: "OG",
              },
              {
                amount: "1645.00",
                code: "QV",
              },
              {
                amount: "8745.00",
                code: "UB",
              },
            ],
            refundableTaxes: "25382.00",
          },
          fareDetailsBySegment: [
            {
              segmentId: "44",
              cabin: "ECONOMY",
              fareBasis: "ZFLY5L",
              brandedFare: "LITE",
              class: "Z",
              includedCheckedBags: {
                quantity: 0,
              },
            },
            {
              segmentId: "110",
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
        firstName: "SHERIFF",
        lastName: "ADENIYI",
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
        emailAddress: "sheriph4real@gmail.com",
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
        firstName: "XXXX XXXXX",
      },
      address: {
        lines: ["XXX XXX XXX"],
        postalCode: "23401",
        countryCode: "NG",
        cityName: "Ikeja",
      },
      purpose: "STANDARD",
      phones: [
        {
          deviceType: "MOBILE",
          countryCallingCode: "234",
          number: "08087164862",
        },
      ],
      companyName: "NAIJAGOINGABROAD LTD",
      emailAddress: "info@naijagoingabroad.com",
    },
  ],
};

const theDictionary = {
  locations: {
    LCY: {
      cityCode: "LON",
      countryCode: "GB",
    },
    BRU: {
      cityCode: "BRU",
      countryCode: "BE",
    },
    CDG: {
      cityCode: "PAR",
      countryCode: "FR",
    },
    AMS: {
      cityCode: "AMS",
      countryCode: "NL",
    },
    BCN: {
      cityCode: "BCN",
      countryCode: "ES",
    },
    PMI: {
      cityCode: "PMI",
      countryCode: "ES",
    },
    MAD: {
      cityCode: "MAD",
      countryCode: "ES",
    },
    FCO: {
      cityCode: "ROM",
      countryCode: "IT",
    },
    FRA: {
      cityCode: "FRA",
      countryCode: "DE",
    },
    LIS: {
      cityCode: "LIS",
      countryCode: "PT",
    },
    LHR: {
      cityCode: "LON",
      countryCode: "GB",
    },
    MUC: {
      cityCode: "MUC",
      countryCode: "DE",
    },
    LGW: {
      cityCode: "LON",
      countryCode: "GB",
    },
  },
  aircraft: {
    318: "AIRBUS A318",
    319: "AIRBUS A319",
    320: "AIRBUS A320",
    321: "AIRBUS A321",
    330: "AIRBUS INDUSTRIE A330",
    332: "AIRBUS A330-200",
    343: "AIRBUS A340-300",
    359: "AIRBUS A350-900",
    734: "BOEING 737-400",
    738: "BOEING 737-800",
    744: "BOEING 747-400",
    777: "BOEING 777-200/300",
    E95: "EMBRAER 195",
    "32A": "AIRBUS A320 (SHARKLETS)",
    "73H": "BOEING 737-800 (WINGLETS)",
    "73J": "BOEING 737-900",
    "32N": "AIRBUS A320NEO",
    "32Q": "AIRBUS A321NEO",
    "32S": "AIRBUS INDUSTRIE A318/A319/A320/A321",
    E90: "EMBRAER 190",
  },
  currencies: {
    NGN: "NIGERIAN NAIRA",
  },
  carriers: {
    KL: "KLM ROYAL DUTCH AIRLINES",
    "6X": "AMADEUS SIX",
    UX: "AIR EUROPA",
    VY: "VUELING AIRLINES",
    AF: "AIR FRANCE",
    I2: "IBERIA EXPRESS",
    IB: "IBERIA",
    AZ: "ALITALIA S.P.A. IN A.S",
    NI: "PORTUGALIA",
    SN: "BRUSSELS AIRLINES",
    TP: "TAP PORTUGAL",
    LH: "LUFTHANSA",
    BA: "BRITISH AIRWAYS",
  },
};

const theDialogText = [
  {
    fareBasis: "ZFLY5L",
    name: "ECONOMY RT UNBUNDLED",
    fareNotes: [
      {
        descriptionType: "PENALTIES",
        text: "PE.PENALTIES FROM/TO AREA 2 FOR ECONOMY RT UNBUNDLED FARES \nCANCELLATIONS \nTICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW. \nANY TIME TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND. \nCHANGES \nCHANGES NOT PERMITTED IN CASE OF NO-SHOW. \nANY TIME CHARGE EUR 60.00 FOR REISSUE. CHILD/INFANT DISCOUNTS APPLY. \n\nNOTE - 1 FREE CHANGE PERMITTED WITHOUT PENALTY UP TO 7 DAYS BEFORE DEPARTURE \n\nNOTE - IN CASE OF PASSENGERS HOSPITAL ADMISSION OR DEATH OF PASSENGER OR FAMILY MEMBER PLEASE CONTACT WITH THE AIRLINE. CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET AND PERSON TO ALL PASSENGER TYPES. CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO ALL PASSENGER TYPES. ------------------------------ A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE CHANGE. IN CASE OF RESERVATION CHANGES AND REISSUE AFTER SCHEDULED FLIGHT CHANGES NOT PERMITED. OTHERWISE THE TICKET WILL ONLY BE VALID FOR REFUND IF APPLICABLE. ------------------------------ WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS WITH THE JOURNEY APPLIES. ------------------------------ WHEN COMBINING NON-REFUNDABLE FARES WITH A REFUNDABLE FARES 1-THE AMOUNT PAID ON EACH REFUNDABLE FARE COMPONENT IS REFUNDED 2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE COMPONENT WILL NOT BE REFUNDED 3-WHEN COMBINING FARES CHARGE THE SUM OF THE CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS ------------------------------ REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO THIRD PARTIES PERMITTED. ASSOCIATED CARRIER IMPOSED CHARGES WILL NOT BE REFUNDED. ------------------------------ REFUND AND CHANGES ARE PERMITTED WITHIN TICKET VALIDITY UNDER FARE CONDITIONS. ------------------------------ ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION PENALTY FROM A PREVIOUS TICKET REMAINS NON-REFUNDABLE FOLLOWING A CHANGE. ------------------------------ TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON. ---------------------------------------- ----REPRICING CONDITIONS ---- A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT FARE COMPONENT IS CHANGED THE ITINERARY MUST BE RE-PRICED USING CURRENT FARES IN EFFECT ON THE DATE THE TICKET IS REISSUED. B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE- PRICED USING HISTORICAL FARES IN EFFECT ON THE PREVIOUS TICKETING DATE OR USING CURRENT FARE IN EFFECT ON THE DATE THE TICKET IS REISSUED - WICHEVER IS LOWER. C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO CHANGES TO THE FIRST FARE COMPONENT BUT OTHER FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE PREVIOUS TICKETING DATE OR USING CURRENT FARES IN EFFECT ON THE DATE THE TICKET IS REISSUED - WHICHEVER IS LOWER. D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON THE PREVIOUS TICKETING DATE. ---------------------------------------- WHEN THE ITINERARY RESULT IN A HIGHER FARE THE DIFFERENCE WILL BE COLLECTED ANY APPLICABLE CHANGE FEE APPLIES. ---------------------------------------- WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE THE CHANGE FEE APPLIES AND NO CREDIT OF THE RESIDUAL AMOUNT WILL BE MADE. ",
      },
    ],
    segmentId: "44",
  },
];

