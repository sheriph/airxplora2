import {
  Box,
  Button,
  Collapse,
  Grid,
  makeStyles,
  Paper,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ClassSelector from "../bookingform/classselector";
import PassengerSelector from "../bookingform/passengerselector";
import TripSelector from "../bookingform/tripselector";
import { MyDate, RetDate } from "./dates";
import SearchIcon from "@material-ui/icons/Search";
import Search from "./search";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { isReturnTrip_, tripType_ } from "../../lib/state";
import dayjs from "dayjs";
import Alert from "@material-ui/lab/Alert";
import useDeepCompareEffect from "use-deep-compare-effect";

const styles = makeStyles((theme) => ({
  paperRoot: { padding: theme.spacing(2) },
  collapseRoot: { width: "-webkit-fill-available" },
}));

export default function MultiTrips({
  tripCount,
  value,
  onChange,
  fromError,
  toError,
}) {
  const classes = styles();
  const mobile320 = useMediaQuery("(max-width:320px)");

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const theme = useTheme();

  /*   useEffect(() => {
    console.log(`running effect`);
  }, [watch()]); */

  useDeepCompareEffect(() => {
    console.log(`running effect2`);
    if (onChange) onChange(watch());
    console.log(`watch()${tripCount}`, watch());
  }, [watch()]);

  const onSubmit = (data) => {};
  return (
    <Grid container spacing={3}>
      <Grid item container spacing={1}>
        <Grid item xs={12} sm={4} md={5} container>
          <Paper
            variant="outlined"
            style={{
              width: "-webkit-fill-available",
              borderColor: fromError ? theme.palette.error.main : "",
            }}
          >
            <Controller
              name="from"
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={(data) => {
                //console.log("passengers", data);
                const { onChange, value } = data.field;
                return (
                  <Search
                    placeHolder="From Where ?"
                    isFrom={true}
                    isTo={false}
                    onChange={onChange}
                    value={value}
                    isError={errors.from ? true : false}
                  />
                );
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={5} container>
          <Paper
            variant="outlined"
            style={{
              width: "-webkit-fill-available",
              borderColor: toError ? theme.palette.error.main : "",
            }}
          >
            <Controller
              name="to"
              control={control}
              defaultValue={null}
              //  rules={{ required: true }}
              render={(data) => {
                //console.log("passengers", data);
                const { onChange, value } = data.field;
                return (
                  <Search
                    placeHolder="Where To ?"
                    isFrom={false}
                    isTo={true}
                    onChange={onChange}
                    value={value}
                    isError={errors.to ? true : false}
                  />
                );
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={2} container>
          <Controller
            name="depDate"
            control={control}
            defaultValue={value["depDate"] ? dayjs(value["depDate"]) : dayjs()}
            rules={{ required: true }}
            render={(data) => {
              //console.log("passengers", data);
              const { onChange, value } = data.field;
              return (
                <MyDate
                  isError={errors.depDate ? true : false}
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
