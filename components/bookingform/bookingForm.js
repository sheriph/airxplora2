import {
  Box,
  Button,
  Collapse,
  Fab,
  Grid,
  makeStyles,
  Paper,
  useMediaQuery,
} from "@material-ui/core";
import { Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ClassSelector from "../bookingform/classselector";
import PassengerSelector from "../bookingform/passengerselector";
import TripSelector from "../bookingform/tripselector";
import { MyDate, RetDate } from "./dates";
import SearchIcon from "@material-ui/icons/Search";
import Search from "./search";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import {
  commissions_,
  defaultExpanded_,
  isReturnTrip_,
  tab_,
  tripType_,
  xpaCarriers_,
  xpaDictionary_,
  xpaOffersFixed_,
  xpaOffers_,
} from "../../lib/state";
import dayjs from "dayjs";
import Alert from "@material-ui/lab/Alert";
import MultiTrips from "./multitrip";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { findKey, keys, pick, valuesIn } from "lodash";
import {
  getBookingClass,
  getFlightOffers,
  getMultiTripsData,
  getOriginDestinations,
  getTravellers,
  updateFlightOffer,
} from "../../lib/utilities";
import Loader from "../others/loader";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

const styles = makeStyles((theme) => ({
  paperRoot: { padding: theme.spacing(2) },
  collapseRoot: { width: "-webkit-fill-available" },
}));

export default function BookingForm({ square = false }) {
  const classes = styles();
  const mobile320 = useMediaQuery("(max-width:320px)");
  const [multitripCounter, setMultitripCounter] = useState([{}]);
  const [isLoading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["xpaformData", "xpaMultiTrip"]);
  const [tab, setTab] = useRecoilState(tab_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);
  const [carriers, setCarriers] = useRecoilState(xpaCarriers_);
  const [flightOffers, setOffers] = useRecoilState(xpaOffers_);
  const [flightOffersFixed, setOffersFixed] = useRecoilState(xpaOffersFixed_);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [count, setCount] = useState(1);
  const [defaultExpanded, setDefaultExpanded] =
    useRecoilState(defaultExpanded_);

  const [commissions, setCommissions] = useRecoilState(commissions_);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (cookies.xpaformData) {
      const { depDate, retDate, from, to, tripType, passengers, bookingClass } =
        cookies.xpaformData;
      setValue("depDate", dayjs(depDate));
      setValue("retDate", dayjs(retDate));
      setValue("from", from);
      setValue("to", to);
      setValue("tripType", tripType);
      setValue("passengers", passengers);
      setValue("bookingClass", bookingClass);
    } else {
      setValue("tripType", "Return Trip");
    }
  }, [null]);

  const onSubmit = async (data) => {
    console.log("submit data", data, count);
    const { depDate, retDate, from, to, tripType, bookingClass, passengers } =
      data;

    let multTripItinerary;

    switch (tripType) {
      case "Multi-City":
        const multiTripData = getMultiTripsData(data);
        for (let i = 0; i < multiTripData.length; i++) {
          const { from, to } = multiTripData[i];
          if (!from) {
            setError(
              `fromError${i + 1}`,
              { types: { required: true } },
              { shouldFocus: true }
            );
            setTimeout(() => clearErrors(`fromError${i + 1}`), 500);
            return;
          }
          if (!to) {
            setError(
              `toError${i + 1}`,
              { types: { required: true } },
              { shouldFocus: true }
            );
            setTimeout(() => clearErrors(`toError${i + 1}`), 500);
            return;
          }
        }
        console.log("multi success", multiTripData);

        multTripItinerary = multiTripData;
        setCookie("xpaMultiTrip", multiTripData);
        break;

      default:
        if (from.iataCode === to.iataCode) {
          setError("to", {}, { shouldFocus: true });
          setTimeout(() => clearErrors("to"), 500);
          return;
        }
        if (
          retDate &&
          depDate.toDate().toLocaleDateString() ===
            retDate.toDate().toLocaleDateString()
        ) {
          setError("retDate", {}, { shouldFocus: true });
          setTimeout(() => clearErrors("retDate"), 500);
          return;
        }
        console.log("submit success", data);
        break;
    }
    setCookie("xpaformData", data);
    const postData = {
      currencyCode: "NGN",
      originDestinations: getOriginDestinations(
        data,
        tripType,
        multTripItinerary
      ),
      searchCriteria: {
        maxFlightOffers: 250,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: getBookingClass(bookingClass),
              coverage: "MOST_SEGMENTS",
              originDestinationIds: ["1"],
            },
          ],
          carrierRestrictions: {
            excludedCarrierCodes: ["Z0"],
          },
        },
      },
      sources: ["GDS"],
      travelers: getTravellers(passengers),
    };
    console.log("postData", postData);
    try {
      setLoading(true);
      const response = await getFlightOffers(postData);
      // console.log("response", response);
      const {
        data,
        dictionaries: { carriers },
        dictionaries,
      } = response;
      setDictionary(dictionaries);
      const updateFlightOffers = data.map((flightOffer) =>
        updateFlightOffer(flightOffer, commissions)
      );
      setOffers(updateFlightOffers);
      setOffersFixed(updateFlightOffers);
      setCarriers(carriers);
      window.sessionStorage.setItem("xpaOffers", JSON.stringify(response));
      setLoading(false);
      setDefaultExpanded(false);
      setTab("2");
    } catch (error) {
      console.log("error", error);
      enqueueSnackbar(`${error.message}`, {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      setLoading(false);
      setCount(count + 1);
      if (count < 3) onSubmit(data);
    }
  };

  console.log("render BookingForm");
  return (
    <Box style={{ width: "100%" }}>
      <Loader open={isLoading} />
      <Paper square={square} className={classes.paperRoot}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item container spacing={mobile320 ? 1 : 2}>
              <Grid item>
                <Controller
                  name="tripType"
                  control={control}
                  defaultValue="Return Trip"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TripSelector onChange={onChange} value={value} />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name="passengers"
                  control={control}
                  defaultValue={[
                    { type: "Adult", count: 1 },
                    { type: "Children", count: 0 },
                    { type: "Infant", count: 0 },
                  ]}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <PassengerSelector onChange={onChange} value={value} />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name="bookingClass"
                  control={control}
                  defaultValue="Economy"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <ClassSelector onChange={onChange} value={value} />
                  )}
                />
              </Grid>
            </Grid>
            {watch("tripType") !== "Multi-City" && (
              <Grid item container spacing={1}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={watch("tripType") === "Return Trip" ? 4 : 5}
                  container
                >
                  <Controller
                    name="from"
                    control={control}
                    defaultValue={null}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Search
                        placeHolder="From Where ?"
                        isFrom={true}
                        isTo={false}
                        onChange={onChange}
                        value={value}
                        isError={errors.from ? true : false}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={watch("tripType") === "Return Trip" ? 4 : 5}
                  container
                >
                  <Controller
                    name="to"
                    control={control}
                    defaultValue={null}
                    //  rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Search
                        placeHolder="Where To ?"
                        isFrom={false}
                        isTo={true}
                        onChange={onChange}
                        value={value}
                        isError={errors.to ? true : false}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={watch("tripType") === "Return Trip" ? 6 : 12}
                  md={2}
                  container
                >
                  <Controller
                    name="depDate"
                    control={control}
                    defaultValue={dayjs()}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <MyDate
                        isError={errors.depDate ? true : false}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Grid>
                {watch("tripType") === "Return Trip" && (
                  <Grid item xs={6} md={2} container>
                    <Controller
                      name="retDate"
                      control={control}
                      defaultValue={dayjs()}
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <RetDate
                          onChange={onChange}
                          value={value}
                          depDate={watch("depDate")}
                          isError={errors.retDate ? true : false}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            )}
            {watch("tripType") === "Multi-City" && (
              <Grid item container spacing={5}>
                {multitripCounter.map((item, i) => (
                  <Grid item container spacing={1} key={i}>
                    <Controller
                      name={`multi${i + 1}`}
                      control={control}
                      defaultValue={item}
                      rules={{ required: true }}
                      render={(data) => {
                        // console.log("passengers", data);
                        const { onChange, value } = data.field;
                        return (
                          <MultiTrips
                            tripCount={i + 1}
                            onChange={onChange}
                            value={value}
                            fromError={errors[`fromError${i + 1}`]}
                            toError={errors[`toError${i + 1}`]}
                          />
                        );
                      }}
                    />
                    {multitripCounter.length === i + 1 && (
                      <Box
                        style={{ marginLeft: "auto", marginRight: "auto" }}
                        p={2}
                      >
                        <Grid container spacing={2}>
                          <Grid item>
                            <Fab
                              onClick={() =>
                                setMultitripCounter([
                                  ...multitripCounter,
                                  watch(`multi${i + 1}`),
                                ])
                              }
                              color="primary"
                              aria-label="add"
                            >
                              <AddIcon />
                            </Fab>
                          </Grid>
                          <Grid item>
                            <Fab
                              onClick={() => {
                                let arr = [...multitripCounter];
                                arr.pop();
                                setMultitripCounter(arr);
                              }}
                              color="primary"
                              aria-label="add"
                              disabled={multitripCounter.length === 1}
                            >
                              <RemoveIcon />
                            </Fab>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
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
                top: "40px",
                borderRadius: "20px",
                textTransform: "capitalize",
              }}
              startIcon={<SearchIcon />}
              type="submit"
            >
              Search
            </Button>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

const flightOfferData = {
  currencyCode: "USD",
  originDestinations: [
    {
      id: "1",
      originLocationCode: "RIO",
      destinationLocationCode: "MAD",
      departureDateTimeRange: {
        date: "2021-11-01",
        time: "10:00:00",
      },
    },
    {
      id: "2",
      originLocationCode: "MAD",
      destinationLocationCode: "RIO",
      departureDateTimeRange: {
        date: "2021-11-05",
        time: "17:00:00",
      },
    },
  ],
  travelers: [
    {
      id: "1",
      travelerType: "ADULT",
    },
    {
      id: "2",
      travelerType: "CHILD",
    },
  ],
  sources: ["GDS"],
  searchCriteria: {
    maxFlightOffers: 2,
    flightFilters: {
      cabinRestrictions: [
        {
          cabin: "BUSINESS",
          coverage: "MOST_SEGMENTS",
          originDestinationIds: ["1"],
        },
      ],
      carrierRestrictions: {
        excludedCarrierCodes: ["AA", "TP", "AZ"],
      },
    },
  },
};

console.log(`flightOfferData`, flightOfferData);
