import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React from "react";
import LazyLoad from "react-lazyload";
import TripCard from "./tripcard";
import { LazyLoadComponent } from 'react-lazy-load-image-component';

export default function SearchResult_({ flightOffers, carriers, dictionary }) {
  if (!flightOffers)
    return <Typography>Please Make a new search ...</Typography>;

  return (
    <Grid container spacing={2}>
      {flightOffers.map((flightOffer, index) => (
        <Grid key={index} item xs={12}>
          <LazyLoadComponent>
            <TripCard
              flightOffer={flightOffer}
              dictionaries={dictionary}
              carriers={carriers}
            />
          </LazyLoadComponent>
        </Grid>
      ))}
    </Grid>
  );
}
export const SearchResult = React.memo(SearchResult_);
