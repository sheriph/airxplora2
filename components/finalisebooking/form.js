import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { lowerCase, startCase } from "lodash";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Autocomplete } from "@material-ui/lab";
import { countries } from "./country";
import DateSelector from "./dateselector";
import dayjs from "dayjs";
import { schema } from "../../lib/utilities";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Form({ flightOfferExtended, travelerRequirements }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = (data) => console.log(data);

  console.log(`errors`, errors);
  const theme = useTheme();
  return (
    <Paper>
      <Container>
        <Grid
          spacing={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          container
        >
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              Passenger Details
            </Typography>
          </Grid>
          {flightOfferExtended.travelerPricings.map((traveler, index) => {
            const [requirements] = travelerRequirements.filter(
              (item) => item.travelerId === traveler.travelerId
            );
            const getDateSubtract = () => {
              switch (traveler.travelerType) {
                case "ADULT":
                  return 100;
                case "CHILD":
                  return 12;
                case "HELD_INFANT":
                  return 2;
                default:
                  return 100;
              }
            };
            console.log("requirements", requirements);
            return (
              <Grid key={index} item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography color="primary" variant="h6" align="center">
                      <span>
                        {!watch(`surname-${traveler.travelerType}-${index}`) &&
                          !watch(
                            `othernames-${traveler.travelerType}-${index}`
                          ) &&
                          "Traveler 1"}
                      </span>
                      <span>
                        {startCase(
                          lowerCase(
                            watch(`surname-${traveler.travelerType}-${index}`)
                          )
                        )}
                      </span>
                      <span>
                        {watch(`surname-${traveler.travelerType}-${index}`) &&
                          " / "}
                      </span>
                      <span>
                        {startCase(
                          lowerCase(
                            watch(
                              `othernames-${traveler.travelerType}-${index}`
                            )
                          )
                        )}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      rules={{ required: true }}
                      name={`gender-${traveler.travelerType}-${index}`}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => {
                        return (
                          <div>
                            {["Mr", "Ms", "Mrs"].map((gender, index) => (
                              <FormControlLabel
                                key={index}
                                checked={value === gender}
                                value={gender}
                                control={<Radio color="primary" />}
                                label={gender}
                                onChange={onChange}
                                // labelPlacement="top"
                              />
                            ))}
                          </div>
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      rules={{ required: true }}
                      name={`surname-${traveler.travelerType}-${index}`}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => {
                        return (
                          <TextField
                            required
                            fullWidth
                            size="small"
                            onChange={onChange}
                            value={value}
                            id="outlined-basic"
                            label="Surname"
                            variant="outlined"
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      rules={{ required: true }}
                      name={`othernames-${traveler.travelerType}-${index}`}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => {
                        return (
                          <TextField
                            required
                            fullWidth
                            size="small"
                            onChange={onChange}
                            value={value}
                            id="outlined-basic"
                            label="First/Given name"
                            variant="outlined"
                          />
                        );
                      }}
                    />
                  </Grid>
                  {requirements?.documentRequired && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          rules={{ required: true }}
                          name={`passportNumber-${traveler.travelerType}-${index}`}
                          control={control}
                          defaultValue=""
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                required
                                fullWidth
                                size="small"
                                onChange={onChange}
                                value={value}
                                id="outlined-basic"
                                label="Passport Number"
                                variant="outlined"
                              />
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          rules={{ required: true }}
                          name={`nationality-${traveler.travelerType}-${index}`}
                          control={control}
                          // defaultValue="Nigeria"
                          render={({ field: { onChange, value } }) => {
                            return (
                              <Autocomplete
                                size="small"
                                value={value}
                                onChange={(e, v, r) => onChange(v)}
                                id="country-select-demo"
                                options={countries}
                                autoHighlight
                                getOptionLabel={(option) => option.label}
                                renderOption={(option) => (
                                  <React.Fragment>
                                    {option.label} ({option.code})
                                  </React.Fragment>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    size="small"
                                    {...params}
                                    label="Nationality"
                                    variant="outlined"
                                  />
                                )}
                              />
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          rules={{ required: true }}
                          name={`issueDate-${traveler.travelerType}-${index}`}
                          control={control}
                          defaultValue={dayjs()}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <DateSelector
                                // disableFuture={true}
                                onChange={onChange}
                                value={value}
                                minDate={dayjs()
                                  .subtract(10, "year")
                                  .format("YYYY-MM-DD")}
                                maxDate={dayjs().format("YYYY-MM-DD")}
                                title="Date of Issue"
                              />
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          rules={{ required: true }}
                          name={`expiryDate-${traveler.travelerType}-${index}`}
                          control={control}
                          defaultValue={dayjs()}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <DateSelector
                                // disableFuture={true}
                                onChange={onChange}
                                value={value}
                                minDate={dayjs().format("YYYY-MM-DD")}
                                maxDate={dayjs()
                                  .add(10, "year")
                                  .format("YYYY-MM-DD")}
                                title="Date of Expiry"
                              />
                            );
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {requirements?.dateOfBirthRequired && (
                    <Grid item xs={12} sm={6}>
                      <Controller
                        rules={{ required: true }}
                        name={`dob-${traveler.travelerType}-${index}`}
                        control={control}
                        defaultValue={dayjs()}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <DateSelector
                              // disableFuture={true}
                              onChange={onChange}
                              value={value}
                              minDate={dayjs()
                                .subtract(getDateSubtract(), "year")
                                .format("YYYY-MM-DD")}
                              maxDate={dayjs().format("YYYY-MM-DD")}
                              title="Date of Birth"
                            />
                          );
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            );
          })}
          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <Typography align="center" variant="h5">
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                rules={{ required: true }}
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => {
                  return (
                    <TextField
                      helperText={errors?.email?.message}
                      required
                      error={errors?.email}
                      fullWidth
                      size="small"
                      onChange={onChange}
                      value={value}
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                rules={{ required: true }}
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => {
                  return (
                    <TextField
                      required
                      helperText={
                        errors?.phone ? "This must a valid phone number" : ""
                      }
                      error={errors?.phone}
                      fullWidth
                      size="small"
                      onChange={onChange}
                      value={value}
                      id="outlined-basic"
                      label="Phone"
                      variant="outlined"
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
