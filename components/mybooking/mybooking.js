import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { lowerCase, startCase } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { flightOffer_, order_, xpaDictionary_ } from "../../lib/state";
import DetailedTripInfo from "../searchresults/detailedtripinfo";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";
import Loader from "../others/loader";
import { axiosAirxplora, getMoreOrderData } from "../../lib/utilities";

export default function MyBooking() {
  const [order, setOrder] = useRecoilState(order_);
  const [flightOffer, setOffer] = useRecoilState(flightOffer_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);
  const [isLoading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    //eJzTd9f3cg%2F18HEBAAtYAmQ%3D
    const { surname, reference } = data;
    console.log(`data`, data, surname, reference);

    try {
      setLoading(true);
      const response = await getMoreOrderData(
        surname.toLocaleUpperCase(),
        reference.toLocaleUpperCase()
      );
      console.log(`response`, response);
      const { id, dictionary, flightOffer } = response.data;
      let config = {
        method: "get",
        url: `https://test.api.amadeus.com/v1/booking/flight-orders/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("access_token")
          )}`,
        },
      };
      const orderResponse = await axiosAirxplora(config, 2);
      console.log(`orderResponse`, orderResponse);
      setOffer(flightOffer);
      setDictionary(dictionary);
      setOrder(orderResponse.data.data);
    } catch (error) {
      console.log(`error`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <Paper component="form" onSubmit={handleSubmit(onSubmit)}>
        <Loader open={isLoading} />
        <Grid component={Container} spacing={2} container>
          <Grid item xs={12}>
            <Typography align="center">Check Your Booking</Typography>
          </Grid>
          <Grid item xs={12} sm>
            <Controller
              name="surname"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  onChange={onChange}
                  size="small"
                  fullWidth
                  value={value}
                  id="surname"
                  label="Surname"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm>
            <Controller
              name="reference"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  size="small"
                  fullWidth
                  onChange={onChange}
                  value={value}
                  id="reference"
                  label="Reference"
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>
        <Box>
          <Grid
            container
            justifyContent="center"
            // style={{ marginBottom: "10px" }}
          >
            <Button
              color="primary"
              variant="contained"
              size="large"
              style={{
                position: "relative",
                top: "20px",
                borderRadius: "20px",
                textTransform: "capitalize",
              }}
              startIcon={<SearchIcon />}
              type="submit"
            >
              Search
            </Button>
          </Grid>
        </Box>
      </Paper>
    );
  }

  const { associatedRecords, contacts, ticketingAgreement, travelers } = order;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography gutterBottom align="center" variant="h5">
          Booking Confirmation
        </Typography>
        {associatedRecords.map((record, index) => (
          <Typography key={index} align="center">
            {record.originSystemCode === "GDS"
              ? `Amadeus Reference`
              : `${startCase(
                  lowerCase(dictionary.carriers[record.originSystemCode])
                )} Reference`}{" "}
            : {record.reference}
          </Typography>
        ))}
        <Box>
          <Alert
            severity={
              ticketingAgreement.option === "CONFIRM" ? "success" : "warning"
            }
          >
            <AlertTitle>Status</AlertTitle>
            {ticketingAgreement.option === "CONFIRM" ? (
              "Confirmed Booking! This ticket is valid for travel"
            ) : (
              <span>
                Temporary Reservation (Please make payment soon to avoid
                cancelation) <br />
                For Bank Transfer: 0124782296 : Gtbank : NaijaGoingAbroad LTD{" "}
                <br />
                For Online Payment, please click PAY NOW button below
              </span>
            )}
          </Alert>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DetailedTripInfo
          ticketingAgreement={ticketingAgreement}
          associatedRecords={associatedRecords}
          travelers={travelers}
          contacts={contacts}
          dictionary={dictionary}
          flightOffer={flightOffer}
          handleClose={null}
          booked={true}
        />
      </Grid>
    </Grid>
  );
}
