import { Button } from "@material-ui/core";
import { axiosAirxplora } from "../lib/utilities";

export default function GetAirlineName({ key }) {
  // console.log(`key`, key);

  const fetcher = async () => {
    let config = {
      method: "post",
      url: "/api/updatecommission",
      data: {
        commission: [1, 2, 3],
      },
    };

    try {
      const response = await axiosAirxplora(config, 3);
      console.log("response", response);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return <Button onClick={fetcher}>Hello</Button>;
}
