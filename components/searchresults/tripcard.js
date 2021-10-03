import { Button, Hidden, Typography, useMediaQuery } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import dayjs from "dayjs";
import { lowerCase, startCase, truncate, uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { getCabin, useMoney } from "../../lib/utilities";
import OneStop from "./onestop";
import TripLine from "./tripline";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import MyDrawer from "../others/drawer";
import DetailedTripInfo from "./detailedtripinfo";
import { useRecoilState } from "recoil";
import {
  farerules_,
  flightOffer_,
  included_,
  openDrawer_,
  tab_,
} from "../../lib/state";
import CustomizedDialogs from "../others/dialog";

export default function TripCard({ flightOffer, carriers, dictionaries }) {
  //  console.log(`flightOffer`, flightOffer);
  const tab = useMediaQuery("(max-width:960px)");
  const {
    itineraries,
    price: { grandTotal },
    travelerPricings: [firstTraveller, ...rest],
  } = flightOffer;
  const { fareDetailsBySegment } = firstTraveller;
  // console.log(`flightOffer`, flightOffer);
  const [flightOfferState, setFlightOffer] = useRecoilState(flightOffer_);
  const [open, setOpen] = useRecoilState(openDrawer_);
  const [openDialog, setOpenDialog] = useState(false);
  const [included, setIncluded] = useRecoilState(included_);
  const [activeTab, setTab] = useRecoilState(tab_);
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
    console.log(`dialogText`, dialogText);
  } catch (error) {
    console.log(`fare rules error`, error);
  }

  useEffect(() => {
    if (dialogText && activeTab === "3") setRules(dialogText);
  }, [null]);

  return (
    <>
      <CustomizedDialogs
        handleClose={() => setOpenDialog(false)}
        open={openDialog}
        title="Ticket Rules"
      >
        {dialogText && (
          <Box>
            {dialogText.map((rules, index) => (
              <div key={index}>
                <Grid container spacing={3}>
                  <Grid item>Fare Code: {rules?.fareBasis} </Grid>
                  <Grid item>Name: {startCase(lowerCase(rules?.name))} </Grid>
                  <Grid item container>
                    {rules?.fareNotes && (
                      <div>
                        {rules?.fareNotes.map((note, index) => (
                          <Typography
                            style={{ whiteSpace: "pre-wrap" }}
                            key={index}
                          >
                            {note?.text}
                          </Typography>
                        ))}
                      </div>
                    )}
                  </Grid>
                </Grid>
              </div>
            ))}
          </Box>
        )}
      </CustomizedDialogs>
      <Container
        style={{ display: "flex", paddingTop: "10px" }}
        component={Paper}
      >
        <Grid
          container
          alignContent="center"
          alignItems="center"
          spacing={tab ? 1 : 4}
        >
          <Grid item xs>
            {itineraries.map((itinerary, index) => {
              //  console.log("itinerary", itinerary);
              const { segments } = itinerary;
              const { duration } = itinerary;
              const firstSegment = segments[0];
              const { id: segmentId } = firstSegment;
              const { carrierCode } = firstSegment;
              const departure = firstSegment.departure;
              const lastSegment = segments[segments.length - 1];
              const arrival = lastSegment.arrival;
              const departureTime = dayjs(departure.at).format("h:ma");
              const arrivalTime = dayjs(arrival.at).format("h:ma");
              const departureAirport = departure.iataCode;
              const arrivalAirport = arrival.iataCode;
              //  console.log(departure, arrival);
              const stop = segments.length - 1;
              const stopOver = stop === 0 ? "Direct" : `${stop} Stop`;
              return (
                <Grid container key={index}>
                  <Grid container spacing={tab ? 1 : 4}>
                    <Grid item md={4}>
                      <Grid
                        container
                        alignContent="center"
                        alignItems="center"
                        spacing={3}
                      >
                        <Grid item>
                          <img
                            src={`/airlinelogo/${carrierCode}32.png`}
                            width="32px"
                            height="32px"
                          />
                        </Grid>
                        <Hidden smDown>
                          <Grid item>
                            {truncate(
                              startCase(lowerCase(carriers[carrierCode])),
                              { length: 15 }
                            )}
                          </Grid>
                        </Hidden>
                      </Grid>
                    </Grid>
                    <Grid item xs>
                      <OneStop
                        cabin={getCabin(segmentId, fareDetailsBySegment)}
                        departureTime={departureTime}
                        arrivalTime={arrivalTime}
                        arrivalAirport={arrivalAirport}
                        departureAirport={departureAirport}
                        stopOver={stopOver}
                        duration={duration.split("T")[1].toLocaleLowerCase()}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Hidden smDown>
            <Grid item>
              <Grid container justifyContent="flex-start" direction="column">
                <Grid item>
                  <Typography>{useMoney(grandTotal)}</Typography>
                </Grid>
                <Grid item>
                  <Box my={1}>
                    <Button
                      endIcon={<OpenInNewIcon />}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setFlightOffer(flightOffer);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Grid>
                {dialogText && activeTab === "3" && (
                  <Grid item>
                    <Box my={1}>
                      <Button
                        endIcon={<OpenInNewIcon />}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                      >
                        Rules
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid item xs={12}>
              <Grid
                container
                alignContent="center"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Box mb={1}>
                    <Typography>{useMoney(grandTotal)}</Typography>
                  </Box>
                </Grid>
                {dialogText && activeTab === "3" && (
                  <Grid item>
                    <Box mb={1}>
                      <Button
                        endIcon={<OpenInNewIcon />}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                      >
                        Rules
                      </Button>
                    </Box>
                  </Grid>
                )}
                <Grid item>
                  <Box mb={1}>
                    <Button
                      endIcon={<OpenInNewIcon />}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setFlightOffer(flightOffer);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </>
  );
}
