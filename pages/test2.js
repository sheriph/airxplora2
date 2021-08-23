import { Typography } from "@material-ui/core";
import { lowerCase, startCase } from "lodash";
import useSWR from "swr";
import { axiosAirxplora } from "../lib/utilities";

export default function HalfCircle({ key = "MUC" }) {
  const fetcher = async () => {
    let config = {
      method: "get",
      url: "https://test.api.amadeus.com/v1/reference-data/locations/AMUC",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("access_token")
        )}`,
      },
    };

    try {
      const response = await axiosAirxplora(config, 5);
      console.log("response", response);
      try {
        const string = response.data.data.name.toLowerCase().includes("airport")
          ? response.data.data.name
          : `${response.data.data.name} Airport`;
        return startCase(lowerCase(string));
      } catch (error) {
        console.log("error :>> ", error);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const { data, error } = useSWR(key, fetcher);

  console.log("data, error: ", data, error);

  return <Typography>{data ? data : `${key} Airport`}</Typography>;
}
