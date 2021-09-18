import {
  Button,
  Grid,
  Hidden,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosAirxplora } from "../../lib/utilities";
import Loader from "../others/loader";

const styles = makeStyles((theme) => ({
  textfield: { maxWidth: "500px" },
}));

export default function Profile({ profile, setProfile }) {
  const classes = styles();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (window !== undefined) {
      console.log(`profile`, profile);
      for (let item in profile) {
        if (profile[item]) setValue(item, profile[item]);
      }
    }
  }, [profile]);

  console.log(`errors`, errors);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isloading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(`data`, data);
    const config = {
      method: "post",
      url: "/api/updateprofile",
      data: data,
    };
    try {
      setLoading(true);
      const update = await axiosAirxplora(config, 3);
      console.log(`update.data`, update.data);
      enqueueSnackbar("Success", { variant: "success" });
    } catch (error) {
      console.log(`error`, error);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Loader open={isloading} />
      <Grid
        spacing={3}
        container
        alignContent="center"
        alignItems="center"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item container>
          <Grid item xs>
            <Typography align="center" variant="h5">
              AGENCY PROFILE
            </Typography>
          </Grid>
        </Grid>
        <Grid item container>
          <Hidden xsDown>
            <Grid item xs={12} sm={3}>
              <Typography variant="button">Agency Name</Typography>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm>
            <Controller
              name="agencyName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  className={classes.textfield}
                  fullWidth
                  label="Name"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item container>
          <Hidden xsDown>
            <Grid item xs={12} sm={3}>
              <Typography variant="button">Email</Typography>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  className={classes.textfield}
                  fullWidth
                  label="Email"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item container>
          <Hidden xsDown>
            <Grid item xs={12} sm={3}>
              <Typography variant="button">Phone</Typography>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  className={classes.textfield}
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item container>
          <Hidden xsDown>
            <Grid item xs={12} sm={3}>
              <Typography variant="button">Mobile</Typography>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm>
            <Controller
              name="mobile"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  className={classes.textfield}
                  fullWidth
                  label="Mobile"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item container>
          <Hidden xsDown>
            <Grid item xs={12} sm={3}>
              <Typography variant="button">Address</Typography>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  onChange={onChange}
                  value={value}
                  className={classes.textfield}
                  multiline
                  minRows={4}
                  fullWidth
                  label="Address"
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item container justifyContent="center" xs={12}>
          <Button
            disabled={isloading}
            type="submit"
            size="large"
            color="primary"
            variant="contained"
          >
            SAVE
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
