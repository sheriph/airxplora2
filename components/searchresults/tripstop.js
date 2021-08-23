import { Box, Divider, makeStyles, Typography } from "@material-ui/core";
import { Grid, Paper } from "@material-ui/core";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import FlightIcon from "@material-ui/icons/Flight";
import AirlineSeatLegroomExtraIcon from "@material-ui/icons/AirlineSeatLegroomExtra";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { Alert } from "@material-ui/lab";
import PanToolIcon from "@material-ui/icons/PanTool";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import FlightLandIcon from "@material-ui/icons/FlightLand";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Collapse } from "@material-ui/core";
import { useState } from "react";
import CustomAccordion from "../others/customaccordion";
import { lowerCase, startCase } from "lodash";

const styles = makeStyles((theme) => ({
  spanText: {},
  paper: { padding: theme.spacing(1) },
  alertIconDiv: { position: "absolute" },
}));

export default function TripStop({
  lastLeg = false,
  depAirport = "London Heathrow (LHR) ",
  arrAirport = "London Heathrow (LHR) ",
  depart = "1:45pm, Tue 31 Aug.",
  arrive = "4:45pm, Wed 31 Dec.",
  baggage = ["Adult: 23Kg *2", "Child: 23Kg *2", "Infant: 23Kg *2"],
  cabin = "Economy",
  layover = "5h20m",
  //  stopOver = true,
  carrierCode = "KQ",
  aircraftCode = "Boeing 50",
  operatingCarrierCode = "Kenya Airways",
  duration = "23h30m",
  carriers = {},
}) {
  const classes = styles();

  const [showBaggage, setShowBaggage] = useState(false);

  return (
    <>
      <Alert severity="success" className={classes.paper} elevation={10}>
        <Grid container spacing={1}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                spacing={1}
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography>{depAirport}</Typography>
                </Grid>
                <Grid item xs>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`Depart : ${depart}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomAccordion
                title={startCase(lowerCase(carriers[carrierCode]))}
                icon={
                  <img
                    src={`/airlinelogo/${carrierCode}32.png`}
                    width="24px"
                    height="24px"
                  />
                }
              >
                <Box>
                  <Typography>
                    {startCase(lowerCase(aircraftCode))} Operated By{" "}
                    {startCase(lowerCase(operatingCarrierCode))}
                  </Typography>
                </Box>
              </CustomAccordion>
            </Grid>
            <Grid item xs={12}>
              <CustomAccordion
                title="Baggage Allowance"
                icon={<LocalMallIcon color="primary" />}
              >
                Not Available
              </CustomAccordion>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={1}
                alignContent="center"
                alignItems="center"
              >
                <Grid item>
                  <AirlineSeatLegroomExtraIcon
                    color="primary"
                    fontSize="small"
                  />
                </Grid>
                <Grid item>
                  <Typography>{startCase(lowerCase(cabin))}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                spacing={1}
                alignContent="center"
                alignItems="center"
              >
                <Grid item xs>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography>{arrAirport}</Typography>
                </Grid>
                <Grid item xs>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`Arrive : ${arrive}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`Duration : ${duration.toLocaleLowerCase()}`}</Typography>
            </Grid>
          </Grid>

          {!lastLeg && (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={1}
                  alignContent="center"
                  alignItems="center"
                >
                  <Grid item xs>
                    <Divider />
                  </Grid>
                  <Grid item>
                    <Typography>Layover Time: {layover}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Alert>
    </>
  );
}
