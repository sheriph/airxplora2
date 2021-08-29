import { Button, Typography } from "@material-ui/core";
import { lowerCase, startCase } from "lodash";
import useSWR from "swr";
import { axiosAirxplora } from "../lib/utilities";

export default function HalfCircle({ key = "MUC" }) {
  const verifyPrice = async (flightOffer) => {
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
        Authorization: "Bearer w7eWtOF8VcKxg6B5mUqHXTnhdnFr",
      },
      data: data,
    };

    try {
      const response = await axiosAirxplora(config, 5);
      console.log("response", response);
      return response.data
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return <Button>verify</Button>;
}
