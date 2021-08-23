import { Box, Typography, useMediaQuery } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import FlightIcon from "@material-ui/icons/Flight";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { useCookies } from "react-cookie";
import { getDayOfWeek, getMonth } from "../../lib/utilities";

export default function StyleDate() {
  const miniPhone = useMediaQuery("(max-width:350px)");

  const [cookies, setCookie] = useCookies(["xpaformData"]);
  console.log(`cookies`, cookies.xpaformData);

  const tripType = cookies.xpaformData?.tripType;
  const from = cookies.xpaformData?.from;
  const to = cookies.xpaformData?.to;
  const depDate = cookies.xpaformData?.depDate;

  console.log("date", getMonth(dayjs(depDate).month()));
  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <Grid item style={{ paddingRight: miniPhone ? "0" : "20px" }}>
        <Grid
          container
          style={{ position: "relative", top: "15px", right: "6px" }}
          justifyContent="center"
        >
          <Typography>{from?.iataCode}</Typography>
        </Grid>
        <Grid container alignContent="center" alignItems="center">
          <Grid item>
            <TrendingFlatIcon
              style={{
                transform: "rotate(90deg)",
                fontSize: "40px",
              }}
            />
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>{getDayOfWeek(dayjs(depDate).day())}</Grid>
              <Grid item>{getMonth(dayjs(depDate).month())}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: "45px" }}>08</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          style={{ position: "relative", bottom: "15px", right: "6px" }}
          justifyContent="center"
        >
          <Typography>{to?.iataCode}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Box>
          <FlightIcon
            style={{ fontSize: "15px", transform: "rotate(45deg)" }}
          />
        </Box>
        <Box>
          <FlightIcon
            style={{ fontSize: "15px", transform: "rotate(315deg)" }}
          />
        </Box>
      </Grid>
      <Grid item>
        <Grid
          container
          style={{ position: "relative", top: "15px", right: "6px" }}
          justifyContent="center"
        >
          <Typography>LHR</Typography>
        </Grid>
        <Grid container alignContent="center" alignItems="center">
          <Grid item>
            <TrendingFlatIcon
              style={{
                transform: "rotate(90deg)",
                fontSize: "40px",
              }}
            />
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>WED</Grid>
              <Grid item>SEP</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: "45px" }}>08</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          style={{ position: "relative", bottom: "15px", right: "6px" }}
          justifyContent="center"
        >
          <Typography>LOS</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
