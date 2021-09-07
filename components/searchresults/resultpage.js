import { Box, Button, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import Filter from "../filter/filter";
import { SearchResult } from "./searchresult";
import SearchSummary from "./searchsummary";
import SimpleSearchSummary from "./simplesearchsumm";
import StyledDate from "./styledate";
import FilterListIcon from "@material-ui/icons/FilterList";
import MyDrawer from "../others/drawer";
import { Typography } from "@material-ui/core";

export default function ResultPage_({ flightOffers, carriers, dictionary }) {
  if (!flightOffers)
    return (
      <Typography variant="h4">No Results, Please make a new search</Typography>
    );
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDrawer, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
 // console.log(`flightOffers`, flightOffers);
  return (
    <Box>
      <MyDrawer
        keepMounted={true}
        open={openDrawer}
        handleClose={handleClose}
        anchor="left"
      >
        <Box p={2}>
          <Filter carriers={carriers} handleClose={handleClose} />
        </Box>
      </MyDrawer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleSearchSummary flightOffers={flightOffers} />
        </Grid>
        {mobile && (
          <Grid item style={{ paddingTop: "0", paddingBottom: "0" }} xs={12}>
            <Button
              onClick={() => setOpen(true)}
              startIcon={<FilterListIcon color="primary" />}
            >
              Filter
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {!mobile && (
              <Grid item xs={3}>
                <Filter carriers={carriers} />
              </Grid>
            )}
            <Grid item xs>
              <SearchResult
                flightOffers={flightOffers}
                carriers={carriers}
                dictionary={dictionary}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export const ResultPage = React.memo(ResultPage_);
