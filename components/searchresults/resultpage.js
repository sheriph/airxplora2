import { Box, Grid } from "@material-ui/core";
import React from "react";
import SearchResult from "./searchresult";
import SearchSummary from "./searchsummary";
import SimpleSearchSummary from "./simplesearchsumm";
import StyledDate from "./styledate";

export default function ResultPage() {


  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleSearchSummary />
        </Grid>
        <Grid item xs={12}>
          <SearchResult />
        </Grid>
      </Grid>
    </Box>
  );
}
