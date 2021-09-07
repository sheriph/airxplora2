import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React from "react";
import LazyLoad from "react-lazyload";
import TripCard from "./tripcard";

export default function SearchResult_({ flightOffers, carriers, dictionary }) {
  if (!flightOffers)
    return <Typography>Please Make a new search ...</Typography>;

  return (
    <Grid container>
      {flightOffers.map((flightOffer, index) => (
        <LazyLoad
          style={{ width: "100%", paddingBottom: "15px" }}
          key={index}
          height="100%"
        >
          <Grid item xs={12}>
            <TripCard
              flightOffer={flightOffer}
              dictionaries={dictionary}
              carriers={carriers}
            />
          </Grid>
        </LazyLoad>
      ))}
    </Grid>
  );
}
export const SearchResult = React.memo(SearchResult_);
