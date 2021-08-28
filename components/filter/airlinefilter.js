import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { keys, lowerCase, pickBy, startCase } from "lodash";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function AirlineFilter({ flightOffersFixed, setAirlineData }) {
  const [airline, setAirline] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    let set = new Set();
    flightOffersFixed.forEach((flightOffer) => {
      flightOffer.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          set.add(segment.carrierCode);
        });
      });
    });
  // console.log(`set`, set);
    setAirline(Array.from(set));
  }, [null]);

  const onSubmit = (data) => {
   // console.log(data);
    setAirlineData(data);
  };

  return (
    <Grid container>
      <Grid item>
        <Typography>Airlines</Typography>
      </Grid>
      <Grid
        item
        spacing={1}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
      >
        {airline.map((carrierCode, index) => (
          <Grid key={index} item xs={12}>
            <Controller
              name={carrierCode}
              control={control}
              defaultValue={false}
              render={({ field: { name, onChange, value } }) => {
                // console.log("data", name, onChange, value);
                return (
                  <FormControlLabel
                    checked={value}
                    onChange={(e) => {
                      // @ts-ignore
                      onChange(e.target.checked);
                      handleSubmit(onSubmit)();
                    }}
                    control={<Checkbox color="primary" />}
                    label={carrierCode}
                    labelPlacement="end"
                  />
                );
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
