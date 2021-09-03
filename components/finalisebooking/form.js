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
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Autocomplete } from "@material-ui/lab";
import { countries } from "./country";
import DateSelector from "./dateselector";
import dayjs from "dayjs";
import { axiosAirxplora, schema } from "../../lib/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { pickBy } from "lodash";
import { values } from "lodash";
import { first } from "lodash";
import { useSnackbar } from "notistack";
import { useRecoilState } from "recoil";
import Loader from "../others/loader";
import { order_, tab_, xpaDictionary_ } from "../../lib/state";

export default function Form({ flightOffer, travelerRequirements }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isloading, setLoading] = useState(false);
  const [order, setOrder] = useRecoilState(order_);
  const [tab, setTab] = useRecoilState(tab_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);

  const onSubmit = async (data) => {
    console.log(
      "data",
      data,
      pickBy(data, (value, key) => key.includes("gender"))
    );
    const gender = pickBy(data, (value, key) => key.includes("gender"));
    for (let item in gender) {
      console.log(gender[item]);
      if (!gender[item]) {
        enqueueSnackbar("Please select a gender", {
          variant: "error",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
        return;
      }
    }
    console.log(`flightOffer`, flightOffer);
    const pickItem = (identifier, travelerId) => {
      if (!identifier) return "";
      return first(
        values(
          pickBy(
            data,
            (value, key) =>
              key.includes(identifier) && key.includes(`${travelerId}`)
          )
        )
      );
    };

    console.log(`pickItem`, pickItem("nationality", "1"));

    const travelers = flightOffer.travelerPricings.map((traveler) => {
      return {
        id: traveler.travelerId,
        name: {
          firstName: pickItem("othernames", traveler.travelerId),
          lastName: pickItem("surname", traveler.travelerId),
        },
        gender:
          pickItem("gender", traveler.travelerId) === "Mr" ? "MALE" : "FEMALE",
        dateOfBirth: pickItem("dob", traveler.travelerId)
          ? dayjs(pickItem("dob", traveler.travelerId)).format("YYYY-MM-DD")
          : "1990-01-01",
        contact: {
          emailAddress: data.email,
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "234",
              number: data.phone,
            },
          ],
        },
        documents: [
          {
            documentType: "PASSPORT",
            birthPlace: "Lagos",
            issuanceLocation: "Lagos",
            issuanceDate: pickItem("issueDate", traveler.travelerId)
              ? dayjs(pickItem("issueDate", traveler.travelerId)).format(
                  "YYYY-MM-DD"
                )
              : "1990-01-01",
            number: pickItem("passportNumber", traveler.travelerId)
              ? pickItem("passportNumber", traveler.travelerId)
              : "A0123456",
            expiryDate: pickItem("expiryDate", traveler.travelerId)
              ? dayjs(pickItem("expiryDate", traveler.travelerId)).format(
                  "YYYY-MM-DD"
                )
              : "2050-01-01",
            issuanceCountry: pickItem("nationality", traveler.travelerId)
              ? pickItem("nationality", traveler.travelerId)["code"]
              : "NG",
            validityCountry: pickItem("nationality", traveler.travelerId)
              ? pickItem("nationality", traveler.travelerId)["code"]
              : "NG",
            nationality: pickItem("nationality", traveler.travelerId)
              ? pickItem("nationality", traveler.travelerId)["code"]
              : "NG",
            holder: true,
          },
        ],
      };
    });

    console.log(`travelers`, travelers);
    const remarks = {
      general: [
        {
          subType: "GENERAL_MISCELLANEOUS",
          text: "ONLINE BOOKING FROM INCREIBLE VIAJES",
        },
      ],
    };

    const contacts = [
      {
        addresseeName: {
          firstName: "Sheriff",
          lastName: "Adeniyi",
        },
        companyName: "NAIJAGOINGABROAD LTD",
        purpose: "STANDARD",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: "234",
            number: "9065369929",
          },
        ],
        emailAddress: "info@naijagoingabroad.com",
        address: {
          lines: ["Opebi Rd, 65c"],
          postalCode: "23401",
          cityName: "Ikeja",
          countryCode: "NG",
        },
      },
    ];

    const ticketingAgreement = {
      option: "DELAY_TO_CANCEL",
      delay: "6D",
    };

    const flightOrder = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffer],
        travelers: travelers,
        remarks: remarks,
        ticketingAgreement: ticketingAgreement,
        contacts: contacts,
      },
    };

    let postData = flightOrder;
    console.log(`flightOrder`, flightOrder);
    let config = {
      method: "post",
      url: "https://test.api.amadeus.com/v1/booking/flight-orders",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          window.localStorage.getItem("access_token")
        )}`,
      },
      data: postData,
    };
    try {
      setLoading(true);
      const response = await axiosAirxplora(config, 2);
      console.log(`response`, response);
      setOrder(response.data.data);
      setLoading(false);
      const state = {
        id: response.data.data.id,
        dictionary: dictionary,
        flightOffer: flightOffer,
      };
      console.log(`state`, state);
      setTab("4");
    } catch (error) {
      console.log(`error`, error);
      enqueueSnackbar(<Box>{error.message}</Box>, {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      setLoading(false);
    }
  };

  console.log(`errors`, errors);
  const theme = useTheme();
  return (
    <Paper>
      <Loader open={isloading} />
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
          {flightOffer.travelerPricings.map((traveler, index) => {
            let requirements;
            [requirements] = travelerRequirements
              ? travelerRequirements?.filter(
                  (item) => item.travelerId === traveler.travelerId
                )
              : [null];
            console.log(traveler.travelerType);
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
                      &nbsp;
                      <span>
                        ({startCase(lowerCase(traveler.travelerType))})
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      rules={{
                        required: true,
                        validate: (value) => {
                          console.log("value", value);
                          return false;
                        },
                      }}
                      name={`gender-${traveler.travelerType}-${traveler.travelerId}`}
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => {
                        return (
                          <div>
                            {["Mr", "Ms", "Mrs"].map((gender, index) => (
                              <FormControlLabel
                                //onError
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
                      name={`surname-${traveler.travelerType}-${traveler.travelerId}`}
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
                      name={`othernames-${traveler.travelerType}-${traveler.travelerId}`}
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
                          name={`passportNumber-${traveler.travelerType}-${traveler.travelerId}`}
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
                          name={`nationality-${traveler.travelerType}-${traveler.travelerId}`}
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
                          name={`issueDate-${traveler.travelerType}-${traveler.travelerId}`}
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
                          name={`expiryDate-${traveler.travelerType}-${traveler.travelerId}`}
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
                  {requirements?.dateOfBirthRequired ||
                  traveler.travelerType === "CHILD" ||
                  traveler.travelerType === "HELD_INFANT" ? (
                    <Grid item xs={12} sm={6}>
                      <Controller
                        rules={{ required: true }}
                        name={`dob-${traveler.travelerType}-${traveler.travelerId}`}
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
                  ) : (
                    ""
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
