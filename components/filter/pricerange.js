import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import CustomizedSlider from "./slider";

export default function PriceRange({ flightOffersFixed, setPriceRange }) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Price Range</Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomizedSlider
          setPriceRange={setPriceRange}
          flightOffersFixed={flightOffersFixed}
        />
      </Grid>
    </Grid>
  );
}
