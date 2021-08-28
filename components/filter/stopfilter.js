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

export default function StopFilter({ flightOffersFixed, setStopData }) {
  const [stops, setStops] = useState([]);
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
        set.add(`${itinerary.segments.length}`);
      });
    });
   // console.log(`set`, set);
    setStops(Array.from(set));
  }, [null]);

  const onSubmit = (data) => {
   // console.log(" submit stop data", data);
    setStopData(data);
    /* try {
      let selectedStops = keys(
        pickBy(data, function (value) {
          return value === true;
        })
      );

      if (selectedStops.length === 0) return;
      const sortedByStops = flightOffersFixed.filter((flightOffer) => {
        const itinSegCount = flightOffer.itineraries.map(
          (itinerary) => itinerary.segments.length
        );
        //console.log(`itinSegCount`, itinSegCount);
        for (let stop of itinSegCount) {
          if (selectedStops.includes(`${stop}`)) {
            return true;
          }
        }
        return false;
      });
      console.log(`sortedByStops`, sortedByStops, selectedStops);
      setFlexibleOffers(sortedByStops);
    } catch (error) {
      console.log(`error`, error);
    } */
  };

  return (
    <Grid container>
      <Grid item>
        <Typography>Stops</Typography>
      </Grid>
      <Grid
        item
        spacing={1}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
      >
        {stops.map((item, index) => (
          <Grid key={index} item xs={12}>
            <Controller
              name={item}
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
                    label={
                      item === "1"
                        ? "Direct"
                        : `${item - 1} ${item >= 3 ? "Stops" : "Stop"}`
                    }
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
