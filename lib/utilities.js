import axios from "axios";
import dayjs from "dayjs";
import { first, keys, last, pick, pickBy, valuesIn } from "lodash";
import { stringify } from "qs";
import { useEffect, useState } from "react";
import { lowerCase, startCase } from "lodash";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import * as yup from "yup";
import { Skeleton } from "@material-ui/lab";
import { Typography } from "@material-ui/core";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRD_CLIENT_BASE_URL
    : process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

export const axiosAirxplora = async (config, maxRetry) => {
  const { method, url, data } = config;
  console.log(`data`, data);
  let retryConfig = { ...config };
  // console.log("config :>> ", config);
  try {
    const instance = axios.create({ method: method });
    let counter = 0;
    instance.interceptors.response.use(null, async (error) => {
      console.log(`error`, error.response);
      if (counter < maxRetry) {
        console.log("number of try", counter);
        counter++;
        if (error.response.status === 401) {
          console.log(
            `access error, updating access_token....`,
            error.response
          );
          try {
            const accessToken = await getToken();
            console.log("response :>> ", accessToken);
            //update access_token
            window.localStorage.setItem(
              "access_token",
              JSON.stringify(accessToken)
            );
            retryConfig = {
              ...config,
              headers: {
                Authorization: `Bearer ${JSON.parse(
                  window.localStorage.getItem("access_token")
                )}`,
              },
            };
          } catch (error) {
            console.log("error :>> ", error);
          }
        }
        return new Promise((resolve) => {
          resolve(instance(retryConfig));
        });
      }
      return Promise.reject(error);
    });

    const response = await instance(config);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const getToken = async () => {
  let data = stringify({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    grant_type: process.env.NEXT_PUBLIC_GRANT_TYPE,
  });

  let config = {
    method: "post",
    url: `https://${baseUrl}/v1/security/oauth2/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    // @ts-ignore
    const response = await axios(config);
    console.log("response.data :>> ", response.data);
    return response.data.access_token;
  } catch (e) {
    console.log(e);
    // throw new Error(e);
  }
};

export const getAirportSuggest = async (keyword) => {
  let config = {
    method: "get",
    url: `https://${baseUrl}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${keyword}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=LIGHT`,
    headers: {
      Authorization: `Bearer ${JSON.parse(
        window.localStorage.getItem("access_token")
      )}`,
    },
  };

  try {
    const response = await axiosAirxplora(config, 5);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const getMultiTripsData = (data) => {
  const dataKeys = keys(data);
  const multiTripOptions = dataKeys.filter((key) => key.includes("multi"));
  const multiTripData = pick(data, multiTripOptions);
  return valuesIn(multiTripData);
};

export const getOriginDestinations = (data, tripType, multTripItinerary) => {
  if (tripType === "Multi-City") {
    const trip = multTripItinerary.map((item, index) => ({
      id: `${index + 1}`,
      originLocationCode: item.from.iataCode,
      destinationLocationCode: item.to.iataCode,
      departureDateTimeRange: {
        date: dayjs(item.depDate).format("YYYY-MM-DD"),
      },
    }));
    return trip;
  } else if (tripType === "Return Trip") {
    const { depDate, retDate, to, from } = data;
    let trip1, trip2;
    trip1 = {
      id: "1",
      originLocationCode: from.iataCode,
      destinationLocationCode: to.iataCode,
      departureDateTimeRange: { date: dayjs(depDate).format("YYYY-MM-DD") },
    };

    trip2 = {
      id: "2",
      originLocationCode: to.iataCode,
      destinationLocationCode: from.iataCode,
      departureDateTimeRange: { date: dayjs(retDate).format("YYYY-MM-DD") },
    };

    return [trip1, trip2];
  } else if (tripType === "One Way") {
    const { depDate, to, from } = data;
    let trip1;
    trip1 = {
      id: "1",
      originLocationCode: from.iataCode,
      destinationLocationCode: to.iataCode,
      departureDateTimeRange: { date: dayjs(depDate).format("YYYY-MM-DD") },
    };
    return [trip1];
  }
};

export const getBookingClass = (bookingClass) => {
  switch (bookingClass) {
    case "Economy":
      return "ECONOMY";
    case "Premium Economy":
      return "PREMIUM_ECONOMY";
    case "Business":
      return "BUSINESS";
    case "First":
      return "First";
  }
};

export const getTravellers = (passengers) => {
  let adult = [];
  let child = [];
  let infant = [];
  let adultCount = 0;

  passengers.forEach((passenger, index) => {
    if (passenger.type === "Adult") {
      adultCount = passenger.count;
      adult = Array.from({ length: passenger.count }, (_, i) => ({
        travelerType: "ADULT",
      }));
    }
    if (passenger.type === "Children") {
      child = Array.from({ length: passenger.count }, (_, i) => ({
        travelerType: "CHILD",
      }));
    }
    if (passenger.type === "Infant") {
      infant = Array.from({ length: passenger.count }, (_, i) => ({
        travelerType: "HELD_INFANT",
      }));
    }
  });
  const combineTravellers = [...adult, ...child, ...infant];
  // console.log(combineTravellers);
  const formatTravellers = combineTravellers.map((traveller, index) => {
    if (traveller.travelerType === "HELD_INFANT") {
      return {
        ...traveller,
        associatedAdultId: `${adultCount--}`,
        id: `${index + 1}`,
      };
    } else {
      return { ...traveller, id: `${index + 1}` };
    }
  });
  return formatTravellers;
};

export const useMoney = (data) => {
  const [money, setMoney] = useState(null);
  useEffect(() => {
    const format = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    setMoney(format.format(data));
  }, [data]);
  // console.log("use_money", data, money);
  return money;
};

export const getCabin = (segmentId, segmentsPricing) => {
  for (let segment of segmentsPricing) {
    if (segmentId === segment.segmentId) {
      return segment.cabin;
    }
  }
  return "";
};

export const getFlightOffers = async (data) => {
  let config = {
    method: "post",
    url: `https://${baseUrl}/v2/shopping/flight-offers`,
    headers: {
      Authorization: `Bearer ${JSON.parse(
        window.localStorage.getItem("access_token")
      )}`,
    },
    data: data,
  };

  try {
    const response = await axiosAirxplora(config, 5);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const getDayOfWeek = (number = 0) =>
  ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"][number];

export const getMonth = (number = 0) =>
  [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ][number];

export const getLayover = (segment, segments, segmentIndex) => {
  const duration = require("dayjs/plugin/duration");
  dayjs.extend(duration);
  const time1 = dayjs(segment.arrival.at);
  const time2 = segments[segmentIndex + 1]?.departure?.at
    ? dayjs(segments[segmentIndex + 1].departure.at)
    : null;

  if (time2) {
    const diff = time2.diff(time1, "m");
    let obj = {
      hours: Math.floor(diff / 60),
      minutes: diff % 60,
    };
    let minutes = dayjs.duration(obj).minutes();
    let hours = dayjs.duration(obj).hours();
    return `${hours}h${minutes}m`;
  }
  return "";
};

export const getAirportName = (key, type) => {
  // console.log(`key`, key);
  const [cookies, setCookie] = useCookies([key]);

  const fetcher = async () => {
    if (key && cookies[key]) return cookies[key];

    let config = {
      method: "get",
      url: `https://${baseUrl}/v1/reference-data/locations/A${key}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("access_token")
        )}`,
      },
    };

    try {
      const response = await axiosAirxplora(config, 5);
      //  console.log("response", response);
      const data = {
        airportName: response.data.data.name,
        cityName: response.data.data.address.cityName,
      };
      try {
        const string = response.data.data.name.toLowerCase().includes("airport")
          ? response.data.data.name
          : `${response.data.data.name} Airport`;
        setCookie(key, data);
        return data;
      } catch (error) {
        console.log("error :>> ", error);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const { data, error } = useSWR(key, fetcher);

  // console.log("data, error: ", data, error);

  if (!data && type === "airportName") return `${key} Airport`;
  if (!data && type === "cityName") return `${key}`;
  if (data && type === "airportName")
    return `${startCase(lowerCase(data["airportName"]))} (${key})`;
  if (data && type === "cityName")
    return `${startCase(lowerCase(data["cityName"]))}`;
};

export const Countdown = ({ start = 3 }) => {
  const [value, setValue] = useState(start);
  useEffect(() => {
    const interval = setInterval(() => {
      if (value > 0) {
        setValue(value - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [null]);

  return <>{value ? value : ""}</>;
};

export const getMinMax = (flightOffersFixed = []) => {
  // console.log(`flightOffersFixed`, flightOffersFixed);
  const sortedPrice = flightOffersFixed
    .map((item) => Number(item.price.grandTotal))
    // @ts-ignore
    .sort((a, b) => a > b);
  // console.log(`sortedPrice`, sortedPrice)
  return [Number(first(sortedPrice)), Number(last(sortedPrice))];
};

export const filterPrice = (priceRange, flo) => {
  // console.log("handleChange", v);
  try {
    const sortedByPrice = flo.filter((item) => {
      if (
        Number(item.price.grandTotal) >= first(priceRange) &&
        item.price.grandTotal <= last(priceRange)
      ) {
        return true;
      } else {
        return false;
      }
    });
    //  console.log(`sortedByPrice`, sortedByPrice);
    return sortedByPrice;
  } catch (error) {
    console.log(`error`, error);
    return flo;
  }
};

export const filterStop = (stopData, flo) => {
  try {
    let selectedStops = keys(
      pickBy(stopData, function (value) {
        return value === true;
      })
    );

    if (selectedStops.length === 0) return flo;
    const sortedByStops = flo.filter((flightOffer) => {
      const itinSegCount = flightOffer.itineraries.map(
        (itinerary) => itinerary.segments.length
      );
      //console.log(`itinSegCount`, itinSegCount);
      for (let stop of itinSegCount) {
        if (selectedStops.includes(`${stop}`)) {
          return true;
        }
      }
      return false;
    });
    // console.log(`sortedByStops`, sortedByStops, selectedStops);
    return sortedByStops;
  } catch (error) {
    console.log(`error`, error);
    return flo;
  }
};

export const filterAirline = (airlineData, flo) => {
  try {
    let selectedAirline = keys(
      pickBy(airlineData, function (value) {
        return value === true;
      })
    );
    if (selectedAirline.length === 0) return flo;

    const sortedByAirline = flo.filter((flightOffer) => {
      let set = new Set();
      flightOffer.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          set.add(segment.carrierCode);
        });
      });
      const carriers = Array.from(set);
      for (let carrierCode of carriers) {
        if (selectedAirline.includes(carrierCode)) {
          return true;
        }
      }
      return false;
    });
    // console.log(`sortedByAirline`, sortedByAirline, selectedAirline);
    return sortedByAirline;
  } catch (error) {
    console.log(`error`, error);
    return flo;
  }
};

export const verifyPrice = async (flightOffer) => {
  let data = JSON.stringify({
    data: {
      type: "flight-offers-pricing",
      flightOffers: [flightOffer],
    },
  });

  let config = {
    method: "post",
    url: `https://${baseUrl}/v1/shopping/flight-offers/pricing?include=bags,other-services,detailed-fare-rules&forceClass=false`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(
        window.localStorage.getItem("access_token")
      )}`,
    },
    data: data,
  };

  try {
    const response = await axiosAirxplora(config, 5);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export const getBaggage = (flightOffer, segmentId, includedCheckedBags) => {
  if (!includedCheckedBags || !flightOffer) return ["None"];
  try {
    const baggage = flightOffer.travelerPricings.map(
      (traveler) =>
        `${startCase(
          lowerCase(traveler.travelerType)
        )} : ${traveler.fareDetailsBySegment.map((seg) => {
          if (seg.segmentId === segmentId) {
            return `${
              seg.includedCheckedBags?.quantity &&
              `${seg.includedCheckedBags?.quantity} Bag(s) of 23Kg each`
            }`;
          }
        })}`
    );
    const prettyBagagge = baggage.map((bag) =>
      bag.toLocaleString().replaceAll(/,/g, "")
    );
    return prettyBagagge;
  } catch (error) {
    console.log(`error`, error);
    return ["error"];
  }
};

export const schema = yup.object().shape({
  email: yup.string().email().required(),
  phone: yup.number(),
  // password: yup.string().min(8).max(32).required(),
});

export const updateDb = async (data, db, col) => {
  const postData = { data, db, col };
  let config = {
    method: "post",
    url: "/api/insertdb",
    data: postData,
  };
  try {
    const request = await axiosAirxplora(config, 2);
    // const request = await axios.get("/api/insertdb");
    console.log(`request`, request);
    return request;
  } catch (err) {
    console.log(`err`, err);
  }
};

export const getMoreOrderData = async (lastName, reference) => {
  const data = {
    data: {
      lastName: lastName,
      reference: reference,
    },
  };
  let config = {
    method: "post",
    url: "/api/getmoreorderdata",
    data: data,
  };
  try {
    const request = await axiosAirxplora(config, 2);
    // const request = await axios.get("/api/insertdb");
    console.log(`request`, request);
    return request;
  } catch (err) {
    console.log(`err`, err);
  }
};

export const airlines = [
  {
    iataCode: "1T",
  },
  {
    iataCode: "Q5",
  },
  {
    iataCode: "AN",
  },
  {
    iataCode: "1B",
  },
  {
    iataCode: "W9",
  },
  {
    iataCode: "ZI",
  },
  {
    iataCode: "AQ",
  },
  {
    iataCode: "AA",
  },
  {
    iataCode: "OZ",
  },
  {
    iataCode: "4K",
  },
  {
    iataCode: "8U",
  },
  {
    iataCode: "Q9",
  },
  {
    iataCode: "G4",
  },
  {
    iataCode: "K5",
  },
  {
    iataCode: "M3",
  },
  {
    iataCode: "04",
  },
  {
    iataCode: "GB",
  },
  {
    iataCode: "GB",
  },
  {
    iataCode: "8V",
  },
  {
    iataCode: "E4",
  },
  {
    iataCode: "YT",
  },
  {
    iataCode: "4G",
  },
  {
    iataCode: "7A",
  },
  {
    iataCode: "8T",
  },
  {
    iataCode: "ZY",
  },
  {
    iataCode: "Z7",
  },
  {
    iataCode: "JP",
  },
  {
    iataCode: "UX",
  },
  {
    iataCode: "EM",
  },
  {
    iataCode: "A3",
  },
  {
    iataCode: "0C",
  },
  {
    iataCode: "KI",
  },
  {
    iataCode: "PE",
  },
  {
    iataCode: "KO",
  },
  {
    iataCode: "5W",
  },
  {
    iataCode: "VV",
  },
  {
    iataCode: "I9",
  },
  {
    iataCode: "WK",
  },
  {
    iataCode: "QQ",
  },
  {
    iataCode: "FG",
  },
  {
    iataCode: "SU",
  },
  {
    iataCode: "JA",
  },
  {
    iataCode: "AF",
  },
  {
    iataCode: "SB",
  },
  {
    iataCode: "GN",
  },
  {
    iataCode: "2O",
  },
  {
    iataCode: "2Q",
  },
  {
    iataCode: "V7",
  },
  {
    iataCode: "SW",
  },
  {
    iataCode: "G8",
  },
  {
    iataCode: "5D",
  },
  {
    iataCode: "1A",
  },
  {
    iataCode: "7T",
  },
  {
    iataCode: "PL",
  },
  {
    iataCode: "8A",
  },
  {
    iataCode: "GD",
  },
  {
    iataCode: "LD",
  },
  {
    iataCode: "HT",
  },
  {
    iataCode: "J2",
  },
  {
    iataCode: "U3",
  },
  {
    iataCode: "AP",
  },
  {
    iataCode: "5A",
  },
  {
    iataCode: "ED",
  },
  {
    iataCode: "AB",
  },
  {
    iataCode: "AG",
  },
  {
    iataCode: "AI",
  },
  {
    iataCode: "ZB",
  },
  {
    iataCode: "CC",
  },
  {
    iataCode: "RB",
  },
  {
    iataCode: "TN",
  },
  {
    iataCode: "W4",
  },
  {
    iataCode: "IZ",
  },
  {
    iataCode: "JM",
  },
  {
    iataCode: "AP",
  },
  {
    iataCode: "S2",
  },
  {
    iataCode: "KM",
  },
  {
    iataCode: "M6",
  },
  {
    iataCode: "NQ",
  },
  {
    iataCode: "4A",
  },
  {
    iataCode: "EH",
  },
  {
    iataCode: "HP",
  },
  {
    iataCode: "ZW",
  },
  {
    iataCode: "U9",
  },
  {
    iataCode: "VD",
  },
  {
    iataCode: "TT",
  },
  {
    iataCode: "QM",
  },
  {
    iataCode: "BM",
  },
  {
    iataCode: "NX",
  },
  {
    iataCode: "ZV",
  },
  {
    iataCode: "HM",
  },
  {
    iataCode: "AM",
  },
  {
    iataCode: "NH",
  },
  {
    iataCode: "YW",
  },
  {
    iataCode: "PX",
  },
  {
    iataCode: "G9",
  },
  {
    iataCode: "AC",
  },
  {
    iataCode: "BT",
  },
  {
    iataCode: "EL",
  },
  {
    iataCode: "TL",
  },
  {
    iataCode: "4N",
  },
  {
    iataCode: "IW",
  },
  {
    iataCode: "NZ",
  },
  {
    iataCode: "J6",
  },
  {
    iataCode: "2D",
  },
  {
    iataCode: "6V",
  },
  {
    iataCode: "XM",
  },
  {
    iataCode: "OE",
  },
  {
    iataCode: "GV",
  },
  {
    iataCode: "JW",
  },
  {
    iataCode: "W3",
  },
  {
    iataCode: "2B",
  },
  {
    iataCode: "4C",
  },
  {
    iataCode: "AR",
  },
  {
    iataCode: "QN",
  },
  {
    iataCode: "AS",
  },
  {
    iataCode: "4D",
  },
  {
    iataCode: "PL",
  },
  {
    iataCode: "EV",
  },
  {
    iataCode: "OB",
  },
  {
    iataCode: "TC",
  },
  {
    iataCode: "2J",
  },
  {
    iataCode: "HC",
  },
  {
    iataCode: "FO",
  },
  {
    iataCode: "PJ",
  },
  {
    iataCode: "8C",
  },
  {
    iataCode: "OS",
  },
  {
    iataCode: "IQ",
  },
  {
    iataCode: "RU",
  },
  {
    iataCode: "MO",
  },
  {
    iataCode: "5N",
  },
  {
    iataCode: "GR",
  },
  {
    iataCode: "NO",
  },
  {
    iataCode: "AU",
  },
  {
    iataCode: "AO",
  },
  {
    iataCode: "AV",
  },
  {
    iataCode: "NF",
  },
  {
    iataCode: "K8",
  },
  {
    iataCode: "B9",
  },
  {
    iataCode: "DR",
  },
  {
    iataCode: "7E",
  },
  {
    iataCode: "6G",
  },
  {
    iataCode: "TX",
  },
  {
    iataCode: "IX",
  },
  {
    iataCode: "HJ",
  },
  {
    iataCode: "XT",
  },
  {
    iataCode: "AK",
  },
  {
    iataCode: "6V",
  },
  {
    iataCode: "3G",
  },
  {
    iataCode: "AZ",
  },
  {
    iataCode: "ZE",
  },
  {
    iataCode: "Z8",
  },
  {
    iataCode: "UM",
  },
  {
    iataCode: "R7",
  },
  {
    iataCode: "FV",
  },
  {
    iataCode: "RX",
  },
  {
    iataCode: "MQ",
  },
  {
    iataCode: "FF",
  },
  {
    iataCode: "ML",
  },
  {
    iataCode: "VU",
  },
  {
    iataCode: "BP",
  },
  {
    iataCode: "GS",
  },
  {
    iataCode: "VT",
  },
  {
    iataCode: "3N",
  },
  {
    iataCode: "VL",
  },
  {
    iataCode: "FK",
  },
  {
    iataCode: "G2",
  },
  {
    iataCode: "V8",
  },
  {
    iataCode: "VE",
  },
  {
    iataCode: "V5",
  },
  {
    iataCode: "CA",
  },
  {
    iataCode: "Q6",
  },
  {
    iataCode: "5F",
  },
  {
    iataCode: "QC",
  },
  {
    iataCode: "NV",
  },
  {
    iataCode: "CV",
  },
  {
    iataCode: "CW",
  },
  {
    iataCode: "ZA",
  },
  {
    iataCode: "AH",
  },
  {
    iataCode: "KI",
  },
  {
    iataCode: "ER",
  },
  {
    iataCode: "HO",
  },
  {
    iataCode: "EN",
  },
  {
    iataCode: "D9",
  },
  {
    iataCode: "NM",
  },
  {
    iataCode: "EE",
  },
  {
    iataCode: "4F",
  },
  {
    iataCode: "EI",
  },
  {
    iataCode: "E8",
  },
  {
    iataCode: "KY",
  },
  {
    iataCode: "PC",
  },
  {
    iataCode: "OF",
  },
  {
    iataCode: "FJ",
  },
  {
    iataCode: "RC",
  },
  {
    iataCode: "QH",
  },
  {
    iataCode: "NY",
  },
  {
    iataCode: "2P",
  },
  {
    iataCode: "ZX",
  },
  {
    iataCode: "2U",
  },
  {
    iataCode: "0A",
  },
  {
    iataCode: "DA",
  },
  {
    iataCode: "GL",
  },
  {
    iataCode: "LL",
  },
  {
    iataCode: "5Y",
  },
  {
    iataCode: "GG",
  },
  {
    iataCode: "H9",
  },
  {
    iataCode: "GG",
  },
  {
    iataCode: "8C",
  },
  {
    iataCode: "W9",
  },
  {
    iataCode: "IP",
  },
  {
    iataCode: "QK",
  },
  {
    iataCode: "KK",
  },
  {
    iataCode: "JS",
  },
  {
    iataCode: "KC",
  },
  {
    iataCode: "LV",
  },
  {
    iataCode: "D4",
  },
  {
    iataCode: "CD",
  },
  {
    iataCode: "XL",
  },
  {
    iataCode: "A6",
  },
  {
    iataCode: "TD",
  },
  {
    iataCode: "L8",
  },
  {
    iataCode: "LK",
  },
  {
    iataCode: "MK",
  },
  {
    iataCode: "MD",
  },
  {
    iataCode: "9U",
  },
  {
    iataCode: "M0",
  },
  {
    iataCode: "A7",
  },
  {
    iataCode: "QO",
  },
  {
    iataCode: "MR",
  },
  {
    iataCode: "3S",
  },
  {
    iataCode: "8D",
  },
  {
    iataCode: "F4",
  },
  {
    iataCode: "AJ",
  },
  {
    iataCode: "8Y",
  },
  {
    iataCode: "OT",
  },
  {
    iataCode: "AD",
  },
  {
    iataCode: "QD",
  },
  {
    iataCode: "QS",
  },
  {
    iataCode: "4Y",
  },
  {
    iataCode: "MC",
  },
  {
    iataCode: "RE",
  },
  {
    iataCode: "UU",
  },
  {
    iataCode: "6K",
  },
  {
    iataCode: "RK",
  },
  {
    iataCode: "A5",
  },
  {
    iataCode: "QL",
  },
  {
    iataCode: "MV",
  },
  {
    iataCode: "20",
  },
  {
    iataCode: "U8",
  },
  {
    iataCode: "BQ",
  },
  {
    iataCode: "P5",
  },
  {
    iataCode: "BF",
  },
  {
    iataCode: "5L",
  },
  {
    iataCode: "EX",
  },
  {
    iataCode: "JR",
  },
  {
    iataCode: "Z3",
  },
  {
    iataCode: "M3",
  },
  {
    iataCode: "GM",
  },
  {
    iataCode: "R3",
  },
  {
    iataCode: "VW",
  },
  {
    iataCode: "JY",
  },
  {
    iataCode: "OR",
  },
  {
    iataCode: "CG",
  },
  {
    iataCode: "TY",
  },
  {
    iataCode: "FL",
  },
  {
    iataCode: "TS",
  },
  {
    iataCode: "EC",
  },
  {
    iataCode: "VO",
  },
  {
    iataCode: "DW",
  },
  {
    iataCode: "6U",
  },
  {
    iataCode: "2K",
  },
  {
    iataCode: "6R",
  },
  {
    iataCode: "8Q",
  },
  {
    iataCode: "BA",
  },
  {
    iataCode: "BG",
  },
  {
    iataCode: "BF",
  },
  {
    iataCode: "B4",
  },
  {
    iataCode: "BZ",
  },
  {
    iataCode: "JA",
  },
  {
    iataCode: "J4",
  },
  {
    iataCode: "A8",
  },
  {
    iataCode: "4T",
  },
  {
    iataCode: "UP",
  },
  {
    iataCode: "E6",
  },
  {
    iataCode: "LZ",
  },
  {
    iataCode: "TH",
  },
  {
    iataCode: "BS",
  },
  {
    iataCode: "B4",
  },
  {
    iataCode: "PG",
  },
  {
    iataCode: "KF",
  },
  {
    iataCode: "JV",
  },
  {
    iataCode: "B3",
  },
  {
    iataCode: "BD",
  },
  {
    iataCode: "WW",
  },
  {
    iataCode: "CH",
  },
  {
    iataCode: "5Z",
  },
  {
    iataCode: "BO",
  },
  {
    iataCode: "BV",
  },
  {
    iataCode: "7R",
  },
  {
    iataCode: "8E",
  },
  {
    iataCode: "B2",
  },
  {
    iataCode: "K6",
  },
  {
    iataCode: "BN",
  },
  {
    iataCode: "GQ",
  },
  {
    iataCode: "V9",
  },
  {
    iataCode: "7P",
  },
  {
    iataCode: "J8",
  },
  {
    iataCode: "QW",
  },
  {
    iataCode: "8W",
  },
  {
    iataCode: "BM",
  },
  {
    iataCode: "DB",
  },
  {
    iataCode: "E9",
  },
  {
    iataCode: "SN",
  },
  {
    iataCode: "NT",
  },
  {
    iataCode: "0B",
  },
  {
    iataCode: "KJ",
  },
  {
    iataCode: "FB",
  },
  {
    iataCode: "8N",
  },
  {
    iataCode: "5C",
  },
  {
    iataCode: "AW",
  },
  {
    iataCode: "XG",
  },
  {
    iataCode: "MO",
  },
  {
    iataCode: "R9",
  },
  {
    iataCode: "UY",
  },
  {
    iataCode: "C6",
  },
  {
    iataCode: "CP",
  },
  {
    iataCode: "5T",
  },
  {
    iataCode: "W2",
  },
  {
    iataCode: "9K",
  },
  {
    iataCode: "PT",
  },
  {
    iataCode: "GG",
  },
  {
    iataCode: "2G",
  },
  {
    iataCode: "W8",
  },
  {
    iataCode: "CV",
  },
  {
    iataCode: "BW",
  },
  {
    iataCode: "8B",
  },
  {
    iataCode: "V3",
  },
  {
    iataCode: "RV",
  },
  {
    iataCode: "CX",
  },
  {
    iataCode: "KX",
  },
  {
    iataCode: "5J",
  },
  {
    iataCode: "7N",
  },
  {
    iataCode: "C0",
  },
  {
    iataCode: "J7",
  },
  {
    iataCode: "WE",
  },
  {
    iataCode: "OP",
  },
  {
    iataCode: "MG",
  },
  {
    iataCode: "2Z",
  },
  {
    iataCode: "S8",
  },
  {
    iataCode: "RP",
  },
  {
    iataCode: "C8",
  },
  {
    iataCode: "CI",
  },
  {
    iataCode: "CK",
  },
  {
    iataCode: "MU",
  },
  {
    iataCode: "CJ",
  },
  {
    iataCode: "WH",
  },
  {
    iataCode: "8Y",
  },
  {
    iataCode: "CZ",
  },
  {
    iataCode: "HR",
  },
  {
    iataCode: "XO",
  },
  {
    iataCode: "3Q",
  },
  {
    iataCode: "X7",
  },
  {
    iataCode: "A2",
  },
  {
    iataCode: "QI",
  },
  {
    iataCode: "C9",
  },
  {
    iataCode: "CF",
  },
  {
    iataCode: "G3",
  },
  {
    iataCode: "WX",
  },
  {
    iataCode: "CJ",
  },
  {
    iataCode: "CT",
  },
  {
    iataCode: "6P",
  },
  {
    iataCode: "BX",
  },
  {
    iataCode: "DQ",
  },
  {
    iataCode: "9L",
  },
  {
    iataCode: "OH",
  },
  {
    iataCode: "MN",
  },
  {
    iataCode: "C5",
  },
  {
    iataCode: "KR",
  },
  {
    iataCode: "GJ",
  },
  {
    iataCode: "CP",
  },
  {
    iataCode: "DE",
  },
  {
    iataCode: "6A",
  },
  {
    iataCode: "C3",
  },
  {
    iataCode: "CO",
  },
  {
    iataCode: "PC",
  },
  {
    iataCode: "CO",
  },
  {
    iataCode: "CS",
  },
  {
    iataCode: "V0",
  },
  {
    iataCode: "CM",
  },
  {
    iataCode: "SS",
  },
  {
    iataCode: "XK",
  },
  {
    iataCode: "F5",
  },
  {
    iataCode: "OU",
  },
  {
    iataCode: "QE",
  },
  {
    iataCode: "CU",
  },
  {
    iataCode: "CY",
  },
  {
    iataCode: "YK",
  },
  {
    iataCode: "OK",
  },
  {
    iataCode: "WD",
  },
  {
    iataCode: "DX",
  },
  {
    iataCode: "ES",
  },
  {
    iataCode: "L3",
  },
  {
    iataCode: "D3",
  },
  {
    iataCode: "N2",
  },
  {
    iataCode: "H8",
  },
  {
    iataCode: "0D",
  },
  {
    iataCode: "D5",
  },
  {
    iataCode: "DL",
  },
  {
    iataCode: "2A",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "D7",
  },
  {
    iataCode: "AW",
  },
  {
    iataCode: "DH",
  },
  {
    iataCode: "D8",
  },
  {
    iataCode: "DO",
  },
  {
    iataCode: "E3",
  },
  {
    iataCode: "5D",
  },
  {
    iataCode: "KA",
  },
  {
    iataCode: "KB",
  },
  {
    iataCode: "DI",
  },
  {
    iataCode: "1C",
  },
  {
    iataCode: "VE",
  },
  {
    iataCode: "BR",
  },
  {
    iataCode: "H7",
  },
  {
    iataCode: "QU",
  },
  {
    iataCode: "S9",
  },
  {
    iataCode: "T3",
  },
  {
    iataCode: "DK",
  },
  {
    iataCode: "W9",
  },
  {
    iataCode: "WK",
  },
  {
    iataCode: "MS",
  },
  {
    iataCode: "LY",
  },
  {
    iataCode: "UZ",
  },
  {
    iataCode: "EK",
  },
  {
    iataCode: "EM",
  },
  {
    iataCode: "EU",
  },
  {
    iataCode: "G8",
  },
  {
    iataCode: "E0",
  },
  {
    iataCode: "B8",
  },
  {
    iataCode: "E7",
  },
  {
    iataCode: "OV",
  },
  {
    iataCode: "ET",
  },
  {
    iataCode: "EY",
  },
  {
    iataCode: "RZ",
  },
  {
    iataCode: "MM",
  },
  {
    iataCode: "UI",
  },
  {
    iataCode: "GJ",
  },
  {
    iataCode: "K2",
  },
  {
    iataCode: "3W",
  },
  {
    iataCode: "5O",
  },
  {
    iataCode: "EA",
  },
  {
    iataCode: "QY",
  },
  {
    iataCode: "E7",
  },
  {
    iataCode: "EW",
  },
  {
    iataCode: "EZ",
  },
  {
    iataCode: "JN",
  },
  {
    iataCode: "MB",
  },
  {
    iataCode: "OW",
  },
  {
    iataCode: "8D",
  },
  {
    iataCode: "EO",
  },
  {
    iataCode: "XE",
  },
  {
    iataCode: "U2",
  },
  {
    iataCode: "IH",
  },
  {
    iataCode: "EF",
  },
  {
    iataCode: "F6",
  },
  {
    iataCode: "F3",
  },
  {
    iataCode: "FX",
  },
  {
    iataCode: "N8",
  },
  {
    iataCode: "4S",
  },
  {
    iataCode: "AY",
  },
  {
    iataCode: "FC",
  },
  {
    iataCode: "FY",
  },
  {
    iataCode: "7F",
  },
  {
    iataCode: "DP",
  },
  {
    iataCode: "8F",
  },
  {
    iataCode: "B5",
  },
  {
    iataCode: "PA",
  },
  {
    iataCode: "RF",
  },
  {
    iataCode: "F2",
  },
  {
    iataCode: "SH",
  },
  {
    iataCode: "D7",
  },
  {
    iataCode: "TE",
  },
  {
    iataCode: "LF",
  },
  {
    iataCode: "F7",
  },
  {
    iataCode: "BE",
  },
  {
    iataCode: "B4",
  },
  {
    iataCode: "VY",
  },
  {
    iataCode: "BN",
  },
  {
    iataCode: "HK",
  },
  {
    iataCode: "FP",
  },
  {
    iataCode: "F9",
  },
  {
    iataCode: "2F",
  },
  {
    iataCode: "FH",
  },
  {
    iataCode: "GT",
  },
  {
    iataCode: "7O",
  },
  {
    iataCode: "1G",
  },
  {
    iataCode: "GC",
  },
  {
    iataCode: "G7",
  },
  {
    iataCode: "GA",
  },
  {
    iataCode: "4G",
  },
  {
    iataCode: "GR",
  },
  {
    iataCode: "A9",
  },
  {
    iataCode: "QB",
  },
  {
    iataCode: "ST",
  },
  {
    iataCode: "4U",
  },
  {
    iataCode: "GP",
  },
  {
    iataCode: "G0",
  },
  {
    iataCode: "G8",
  },
  {
    iataCode: "GK",
  },
  {
    iataCode: "G7",
  },
  {
    iataCode: "G3",
  },
  {
    iataCode: "DC",
  },
  {
    iataCode: "G1",
  },
  {
    iataCode: "GS",
  },
  {
    iataCode: "ZK",
  },
  {
    iataCode: "IJ",
  },
  {
    iataCode: "TA",
  },
  {
    iataCode: "G6",
  },
  {
    iataCode: "J9",
  },
  {
    iataCode: "G8",
  },
  {
    iataCode: "GF",
  },
  {
    iataCode: "GY",
  },
  {
    iataCode: "H6",
  },
  {
    iataCode: "HR",
  },
  {
    iataCode: "HU",
  },
  {
    iataCode: "1R",
  },
  {
    iataCode: "2T",
  },
  {
    iataCode: "4R",
  },
  {
    iataCode: "X3",
  },
  {
    iataCode: "HF",
  },
  {
    iataCode: "HB",
  },
  {
    iataCode: "HQ",
  },
  {
    iataCode: "HA",
  },
  {
    iataCode: "HP",
  },
  {
    iataCode: "BH",
  },
  {
    iataCode: "HN",
  },
  {
    iataCode: "8H",
  },
  {
    iataCode: "JB",
  },
  {
    iataCode: "ZU",
  },
  {
    iataCode: "T4",
  },
  {
    iataCode: "HW",
  },
  {
    iataCode: "2L",
  },
  {
    iataCode: "DU",
  },
  {
    iataCode: "EO",
  },
  {
    iataCode: "UD",
  },
  {
    iataCode: "5K",
  },
  {
    iataCode: "HD",
  },
  {
    iataCode: "H5",
  },
  {
    iataCode: "HX",
  },
  {
    iataCode: "UO",
  },
  {
    iataCode: "HH",
  },
  {
    iataCode: "QX",
  },
  {
    iataCode: "BN",
  },
  {
    iataCode: "H4",
  },
  {
    iataCode: "II",
  },
  {
    iataCode: "C3",
  },
  {
    iataCode: "1F",
  },
  {
    iataCode: "1U",
  },
  {
    iataCode: "IB",
  },
  {
    iataCode: "TY",
  },
  {
    iataCode: "FW",
  },
  {
    iataCode: "FI",
  },
  {
    iataCode: "IK",
  },
  {
    iataCode: "DH",
  },
  {
    iataCode: "6E",
  },
  {
    iataCode: "IC",
  },
  {
    iataCode: "I9",
  },
  {
    iataCode: "QZ",
  },
  {
    iataCode: "IO",
  },
  {
    iataCode: "IJ",
  },
  {
    iataCode: "H4",
  },
  {
    iataCode: "D6",
  },
  {
    iataCode: "ZA",
  },
  {
    iataCode: "RS",
  },
  {
    iataCode: "ID",
  },
  {
    iataCode: "6I",
  },
  {
    iataCode: "3L",
  },
  {
    iataCode: "I4",
  },
  {
    iataCode: "IR",
  },
  {
    iataCode: "EP",
  },
  {
    iataCode: "IA",
  },
  {
    iataCode: "IS",
  },
  {
    iataCode: "2S",
  },
  {
    iataCode: "8L",
  },
  {
    iataCode: "CN",
  },
  {
    iataCode: "IF",
  },
  {
    iataCode: "WC",
  },
  {
    iataCode: "6H",
  },
  {
    iataCode: "9X",
  },
  {
    iataCode: "GI",
  },
  {
    iataCode: "H9",
  },
  {
    iataCode: "JC",
  },
  {
    iataCode: "JO",
  },
  {
    iataCode: "1M",
  },
  {
    iataCode: "JL",
  },
  {
    iataCode: "JL",
  },
  {
    iataCode: "EG",
  },
  {
    iataCode: "NU",
  },
  {
    iataCode: "JU",
  },
  {
    iataCode: "VJ",
  },
  {
    iataCode: "J9",
  },
  {
    iataCode: "7C",
  },
  {
    iataCode: "9W",
  },
  {
    iataCode: "QJ",
  },
  {
    iataCode: "0J",
  },
  {
    iataCode: "3K",
  },
  {
    iataCode: "LS",
  },
  {
    iataCode: "8J",
  },
  {
    iataCode: "B6",
  },
  {
    iataCode: "JF",
  },
  {
    iataCode: "0J",
  },
  {
    iataCode: "SG",
  },
  {
    iataCode: "JQ",
  },
  {
    iataCode: "JX",
  },
  {
    iataCode: "GX",
  },
  {
    iataCode: "R5",
  },
  {
    iataCode: "HO",
  },
  {
    iataCode: "KD",
  },
  {
    iataCode: "WA",
  },
  {
    iataCode: "KL",
  },
  {
    iataCode: "N2",
  },
  {
    iataCode: "K4",
  },
  {
    iataCode: "RQ",
  },
  {
    iataCode: "E2",
  },
  {
    iataCode: "V2",
  },
  {
    iataCode: "KV",
  },
  {
    iataCode: "M5",
  },
  {
    iataCode: "KQ",
  },
  {
    iataCode: "BZ",
  },
  {
    iataCode: "IT",
  },
  {
    iataCode: "Y9",
  },
  {
    iataCode: "KP",
  },
  {
    iataCode: "7K",
  },
  {
    iataCode: "8J",
  },
  {
    iataCode: "KE",
  },
  {
    iataCode: "7B",
  },
  {
    iataCode: "K9",
  },
  {
    iataCode: "GW",
  },
  {
    iataCode: "VD",
  },
  {
    iataCode: "KU",
  },
  {
    iataCode: "GO",
  },
  {
    iataCode: "N5",
  },
  {
    iataCode: "QH",
  },
  {
    iataCode: "R8",
  },
  {
    iataCode: "KY",
  },
  {
    iataCode: "JF",
  },
  {
    iataCode: "LR",
  },
  {
    iataCode: "KG",
  },
  {
    iataCode: "LA",
  },
  {
    iataCode: "4M",
  },
  {
    iataCode: "LU",
  },
  {
    iataCode: "LP",
  },
  {
    iataCode: "LO",
  },
  {
    iataCode: "XO",
  },
  {
    iataCode: "L3",
  },
  {
    iataCode: "LT",
  },
  {
    iataCode: "N6",
  },
  {
    iataCode: "IK",
  },
  {
    iataCode: "QV",
  },
  {
    iataCode: "L7",
  },
  {
    iataCode: "NG",
  },
  {
    iataCode: "LQ",
  },
  {
    iataCode: "LI",
  },
  {
    iataCode: "LN",
  },
  {
    iataCode: "L7",
  },
  {
    iataCode: "8z",
  },
  {
    iataCode: "LD",
  },
  {
    iataCode: "ZE",
  },
  {
    iataCode: "LM",
  },
  {
    iataCode: "JT",
  },
  {
    iataCode: "LM",
  },
  {
    iataCode: "LB",
  },
  {
    iataCode: "HE",
  },
  {
    iataCode: "LH",
  },
  {
    iataCode: "LH",
  },
  {
    iataCode: "CL",
  },
  {
    iataCode: "L1",
  },
  {
    iataCode: "DV",
  },
  {
    iataCode: "L5",
  },
  {
    iataCode: "LG",
  },
  {
    iataCode: "5V",
  },
  {
    iataCode: "L2",
  },
  {
    iataCode: "MJ",
  },
  {
    iataCode: "M7",
  },
  {
    iataCode: "IN",
  },
  {
    iataCode: "OM",
  },
  {
    iataCode: "MB",
  },
  {
    iataCode: "CC",
  },
  {
    iataCode: "DM",
  },
  {
    iataCode: "W5",
  },
  {
    iataCode: "M2",
  },
  {
    iataCode: "MH",
  },
  {
    iataCode: "TF",
  },
  {
    iataCode: "R5",
  },
  {
    iataCode: "MA",
  },
  {
    iataCode: "RI",
  },
  {
    iataCode: "AE",
  },
  {
    iataCode: "JE",
  },
  {
    iataCode: "6V",
  },
  {
    iataCode: "M7",
  },
  {
    iataCode: "MP",
  },
  {
    iataCode: "Q4",
  },
  {
    iataCode: "H5",
  },
  {
    iataCode: "8M",
  },
  {
    iataCode: "MY",
  },
  {
    iataCode: "MW",
  },
  {
    iataCode: "0F",
  },
  {
    iataCode: "IM",
  },
  {
    iataCode: "IG",
  },
  {
    iataCode: "MZ",
  },
  {
    iataCode: "YV",
  },
  {
    iataCode: "XJ",
  },
  {
    iataCode: "MX",
  },
  {
    iataCode: "GL",
  },
  {
    iataCode: "ME",
  },
  {
    iataCode: "JI",
  },
  {
    iataCode: "YX",
  },
  {
    iataCode: "MY",
  },
  {
    iataCode: "2M",
  },
  {
    iataCode: "ZB",
  },
  {
    iataCode: "8I",
  },
  {
    iataCode: "YM",
  },
  {
    iataCode: "3R",
  },
  {
    iataCode: "M9",
  },
  {
    iataCode: "NM",
  },
  {
    iataCode: "N4",
  },
  {
    iataCode: "VZ",
  },
  {
    iataCode: "UB",
  },
  {
    iataCode: "8M",
  },
  {
    iataCode: "DV",
  },
  {
    iataCode: "P9",
  },
  {
    iataCode: "UE",
  },
  {
    iataCode: "N4",
  },
  {
    iataCode: "N7",
  },
  {
    iataCode: "NA",
  },
  {
    iataCode: "9O",
  },
  {
    iataCode: "NC",
  },
  {
    iataCode: "CE",
  },
  {
    iataCode: "ON",
  },
  {
    iataCode: "1N",
  },
  {
    iataCode: "RA",
  },
  {
    iataCode: "NO",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "EJ",
  },
  {
    iataCode: "2N",
  },
  {
    iataCode: "HG",
  },
  {
    iataCode: "KZ",
  },
  {
    iataCode: "DD",
  },
  {
    iataCode: "JH",
  },
  {
    iataCode: "6N",
  },
  {
    iataCode: "N9",
  },
  {
    iataCode: "M3",
  },
  {
    iataCode: "HW",
  },
  {
    iataCode: "NC",
  },
  {
    iataCode: "U7",
  },
  {
    iataCode: "NW",
  },
  {
    iataCode: "FY",
  },
  {
    iataCode: "J3",
  },
  {
    iataCode: "DY",
  },
  {
    iataCode: "BJ",
  },
  {
    iataCode: "M4",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "N6",
  },
  {
    iataCode: "XY",
  },
  {
    iataCode: "UQ",
  },
  {
    iataCode: "CR",
  },
  {
    iataCode: "O8",
  },
  {
    iataCode: "VC",
  },
  {
    iataCode: "O6",
  },
  {
    iataCode: "O2",
  },
  {
    iataCode: "OA",
  },
  {
    iataCode: "WY",
  },
  {
    iataCode: "OY",
  },
  {
    iataCode: "N3",
  },
  {
    iataCode: "8Q",
  },
  {
    iataCode: "R2",
  },
  {
    iataCode: "OX",
  },
  {
    iataCode: "QO",
  },
  {
    iataCode: "OL",
  },
  {
    iataCode: "ON",
  },
  {
    iataCode: "OJ",
  },
  {
    iataCode: "OZ",
  },
  {
    iataCode: "O7",
  },
  {
    iataCode: "PV",
  },
  {
    iataCode: "9Q",
  },
  {
    iataCode: "PU",
  },
  {
    iataCode: "U4",
  },
  {
    iataCode: "Y5",
  },
  {
    iataCode: "BL",
  },
  {
    iataCode: "DJ",
  },
  {
    iataCode: "8P",
  },
  {
    iataCode: "Q8",
  },
  {
    iataCode: "PS",
  },
  {
    iataCode: "LW",
  },
  {
    iataCode: "GX",
  },
  {
    iataCode: "PK",
  },
  {
    iataCode: "GP",
  },
  {
    iataCode: "PF",
  },
  {
    iataCode: "NR",
  },
  {
    iataCode: "PA",
  },
  {
    iataCode: "PA",
  },
  {
    iataCode: "PQ",
  },
  {
    iataCode: "P8",
  },
  {
    iataCode: "I7",
  },
  {
    iataCode: "HP",
  },
  {
    iataCode: "PC",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "KS",
  },
  {
    iataCode: "P9",
  },
  {
    iataCode: "PR",
  },
  {
    iataCode: "HP",
  },
  {
    iataCode: "9R",
  },
  {
    iataCode: "PI",
  },
  {
    iataCode: "9E",
  },
  {
    iataCode: "PO",
  },
  {
    iataCode: "PH",
  },
  {
    iataCode: "DJ",
  },
  {
    iataCode: "1U",
  },
  {
    iataCode: "PD",
  },
  {
    iataCode: "NI",
  },
  {
    iataCode: "BK",
  },
  {
    iataCode: "PW",
  },
  {
    iataCode: "TO",
  },
  {
    iataCode: "FE",
  },
  {
    iataCode: "8Q",
  },
  {
    iataCode: "8W",
  },
  {
    iataCode: "P0",
  },
  {
    iataCode: "QF",
  },
  {
    iataCode: "QR",
  },
  {
    iataCode: "R6",
  },
  {
    iataCode: "1D",
  },
  {
    iataCode: "8L",
  },
  {
    iataCode: "V4",
  },
  {
    iataCode: "FN",
  },
  {
    iataCode: "ZL",
  },
  {
    iataCode: "3C",
  },
  {
    iataCode: "QQ",
  },
  {
    iataCode: "RW",
  },
  {
    iataCode: "RH",
  },
  {
    iataCode: "C7",
  },
  {
    iataCode: "E2",
  },
  {
    iataCode: "SL",
  },
  {
    iataCode: "R4",
  },
  {
    iataCode: "GZ",
  },
  {
    iataCode: "RR",
  },
  {
    iataCode: "RS",
  },
  {
    iataCode: "AT",
  },
  {
    iataCode: "R0",
  },
  {
    iataCode: "V5",
  },
  {
    iataCode: "BI",
  },
  {
    iataCode: "RJ",
  },
  {
    iataCode: "RK",
  },
  {
    iataCode: "RA",
  },
  {
    iataCode: "WR",
  },
  {
    iataCode: "P7",
  },
  {
    iataCode: "WB",
  },
  {
    iataCode: "RD",
  },
  {
    iataCode: "FR",
  },
  {
    iataCode: "YS",
  },
  {
    iataCode: "S4",
  },
  {
    iataCode: "SA",
  },
  {
    iataCode: "NL",
  },
  {
    iataCode: "MM",
  },
  {
    iataCode: "SK",
  },
  {
    iataCode: "S7",
  },
  {
    iataCode: "BB",
  },
  {
    iataCode: "UL",
  },
  {
    iataCode: "SY",
  },
  {
    iataCode: "G3",
  },
  {
    iataCode: "SG",
  },
  {
    iataCode: "I6",
  },
  {
    iataCode: "EH",
  },
  {
    iataCode: "7G",
  },
  {
    iataCode: "FA",
  },
  {
    iataCode: "N5",
  },
  {
    iataCode: "SP",
  },
  {
    iataCode: "8S",
  },
  {
    iataCode: "SQ",
  },
  {
    iataCode: "5M",
  },
  {
    iataCode: "SI",
  },
  {
    iataCode: "XS",
  },
  {
    iataCode: "SJ",
  },
  {
    iataCode: "ZS",
  },
  {
    iataCode: "SQ",
  },
  {
    iataCode: "FT",
  },
  {
    iataCode: "SX",
  },
  {
    iataCode: "SM",
  },
  {
    iataCode: "DG",
  },
  {
    iataCode: "VD",
  },
  {
    iataCode: "5G",
  },
  {
    iataCode: "FS",
  },
  {
    iataCode: "SD",
  },
  {
    iataCode: "PI",
  },
  {
    iataCode: "EZ",
  },
  {
    iataCode: "SV",
  },
  {
    iataCode: "WN",
  },
  {
    iataCode: "A4",
  },
  {
    iataCode: "WG",
  },
  {
    iataCode: "LX",
  },
  {
    iataCode: "SR",
  },
  {
    iataCode: "WV",
  },
  {
    iataCode: "S8",
  },
  {
    iataCode: "XQ",
  },
  {
    iataCode: "RB",
  },
  {
    iataCode: "AL",
  },
  {
    iataCode: "ZP",
  },
  {
    iataCode: "E5",
  },
  {
    iataCode: "SC",
  },
  {
    iataCode: "9S",
  },
  {
    iataCode: "3U",
  },
  {
    iataCode: "FM",
  },
  {
    iataCode: "ZH",
  },
  {
    iataCode: "8C",
  },
  {
    iataCode: "7L",
  },
  {
    iataCode: "NE",
  },
  {
    iataCode: "CQ",
  },
  {
    iataCode: "SO",
  },
  {
    iataCode: "JK",
  },
  {
    iataCode: "2G",
  },
  {
    iataCode: "1Z",
  },
  {
    iataCode: "1S",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "1H",
  },
  {
    iataCode: "1Q",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "1K",
  },
  {
    iataCode: "1K",
  },
  {
    iataCode: "2C",
  },
  {
    iataCode: "2S",
  },
  {
    iataCode: "NK",
  },
  {
    iataCode: "9R",
  },
  {
    iataCode: "S0",
  },
  {
    iataCode: "SO",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "SX",
  },
  {
    iataCode: "RU",
  },
  {
    iataCode: "S3",
  },
  {
    iataCode: "H2",
  },
  {
    iataCode: "OO",
  },
  {
    iataCode: "JZ",
  },
  {
    iataCode: "BC",
  },
  {
    iataCode: "LJ",
  },
  {
    iataCode: "0E",
  },
  {
    iataCode: "MI",
  },
  {
    iataCode: "6Q",
  },
  {
    iataCode: "PY",
  },
  {
    iataCode: "8D",
  },
  {
    iataCode: "NB",
  },
  {
    iataCode: "6J",
  },
  {
    iataCode: "IE",
  },
  {
    iataCode: "6W",
  },
  {
    iataCode: "HZ",
  },
  {
    iataCode: "S5",
  },
  {
    iataCode: "DV",
  },
  {
    iataCode: "R1",
  },
  {
    iataCode: "S6",
  },
  {
    iataCode: "EQ",
  },
  {
    iataCode: "JJ",
  },
  {
    iataCode: "TP",
  },
  {
    iataCode: "TU",
  },
  {
    iataCode: "3V",
  },
  {
    iataCode: "M7",
  },
  {
    iataCode: "T2",
  },
  {
    iataCode: "FQ",
  },
  {
    iataCode: "MT",
  },
  {
    iataCode: "TQ",
  },
  {
    iataCode: "L9",
  },
  {
    iataCode: "UE",
  },
  {
    iataCode: "ZT",
  },
  {
    iataCode: "TR",
  },
  {
    iataCode: "TT",
  },
  {
    iataCode: "TG",
  },
  {
    iataCode: "FD",
  },
  {
    iataCode: "TK",
  },
  {
    iataCode: "T7",
  },
  {
    iataCode: "9I",
  },
  {
    iataCode: "TD",
  },
  {
    iataCode: "TL",
  },
  {
    iataCode: "GY",
  },
  {
    iataCode: "3P",
  },
  {
    iataCode: "7T",
  },
  {
    iataCode: "TI",
  },
  {
    iataCode: "BY",
  },
  {
    iataCode: "PM",
  },
  {
    iataCode: "FF",
  },
  {
    iataCode: "QT",
  },
  {
    iataCode: "GE",
  },
  {
    iataCode: "HV",
  },
  {
    iataCode: "VR",
  },
  {
    iataCode: "T9",
  },
  {
    iataCode: "TH",
  },
  {
    iataCode: "S5",
  },
  {
    iataCode: "9T",
  },
  {
    iataCode: "UN",
  },
  {
    iataCode: "T9",
  },
  {
    iataCode: "T5",
  },
  {
    iataCode: "UG",
  },
  {
    iataCode: "T6",
  },
  {
    iataCode: "QS",
  },
  {
    iataCode: "TW",
  },
  {
    iataCode: "AL",
  },
  {
    iataCode: "6B",
  },
  {
    iataCode: "DT",
  },
  {
    iataCode: "SF",
  },
  {
    iataCode: "PZ",
  },
  {
    iataCode: "AX",
  },
  {
    iataCode: "1E",
  },
  {
    iataCode: "2H",
  },
  {
    iataCode: "1L",
  },
  {
    iataCode: "RO",
  },
  {
    iataCode: "3T",
  },
  {
    iataCode: "8R",
  },
  {
    iataCode: "OF",
  },
  {
    iataCode: "U5",
  },
  {
    iataCode: "UA",
  },
  {
    iataCode: "U2",
  },
  {
    iataCode: "U7",
  },
  {
    iataCode: "U6",
  },
  {
    iataCode: "UF",
  },
  {
    iataCode: "6Z",
  },
  {
    iataCode: "5X",
  },
  {
    iataCode: "US",
  },
  {
    iataCode: "UT",
  },
  {
    iataCode: "HY",
  },
  {
    iataCode: "PS",
  },
  {
    iataCode: "UH",
  },
  {
    iataCode: "VA",
  },
  {
    iataCode: "VF",
  },
  {
    iataCode: "VC",
  },
  {
    iataCode: "VN",
  },
  {
    iataCode: "NN",
  },
  {
    iataCode: "2R",
  },
  {
    iataCode: "VA",
  },
  {
    iataCode: "Y4",
  },
  {
    iataCode: "VI",
  },
  {
    iataCode: "VX",
  },
  {
    iataCode: "TV",
  },
  {
    iataCode: "VK",
  },
  {
    iataCode: "VS",
  },
  {
    iataCode: "ZG",
  },
  {
    iataCode: "VE",
  },
  {
    iataCode: "VY",
  },
  {
    iataCode: "XF",
  },
  {
    iataCode: "LC",
  },
  {
    iataCode: "VM",
  },
  {
    iataCode: "VA",
  },
  {
    iataCode: "DJ",
  },
  {
    iataCode: "RG",
  },
  {
    iataCode: "VP",
  },
  {
    iataCode: "VG",
  },
  {
    iataCode: "7W",
  },
  {
    iataCode: "WJ",
  },
  {
    iataCode: "2W",
  },
  {
    iataCode: "PT",
  },
  {
    iataCode: "8O",
  },
  {
    iataCode: "WS",
  },
  {
    iataCode: "WA",
  },
  {
    iataCode: "CN",
  },
  {
    iataCode: "WF",
  },
  {
    iataCode: "IV",
  },
  {
    iataCode: "IW",
  },
  {
    iataCode: "K5",
  },
  {
    iataCode: "W6",
  },
  {
    iataCode: "8Z",
  },
  {
    iataCode: "WO",
  },
  {
    iataCode: "1P",
  },
  {
    iataCode: "8V",
  },
  {
    iataCode: "SE",
  },
  {
    iataCode: "MF",
  },
  {
    iataCode: "XP",
  },
  {
    iataCode: "YL",
  },
  {
    iataCode: "Y8",
  },
  {
    iataCode: "IY",
  },
  {
    iataCode: "Q3",
  },
  {
    iataCode: "3J",
  },
  {
    iataCode: "C4",
  },
  {
    iataCode: "Z4",
  },
  {
    iataCode: "\\N",
  },
  {
    iataCode: "UK",
  },
  {
    iataCode: "8Q",
  },
  {
    iataCode: "Y0",
  },
  {
    iataCode: "VJ",
  },
  {
    iataCode: "6T",
  },
  {
    iataCode: "SH",
  },
  {
    iataCode: "BX",
  },
  {
    iataCode: "TB",
  },
  {
    iataCode: "XW",
  },
  {
    iataCode: "BU",
  },
  {
    iataCode: "GH",
  },
  {
    iataCode: "9Y",
  },
  {
    iataCode: "JD",
  },
  {
    iataCode: "ZQ",
  },
  {
    iataCode: "DS",
  },
  {
    iataCode: "2I",
  },
  {
    iataCode: "KW",
  },
  {
    iataCode: "4H",
  },
  {
    iataCode: "M8",
  },
  {
    iataCode: "5H",
  },
  {
    iataCode: "TO",
  },
  {
    iataCode: "WP",
  },
  {
    iataCode: "OG",
  },
  {
    iataCode: "B7",
  },
  {
    iataCode: "YD",
  },
  {
    iataCode: "WZ",
  },
  {
    iataCode: "11",
  },
  {
    iataCode: "FU",
  },
  {
    iataCode: "K1",
  },
  {
    iataCode: "XX",
  },
  {
    iataCode: "7J",
  },
  {
    iataCode: "TM",
  },
  {
    iataCode: "--",
  },
  {
    iataCode: "GY",
  },
  {
    iataCode: "ML",
  },
  {
    iataCode: "VH",
  },
  {
    iataCode: "Z2",
  },
  {
    iataCode: "HK",
  },
  {
    iataCode: "IJ",
  },
  {
    iataCode: "N4",
  },
  {
    iataCode: "ZE",
  },
  {
    iataCode: "LJ",
  },
  {
    iataCode: "SH",
  },
  {
    iataCode: "3O",
  },
  {
    iataCode: "B1",
  },
  {
    iataCode: "YC",
  },
  {
    iataCode: "CN",
  },
  {
    iataCode: "FA",
  },
  {
    iataCode: "3I",
  },
  {
    iataCode: "-.",
  },
  {
    iataCode: "DN",
  },
  {
    iataCode: "L8",
  },
  {
    iataCode: "BU",
  },
  {
    iataCode: "XS",
  },
  {
    iataCode: "IL",
  },
  {
    iataCode: "SZ",
  },
  {
    iataCode: "TQ",
  },
  {
    iataCode: "KT",
  },
  {
    iataCode: "DH",
  },
  {
    iataCode: "ZZ",
  },
  {
    iataCode: "A1",
  },
  {
    iataCode: "UK",
  },
  {
    iataCode: "CB",
  },
  {
    iataCode: "RY",
  },
  {
    iataCode: "99",
  },
  {
    iataCode: "VB",
  },
  {
    iataCode: "5P",
  },
  {
    iataCode: "C1",
  },
  {
    iataCode: "V5",
  },
  {
    iataCode: "SH",
  },
  {
    iataCode: "C2",
  },
  {
    iataCode: "QA",
  },
  {
    iataCode: "W1",
  },
  {
    iataCode: "J4",
  },
  {
    iataCode: "E9",
  },
  {
    iataCode: "3E",
  },
  {
    iataCode: "KN",
  },
  {
    iataCode: "ZQ",
  },
  {
    iataCode: "4Q",
  },
  {
    iataCode: "K5",
  },
  {
    iataCode: "S6",
  },
  {
    iataCode: "IL",
  },
  {
    iataCode: "01",
  },
  {
    iataCode: "V9",
  },
  {
    iataCode: "6D",
  },
  {
    iataCode: "E8",
  },
  {
    iataCode: "J5",
  },
  {
    iataCode: "T8",
  },
  {
    iataCode: "I6",
  },
  {
    iataCode: "IP",
  },
  {
    iataCode: "T0",
  },
  {
    iataCode: "7Q",
  },
  {
    iataCode: "PF",
  },
  {
    iataCode: "3S",
  },
  {
    iataCode: "P7",
  },
  {
    iataCode: "V6",
  },
  {
    iataCode: "P9",
  },
  {
    iataCode: "ЯП",
  },
  {
    iataCode: "OC",
  },
  {
    iataCode: "7Z",
  },
  {
    iataCode: "4P",
  },
  {
    iataCode: "E9",
  },
  {
    iataCode: "K8",
  },
  {
    iataCode: "UJ",
  },
  {
    iataCode: "6Y",
  },
  {
    iataCode: "K7",
  },
  {
    iataCode: "E4",
  },
  {
    iataCode: "HT",
  },
  {
    iataCode: "WD",
  },
  {
    iataCode: "Q9",
  },
  {
    iataCode: "DA",
  },
  {
    iataCode: "8F",
  },
  {
    iataCode: "7Y",
  },
  {
    iataCode: "UQ",
  },
  {
    iataCode: "G6",
  },
  {
    iataCode: "RL",
  },
  {
    iataCode: "4L",
  },
  {
    iataCode: "WG",
  },
  {
    iataCode: "ZF",
  },
  {
    iataCode: "VQ",
  },
  {
    iataCode: "DZ",
  },
  {
    iataCode: "EH",
  },
  {
    iataCode: "L7",
  },
  {
    iataCode: "6P",
  },
  {
    iataCode: "GP",
  },
  {
    iataCode: "SM",
  },
  {
    iataCode: "OQ",
  },
  {
    iataCode: "PN",
  },
  {
    iataCode: "IH",
  },
  {
    iataCode: "C3",
  },
  {
    iataCode: "1C",
  },
  {
    iataCode: "Y7",
  },
  {
    iataCode: "JR",
  },
  {
    iataCode: "CD",
  },
  {
    iataCode: "9H",
  },
  {
    iataCode: "Q2",
  },
  {
    iataCode: "XN",
  },
  {
    iataCode: "VC",
  },
  {
    iataCode: "NA",
  },
  {
    iataCode: "JH",
  },
  {
    iataCode: "5E",
  },
  {
    iataCode: "F8",
  },
  {
    iataCode: "AO",
  },
  {
    iataCode: "PA",
  },
  {
    iataCode: "ES",
  },
  {
    iataCode: "GB",
  },
  {
    iataCode: "MR",
  },
  {
    iataCode: "??",
  },
  {
    iataCode: "??",
  },
  {
    iataCode: "++",
  },
  {
    iataCode: "-+",
  },
  {
    iataCode: "GM",
  },
  {
    iataCode: "::",
  },
  {
    iataCode: ";;",
  },
  {
    iataCode: "^^",
  },
  {
    iataCode: "WQ",
  },
  {
    iataCode: "YY",
  },
  {
    iataCode: "KY",
  },
  {
    iataCode: "BQ",
  },
  {
    iataCode: "CQ",
  },
  {
    iataCode: "WU",
  },
  {
    iataCode: "47",
  },
  {
    iataCode: "LQ",
  },
  {
    iataCode: "BZ",
  },
  {
    iataCode: "K6",
  },
  {
    iataCode: "D5",
  },
  {
    iataCode: "H3",
  },
  {
    iataCode: "69",
  },
  {
    iataCode: "&T",
  },
  {
    iataCode: "AD",
  },
  {
    iataCode: "PQ",
  },
  {
    iataCode: "C4",
  },
  {
    iataCode: "X1",
  },
  {
    iataCode: "GK",
  },
  {
    iataCode: "XZ",
  },
  {
    iataCode: "FZ",
  },
  {
    iataCode: "D1",
  },
  {
    iataCode: "9A",
  },
  {
    iataCode: "CR",
  },
  {
    iataCode: "JY",
  },
  {
    iataCode: "YZ",
  },
  {
    iataCode: "YP",
  },
  {
    iataCode: "UR",
  },
  {
    iataCode: "G5",
  },
  {
    iataCode: "ZP",
  },
  {
    iataCode: "M4",
  },
  {
    iataCode: "N1",
  },
  {
    iataCode: "4Z",
  },
  {
    iataCode: "3B",
  },
  {
    iataCode: "OD",
  },
  {
    iataCode: "BZ",
  },
  {
    iataCode: "GM",
  },
  {
    iataCode: "TB",
  },
  {
    iataCode: "TH",
  },
  {
    iataCode: "9C",
  },
  {
    iataCode: "NJ",
  },
  {
    iataCode: "TJ",
  },
  {
    iataCode: "P8",
  },
  {
    iataCode: "H3",
  },
  {
    iataCode: "HH",
  },
  {
    iataCode: "Z6",
  },
  {
    iataCode: "TI",
  },
  {
    iataCode: "YT",
  },
  {
    iataCode: "Y1",
  },
  {
    iataCode: "NS",
  },
  {
    iataCode: "S1",
  },
  {
    iataCode: "WM",
  },
  {
    iataCode: "YO",
  },
  {
    iataCode: "CB",
  },
  {
    iataCode: "SF",
  },
  {
    iataCode: "F1",
  },
  {
    iataCode: "1F",
  },
  {
    iataCode: "3F",
  },
  {
    iataCode: "T6",
  },
  {
    iataCode: "МИ",
  },
  {
    iataCode: "HC",
  },
  {
    iataCode: "G1",
  },
  {
    iataCode: "WG",
  },
  {
    iataCode: "ZX",
  },
  {
    iataCode: "N0",
  },
  {
    iataCode: "W7",
  },
  {
    iataCode: "H9",
  },
  {
    iataCode: "IJ",
  },
  {
    iataCode: "QC",
  },
  {
    iataCode: "N6",
  },
  {
    iataCode: "RS",
  },
  {
    iataCode: "YI",
  },
  {
    iataCode: "II",
  },
  {
    iataCode: "BU",
  },
  {
    iataCode: "L4",
  },
  {
    iataCode: "Z7",
  },
  {
    iataCode: "6U",
  },
  {
    iataCode: "7M",
  },
  {
    iataCode: "2D",
  },
  {
    iataCode: "TW",
  },
  {
    iataCode: "HI",
  },
  {
    iataCode: "JX",
  },
  {
    iataCode: "XB",
  },
  {
    iataCode: "W4",
  },
  {
    iataCode: "KH",
  },
  {
    iataCode: "E8",
  },
  {
    iataCode: "GN",
  },
  {
    iataCode: "E1",
  },
  {
    iataCode: "HN",
  },
  {
    iataCode: "RR",
  },
  {
    iataCode: "Z7",
  },
  {
    iataCode: "1H",
  },
  {
    iataCode: "PT",
  },
  {
    iataCode: "QY",
  },
  {
    iataCode: "0G",
  },
  {
    iataCode: "4X",
  },
  {
    iataCode: "Y8",
  },
  {
    iataCode: "7H",
  },
  {
    iataCode: "R8",
  },
  {
    iataCode: "H1",
  },
  {
    iataCode: "D5",
  },
  {
    iataCode: "10",
  },
  {
    iataCode: "H5",
  },
  {
    iataCode: "IJ",
  },
  {
    iataCode: "DN",
  },
  {
    iataCode: "VB",
  },
  {
    iataCode: "KT",
  },
  {
    iataCode: "XV",
  },
  {
    iataCode: "SO",
  },
  {
    iataCode: "ZJ",
  },
  {
    iataCode: "YQ",
  },
  {
    iataCode: "T1",
  },
  {
    iataCode: "12",
  },
  {
    iataCode: "L6",
  },
  {
    iataCode: "6F",
  },
  {
    iataCode: "AW",
  },
  {
    iataCode: "E5",
  },
  {
    iataCode: "CT",
  },
  {
    iataCode: "OI",
  },
  {
    iataCode: "Y5",
  },
  {
    iataCode: "XR",
  },
  {
    iataCode: "NP",
  },
  {
    iataCode: "DN",
  },
  {
    iataCode: "6I",
  },
  {
    iataCode: "S9",
  },
  {
    iataCode: "0X",
  },
  {
    iataCode: "8B",
  },
  {
    iataCode: "YR",
  },
  {
    iataCode: "C7",
  },
  {
    iataCode: "PP",
  },
  {
    iataCode: "07",
  },
  {
    iataCode: "00",
  },
  {
    iataCode: "U1",
  },
  {
    iataCode: "MM",
  },
  {
    iataCode: "U1",
  },
  {
    iataCode: "DF",
  },
  {
    iataCode: "ZC",
  },
  {
    iataCode: "I5",
  },
  {
    iataCode: "9P",
  },
  {
    iataCode: "B0",
  },
  {
    iataCode: "76",
  },
  {
    iataCode: "77",
  },
  {
    iataCode: "KP",
  },
  {
    iataCode: "78",
  },
  {
    iataCode: "I2",
  },
  {
    iataCode: "4O",
  },
  {
    iataCode: "OG",
  },
  {
    iataCode: "NJ",
  },
  {
    iataCode: "TR",
  },
  {
    iataCode: "SX",
  },
  {
    iataCode: "5K",
  },
  {
    iataCode: "WH",
  },
  {
    iataCode: "ZN",
  },
  {
    iataCode: "O1",
  },
  {
    iataCode: "A6",
  },
  {
    iataCode: "P4",
  },
  {
    iataCode: "V2",
  },
  {
    iataCode: "C8",
  },
  {
    iataCode: "5Q",
  },
  {
    iataCode: "YE",
  },
  {
    iataCode: "KG",
  },
  {
    iataCode: "FH",
  },
  {
    iataCode: "2D",
  },
  {
    iataCode: "YH",
  },
  {
    iataCode: "TJ",
  },
  {
    iataCode: "SX",
  },
  {
    iataCode: "J7",
  },
  {
    iataCode: "W2",
  },
  {
    iataCode: "WL",
  },
  {
    iataCode: "E6",
  },
  {
    iataCode: "24",
  },
  {
    iataCode: "00",
  },
  {
    iataCode: "HQ",
  },
  {
    iataCode: "R1",
  },
  {
    iataCode: "Q3",
  },
  {
    iataCode: "J7",
  },
  {
    iataCode: "OE",
  },
  {
    iataCode: "OE",
  },
  {
    iataCode: "OE",
  },
  {
    iataCode: "NO",
  },
  {
    iataCode: "OD",
  },
  {
    iataCode: "9F",
  },
  {
    iataCode: "GC",
  },
  {
    iataCode: "Z9",
  },
  {
    iataCode: "I8",
  },
  {
    iataCode: "3V",
  },
  {
    iataCode: "M1",
  },
  {
    iataCode: "7I",
  },
  {
    iataCode: "5Z",
  },
  {
    iataCode: "ZM",
  },
  {
    iataCode: "M2",
  },
  {
    iataCode: "NR",
  },
  {
    iataCode: "GD",
  },
  {
    iataCode: "SL",
  },
  {
    iataCode: "DW",
  },
  {
    iataCode: "N8",
  },
  {
    iataCode: "13",
  },
  {
    iataCode: "QG",
  },
  {
    iataCode: "GU",
  },
  {
    iataCode: "XP",
  },
  {
    iataCode: "S8",
  },
  {
    iataCode: "KH",
  },
  {
    iataCode: "XA",
  },
  {
    iataCode: "LB",
  },
  {
    iataCode: "F5",
  },
  {
    iataCode: "XP",
  },
  {
    iataCode: "3W",
  },
  {
    iataCode: "..",
  },
  {
    iataCode: "RN",
  },
  {
    iataCode: "RY",
  },
  {
    iataCode: "RX",
  },
  {
    iataCode: "RU",
  },
  {
    iataCode: "RM",
  },
  {
    iataCode: "QD",
  },
  {
    iataCode: "S0",
  },
  {
    iataCode: "L1",
  },
  {
    iataCode: "A2",
  },
  {
    iataCode: "L9",
  },
  {
    iataCode: "9A",
  },
  {
    iataCode: "N4",
  },
  {
    iataCode: "N9",
  },
  {
    iataCode: "N7",
  },
  {
    iataCode: "9N",
  },
  {
    iataCode: "??",
  },
  {
    iataCode: "8K",
  },
  {
    iataCode: "7O",
  },
  {
    iataCode: "2X",
  },
  {
    iataCode: "9X",
  },
  {
    iataCode: "9J",
  },
  {
    iataCode: "6C",
  },
  {
    iataCode: "88",
  },
  {
    iataCode: "ER",
  },
  {
    iataCode: "PO",
  },
  {
    iataCode: "8M",
  },
  {
    iataCode: "UK",
  },
  {
    iataCode: "UQ",
  },
  {
    iataCode: "UQ",
  },
  {
    iataCode: "2Y",
  },
  {
    iataCode: "RH",
  },
  {
    iataCode: "BS",
  },
  {
    iataCode: "1I",
  },
  {
    iataCode: "B3",
  },
  {
    iataCode: "B9",
  },
  {
    iataCode: "XT",
  },
  {
    iataCode: "QE",
  },
  {
    iataCode: "O3",
  },
  {
    iataCode: "RX",
  },
  {
    iataCode: "3G",
  },
];

export const GetAirlineName = ({ iataCode }) => {
  const [cookies, setCookie] = useCookies([`${iataCode}-airline`]);

  const fetcher = async () => {
    if (iataCode && cookies[`${iataCode}-airline`])
      return cookies[`${iataCode}-airline`];
    let config = {
      method: "get",
      url: `https://${baseUrl}/v1/reference-data/airlines?airlineCodes=${iataCode}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("access_token")
        )}`,
      },
    };

    try {
      const response = await axiosAirxplora(config, 5);
      console.log("response", response);
      setCookie(`${iataCode}-airline`, response.data.data);
      return response.data.data;
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const { data, error } = useSWR(iataCode, fetcher);
  if (!data && !error)
    return (
      <Skeleton animation="wave">
        <Typography>British Airways</Typography>
      </Skeleton>
    );

  if (error) return <span>{iataCode}</span>;
  let text;
  try {
    text = startCase(lowerCase(first(data)["businessName"]));
  } catch (error) {
    console.log(`error`, error);
    text = iataCode;
  }
  return <span>{text}</span>;
};

export const updateFlightOffer = (flightOffer, commissions) => {
  const validatingAirlineCode = first(flightOffer.validatingAirlineCodes);
  let nuc = flightOffer.price.base;
  let markup1;
  let markup = 0;
  try {
    commissions.forEach((commission) => {
      const {
        col2: { iataCode },
        col3,
        col4,
        col5,
        col6,
      } = commission;
      if (validatingAirlineCode === iataCode) {
        switch (col3) {
          case "Mark Up (%)":
            markup1 = (Number(col4) * Number(nuc)) / 100;
            markup = markup + markup1;
            break;
          case "Mark Down (%)":
            markup1 = (Number(col4) * Number(nuc)) / 100;
            markup = markup - markup1;
            break;
          case "Mark Up (₦)":
            markup1 = Number(col4);
            markup = markup + markup1;
            break;
          case "Mark Down (₦)":
            markup1 = Number(col4);
            markup = markup - markup1;
            break;
          default:
            break;
        }
        switch (col5) {
          case "Mark Up (%)":
            markup1 = (Number(col6) * Number(nuc)) / 100;
            markup = markup + markup1;
            break;
          case "Mark Down (%)":
            markup1 = (Number(col6) * Number(nuc)) / 100;
            markup = markup - markup1;
            break;
          case "Mark Up (₦)":
            markup1 = Number(col6);
            markup = markup + markup1;
            break;
          case "Mark Down (₦)":
            markup1 = Number(col6);
            markup = markup - markup1;
            break;
          default:
            break;
        }
      }
    });
    return {
      ...flightOffer,
      markup,
      prevPrice: { ...flightOffer.price },
      price: {
        ...flightOffer.price,
        grandTotal: Number(flightOffer.price.grandTotal) + markup,
      },
    };
  } catch (err) {
    console.log("error updating offer", err);
    return { ...flightOffer, prevPrice: { ...flightOffer.price } };
  }
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return JSON.parse(c.substring(name.length, c.length));
    }
  }
  return {};
};

export const sendEmail = async (theOrder, theDictionary, theDialogText) => {
  if (window === undefined) {
    console.log(`undefined window`);
    return;
  }
  const bookedDate = theOrder.associatedRecords
    .filter((record) => record.originSystemCode === "GDS")
    .map((record) => dayjs(record.creationDate).format("ddd DD MMM YYYY"));
  console.log(`bookedDate`, bookedDate);
  const penalties = theDialogText[0].fareNotes.filter(
    (note) => note.descriptionType === "PENALTIES"
  )[0].text;
  const travelers = theOrder.travelers.map(
    (traveler) =>
      `<span style="display: block">${traveler.name.lastName} / ${traveler.name.firstName}</span>`
  );
  const reference = theOrder.associatedRecords.map(
    (record) =>
      `<span style="display: block">${
        record.originSystemCode === "GDS"
          ? "Amadeus"
          : startCase(
              lowerCase(theDictionary.carriers[record.originSystemCode])
            )
      } Reference : ${record.reference}</span>`
  );
  console.log(`reference`, reference);

  let itiString = theOrder.flightOffers[0].itineraries.map(
    (itinerary, indexItinerary) => {
      return itinerary.segments.map((segment, indexSegment) => {
        return `

        ${
          indexItinerary > 0 && indexSegment === 0
            ? `<div style="margin-bottom: 20px"><hr /></div>`
            : ``
        }


      <div>
      <table
      style="
        background-color: rgba(0, 0, 253, 0.205);
        padding-left: 10px;
        color: black;
        padding-right: 10px;
        width: 100%;
      "
    >
      <td>
        <p>${
          getCookie(segment.departure.iataCode)["cityName"]
            ? startCase(
                lowerCase(getCookie(segment.departure.iataCode)["cityName"])
              )
            : `${segment.departure.iataCode} City`
        }</p>
        <p>${
          getCookie(segment.departure.iataCode)["airportName"]
            ? startCase(
                lowerCase(getCookie(segment.departure.iataCode)["airportName"])
              )
            : `${segment.departure.iataCode} Airport`
        }</p>
        <p>${dayjs(segment.departure.at).format("ddd DD MMM YYYY, h:mma")}</p>
      </td>
      <td style="text-align: center">
        <span>${startCase(
          lowerCase(theDictionary.carriers[segment.carrierCode])
        )} ${segment.carrierCode}${
          segment.aircraft.code
        }</span><span><hr /></span
        ><span>${segment.co2Emissions[0].cabin}</span>
      </td>
      <td>
        <div>
          <div style="width: fit-content; float: right">
          <p>${
            getCookie(segment.arrival.iataCode)["cityName"]
              ? startCase(
                  lowerCase(getCookie(segment.arrival.iataCode)["cityName"])
                )
              : `${segment.arrival.iataCode} City`
          }</p>
          <p>${
            getCookie(segment.arrival.iataCode)["airportName"]
              ? startCase(
                  lowerCase(getCookie(segment.arrival.iataCode)["airportName"])
                )
              : `${segment.arrival.iataCode} Airport`
          }</p>
            <p>${dayjs(segment.arrival.at).format("ddd DD MMM YYYY, h:mma")}</p>
          </div>
        </div>
      </td>
    </table>
    </div>

   
    `;
      });
    }
  );

  console.log(`itiString`, itiString);
  let body = window.document.createElement("div");
  let email = window.document.createElement("div");

  email.innerHTML = `<table
  style="
    background-color: rgba(0, 0, 253, 0.205);
    color: black;
    width: 100%;
    padding: 10px;
  "
>
  <td>
    <div style="text-align: start; color: black">
      <p>${travelers.toLocaleString()}</p>
      <p>Booked on ${bookedDate.toLocaleString()}</p>
      <p>${reference.toLocaleString()}</p>
    </div>
  </td>
  <td>
    <div>
      <div style="width: fit-content; float: right; color: black">
        <p>${theOrder.contacts[0].companyName}</p>
        <p style="text-decoration: none">${
          theOrder.contacts[0].emailAddress
        }</p>
        <p>${theOrder.contacts[0].phones[0].number}</p>
      </div>
    </div>
  </td>
</table>
<div style="margin-left: 10px; margin-right: 10px">
    <p>Hello ${startCase(lowerCase(theOrder.travelers[0].name.lastName))},</p>
    Thank you for booking your flight with ${startCase(
      lowerCase(theOrder.contacts[0].companyName)
    )}. This is not your
    E-Ticket. Once we have processed your payment, you will receive your
    e-ticket in a separate email.
  </div>
  <div style="margin-left: 10px; margin-right: 10px">
    <h3>Payment Details: &#8358; ${
      theOrder.flightOffers[0].price.grandTotal
    }</h3>
    <p>
      Bank : Gtbank <br />A/c: 0124782296 <br />Name: NaijagoingAbroad Ltd
    </p>
  </div>

    <h2 style="text-align: center">Itinerary</h2>
    <h3 style="text-align: center">
    
    ${
      getCookie(
        theOrder.flightOffers[0].itineraries[0].segments[0].departure.iataCode
      )["cityName"]
        ? startCase(
            lowerCase(
              getCookie(
                theOrder.flightOffers[0].itineraries[0].segments[0].departure
                  .iataCode
              )["cityName"]
            )
          )
        : `${theOrder.flightOffers[0].itineraries[0].segments[0].departure.iataCode} City`
    }
    
 - 
 
 ${
   getCookie(
     theOrder.flightOffers[0].itineraries[0].segments[
       theOrder.flightOffers[0].itineraries[0].segments.length - 1
     ].arrival.iataCode
   )["cityName"]
     ? startCase(
         lowerCase(
           getCookie(
             theOrder.flightOffers[0].itineraries[0].segments[
               theOrder.flightOffers[0].itineraries[0].segments.length - 1
             ].arrival.iataCode
           )["cityName"]
         )
       )
     : `${
         theOrder.flightOffers[0].itineraries[0].segments[
           theOrder.flightOffers[0].itineraries[0].segments.length - 1
         ].arrival.iataCode
       } City`
 }

</h3>
    ${itiString.toLocaleString()}

    <div style="margin-top: 100px; margin-right: 10px; margin-left: 10px">
    <h3 style="text-align: center">Fare Rules</h3>
    <table style="width: 100%">
      <td>Fare Code: ${theDialogText[0].fareBasis}</td>
      <td style="text-align: right">
         Name: ${theDialogText[0].name}
      </td>
    </table>
    <p>
      ${penalties}
    </p>
  </div>
`;

  body.prepend(email);
  // document.body.prepend(body);
  //  console.log(`email`, body);

  const trip = `${
    getCookie(
      theOrder.flightOffers[0].itineraries[0].segments[0].departure.iataCode
    )["cityName"]
      ? startCase(
          lowerCase(
            getCookie(
              theOrder.flightOffers[0].itineraries[0].segments[0].departure
                .iataCode
            )["cityName"]
          )
        )
      : `${theOrder.flightOffers[0].itineraries[0].segments[0].departure.iataCode} City`
  } - ${
    getCookie(
      theOrder.flightOffers[0].itineraries[0].segments[
        theOrder.flightOffers[0].itineraries[0].segments.length - 1
      ].arrival.iataCode
    )["cityName"]
      ? startCase(
          lowerCase(
            getCookie(
              theOrder.flightOffers[0].itineraries[0].segments[
                theOrder.flightOffers[0].itineraries[0].segments.length - 1
              ].arrival.iataCode
            )["cityName"]
          )
        )
      : `${
          theOrder.flightOffers[0].itineraries[0].segments[
            theOrder.flightOffers[0].itineraries[0].segments.length - 1
          ].arrival.iataCode
        } City`
  }`;

  const bodyString = `<html>${body.innerHTML}</html>`;

  const data = {
    body: bodyString,
    email: theOrder.travelers[0].contact.emailAddress,
    trip: trip,
  };
  console.log(`data`, data);
  const config = {
    url: "https://hook.integromat.com/w4nxtnxghdfh0bnoscwgz6tmxrq6j4rg",
    data: data,
    method: "post",
  };

  try {
    const request = await axiosAirxplora(config, 1);
    console.log(`request`, request);
  } catch (error) {
    console.log(`error`, error);
  }
};
