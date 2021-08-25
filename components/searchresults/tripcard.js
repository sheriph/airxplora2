import { Button, Hidden, Typography, useMediaQuery } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import dayjs from "dayjs";
import { lowerCase, startCase, truncate } from "lodash";
import { useEffect, useState } from "react";
import { getCabin, useMoney } from "../../lib/utilities";
import OneStop from "./onestop";
import TripLine from "./tripline";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import MyDrawer from "../others/drawer";
import DetailedTripInfo from "./detailedtripinfo";
import { useRecoilState } from "recoil";
import { dictionary_, flightOffer_, openDrawer_ } from "../../lib/state";

export default function TripCard({ flightOffer, carriers, dictionaries }) {
  const tab = useMediaQuery("(max-width:960px)");
  const {
    itineraries,
    price: { grandTotal },
    travelerPricings: [firstTraveller, ...rest],
  } = flightOffer;
  const { fareDetailsBySegment } = firstTraveller;
  console.log(`flightOffer`, flightOffer);
  const [flightOfferState, setFlightOffer] = useRecoilState(flightOffer_);
  const [open, setOpen] = useRecoilState(openDrawer_);
  const [dictionary, setDictionary] = useRecoilState(dictionary_);

  return (
    <>
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
              console.log("itinerary", itinerary);
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
              console.log(departure, arrival);
              const stop = segments.length - 1;
              const stopOver = stop === 0 ? "Direct" : `${stop} Stop`;
              return (
                <Grid container key={index}>
                  <Grid container spacing={tab ? 1 : 4}>
                    <Grid item md={3}>
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
                              { length: 20 }
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
                        setDictionary(dictionaries);
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
          <Hidden mdUp>
            <Grid item xs={12}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>{useMoney(grandTotal)}</Typography>
                </Grid>
                <Grid item>
                  <Box mb={1}>
                    <Button
                      endIcon={<OpenInNewIcon />}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setFlightOffer(flightOffer);
                        setDictionary(dictionaries);
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
