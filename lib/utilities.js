import axios from "axios";
import dayjs from "dayjs";
import { first, keys, last, pick, pickBy, valuesIn } from "lodash";
import { stringify } from "qs";
import { useEffect, useState } from "react";
import { lowerCase, startCase } from "lodash";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import * as yup from "yup";

export const axiosAirxplora = async (config, maxRetry) => {
  const { method, url } = config;
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
    url: "https://test.api.amadeus.com/v1/security/oauth2/token",
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
    url: `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${keyword}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=LIGHT`,
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
    url: "https://test.api.amadeus.com/v2/shopping/flight-offers",
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
      url: `https://test.api.amadeus.com/v1/reference-data/locations/A${key}`,
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
    url: "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing?include=bags,other-services,detailed-fare-rules&forceClass=false",
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
