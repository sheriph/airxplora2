import React, { useEffect, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Box,
  debounce,
  Fab,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";
import { useState } from "react";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import FlightIcon from "@material-ui/icons/Flight";
import { lowerCase, startCase, uniqueId, trim } from "lodash";
import { getAirportSuggest } from "../../lib/utilities";
import CircularProgress from "@material-ui/core/CircularProgress";
import MyDrawer from "../others/drawer";
import CancelIcon from "@material-ui/icons/Cancel";
import CloseIcon from "@material-ui/icons/Close";

const styles = makeStyles((theme) => ({
  inputRoot: {
    paddingLeft: "10px !important",
  },
  renderOption: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  option: { padding: "0" },
  paper: { width: "280px" },
  listbox: { padding: "0" },
}));

export default function Search({
  placeHolder = "Placeholder",
  isFrom = true,
  isTo = false,
  onChange,
  value,
  isError,
}) {
  const [from, setFrom] = useState([]);
  const [to, setTo] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const classes = styles();
  const [isOpen, setOpen] = useState(false);
  const theme = useTheme();
  const [autoSelectFrom, setAutoSelectFrom] = useState(null);
  const [autoSelectTo, setAutoSelectTo] = useState(null);
  const mobile = useMediaQuery("(max-width:600px)");
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleClose = () => {
    setOpenDrawer(false);
  };

  const onInputChange = (e, v, r) => {
    console.log(`v`, v, r);
    if (r === "input") {
      const getSuggestions = async () => {
        setLoading(true);
        try {
          const option = await getAirportSuggest(trim(v));
          console.log("option :>> ", option);
          if (isFrom) setFrom(option.data);

          if (isTo) setTo(option.data);
        } catch (error) {
          console.log("error :>> ", error);
        } finally {
          setLoading(false);
        }
      };
      if (v) getSuggestions();
    }
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(onInputChange, 300),
    []
  );

  useEffect(() => {
    return () => {
      // @ts-ignore
      debouncedChangeHandler.cancel;
    };
  }, []);

  return (
    <>
      {mobile && (
        <MyDrawer width="100%" handleClose={handleClose} open={openDrawer}>
          <Autocomplete
            debug
            // disablePortal
            value={value}
            onChange={(e, v, r) => {
              onChange(v);
              if (r === "select-option")
                setTimeout(() => setOpenDrawer(false), 250);
            }}
            disableClearable
            onInputChange={debouncedChangeHandler}
            forcePopupIcon={false}
            fullWidth
            classes={{
              inputRoot: classes.inputRoot,
              option: classes.option,
              listbox: classes.listbox,
              //  paper: classes.paper,
            }}
            options={isFrom ? from : to}
            // @ts-ignore
            getOptionLabel={(option) =>
              `${option.iataCode}, ${startCase(lowerCase(option.name))}`
            }
            renderOption={(option, state) => {
              const {
                name,
                subType,
                iataCode,
                address: { cityName, countryName },
              } = option;
              return (
                <Grid
                  container
                  alignContent="center"
                  alignItems="center"
                  justifyContent="flex-start"
                  className={state.selected ? classes.renderOption : ""}
                  style={{ padding: "10px" }}
                  component={Paper}
                  variant="outlined"
                >
                  <Grid item xs={2}>
                    {subType === "AIRPORT" ? (
                      <FlightIcon
                        // @ts-ignore
                        color={state.selected ? "initial" : "primary"}
                        fontSize="small"
                      />
                    ) : (
                      // @ts-ignore
                      <LocationOnOutlinedIcon
                        // @ts-ignore
                        color={state.selected ? "initial" : "primary"}
                        fontSize="small"
                      />
                    )}
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">
                      {startCase(lowerCase(name))}&nbsp;
                      {subType === "AIRPORT" &&
                      !name.toLocaleLowerCase().includes("airport")
                        ? "Airport"
                        : "Airports"}
                    </Typography>
                    <Typography variant="caption">
                      {startCase(lowerCase(cityName))},&nbsp;
                      {startCase(lowerCase(countryName))}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography color={state.selected ? "initial" : "primary"}>
                      {iataCode}
                    </Typography>
                  </Grid>
                </Grid>
              );
            }}
            renderInput={(params) => {
              const updatedParams = {
                ...params,
                InputProps: {
                  ...params.InputProps,
                  endAdornment: (
                    <>{isLoading && <CircularProgress size="20px" />}</>
                  ),
                  startAdornment: (
                    <>
                      {isFrom ? (
                        <FiberManualRecordOutlinedIcon />
                      ) : (
                        <LocationOnOutlinedIcon />
                      )}
                    </>
                  ),
                },
              };
              return (
                <TextField
                  error={isError}
                  placeholder={placeHolder}
                  {...updatedParams}
                  variant="outlined"
                />
              );
            }}
          />
          <Fab
            style={{ position: "absolute", right: "10px", bottom: "10px" }}
            color="primary"
            aria-label="add"
            onClick={() => setOpenDrawer(false)}
          >
            <CloseIcon />
          </Fab>
        </MyDrawer>
      )}
      <span
        onClick={() => {
          if (mobile) setOpenDrawer(true);
        }}
        style={{ width: "100%" }}
      >
        <Autocomplete
          // debug
          // disablePortal
          value={value}
          onChange={(e, v, r) => onChange(v)}
          disableClearable
          onInputChange={debouncedChangeHandler}
          forcePopupIcon={false}
          fullWidth
          classes={{
            inputRoot: classes.inputRoot,
            option: classes.option,
            listbox: classes.listbox,
            //  paper: classes.paper,
          }}
          options={isFrom ? from : to}
          // @ts-ignore
          getOptionLabel={(option) =>
            `${option.iataCode}, ${startCase(lowerCase(option.name))}`
          }
          renderOption={(option, state) => {
            const {
              name,
              subType,
              iataCode,
              address: { cityName, countryName },
            } = option;
            return (
              <Grid
                container
                alignContent="center"
                alignItems="center"
                justifyContent="flex-start"
                className={state.selected ? classes.renderOption : ""}
                style={{ padding: "10px" }}
                component={Paper}
                variant="outlined"
              >
                <Grid item xs={2}>
                  {subType === "AIRPORT" ? (
                    <FlightIcon
                      // @ts-ignore
                      color={state.selected ? "initial" : "primary"}
                      fontSize="small"
                    />
                  ) : (
                    // @ts-ignore
                    <LocationOnOutlinedIcon
                      // @ts-ignore
                      color={state.selected ? "initial" : "primary"}
                      fontSize="small"
                    />
                  )}
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {startCase(lowerCase(name))}&nbsp;
                    {subType === "AIRPORT" &&
                    !name.toLocaleLowerCase().includes("airport")
                      ? "Airport"
                      : "Airports"}
                  </Typography>
                  <Typography variant="caption">
                    {startCase(lowerCase(cityName))},&nbsp;
                    {startCase(lowerCase(countryName))}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography color={state.selected ? "initial" : "primary"}>
                    {iataCode}
                  </Typography>
                </Grid>
              </Grid>
            );
          }}
          renderInput={(params) => {
            const updatedParams = {
              ...params,
              InputProps: {
                ...params.InputProps,
                endAdornment: (
                  <>{isLoading && <CircularProgress size="20px" />}</>
                ),
                startAdornment: (
                  <>
                    {isFrom ? (
                      <FiberManualRecordOutlinedIcon />
                    ) : (
                      <LocationOnOutlinedIcon />
                    )}
                  </>
                ),
              },
            };
            return (
              <TextField
                error={isError}
                placeholder={placeHolder}
                {...updatedParams}
                variant="outlined"
              />
            );
          }}
        />
      </span>
    </>
  );
}

//<FiberManualRecordOutlinedIcon />
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const airports = [
  {
    type: "location",
    subType: "CITY",
    name: "LONDON",
    detailedName: "LONDON/GB",
    id: "CLON",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/CLON",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LON",
    geoCode: {
      latitude: 51.5,
      longitude: -0.16666,
    },
    address: {
      cityName: "LONDON",
      cityCode: "LON",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 100,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "HEATHROW",
    detailedName: "LONDON/GB:HEATHROW",
    id: "ALHR",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ALHR",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LHR",
    geoCode: {
      latitude: 51.47294,
      longitude: -0.45061,
    },
    address: {
      cityName: "LONDON",
      cityCode: "LON",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 45,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "GATWICK",
    detailedName: "LONDON/GB:GATWICK",
    id: "ALGW",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ALGW",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LGW",
    geoCode: {
      latitude: 51.15609,
      longitude: -0.17818,
    },
    address: {
      cityName: "LONDON",
      cityCode: "LON",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 27,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "STANSTED",
    detailedName: "LONDON/GB:STANSTED",
    id: "ASTN",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ASTN",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "STN",
    geoCode: {
      latitude: 51.885,
      longitude: 0.235,
    },
    address: {
      cityName: "LONDON",
      cityCode: "LON",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 15,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "LUTON",
    detailedName: "LONDON/GB:LUTON",
    id: "ALTN",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ALTN",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LTN",
    geoCode: {
      latitude: 51.87472,
      longitude: -0.36833,
    },
    address: {
      cityName: "LONDON",
      cityCode: "LON",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 10,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "CITY AIRPORT",
    detailedName: "LONDON/GB:CITY AIRPORT",
    id: "ALCY",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ALCY",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LCY",
    geoCode: {
      latitude: 51.50528,
      longitude: 0.05528,
    },
    address: {
      cityName: "LONDON",
      cityCode: "LON",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 4,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "DAUGHERTY FIELD",
    detailedName: "LONG BEACH/CA/US:DAUGHERTY FIE",
    id: "ALGB",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ALGB",
      methods: ["GET"],
    },
    timeZoneOffset: "-07:00",
    iataCode: "LGB",
    geoCode: {
      latitude: 33.81778,
      longitude: -118.1517,
    },
    address: {
      cityName: "LONG BEACH",
      cityCode: "LGB",
      countryName: "UNITED STATES OF AMERICA",
      countryCode: "US",
      stateCode: "CA",
      regionCode: "NAMER",
    },
    analytics: {
      travelers: {
        score: 2,
      },
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "LONG BEACH",
    detailedName: "LONG BEACH/CA/US:DAUGHERTY FIE",
    id: "CLGB",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/CLGB",
      methods: ["GET"],
    },
    timeZoneOffset: "-07:00",
    iataCode: "LGB",
    geoCode: {
      latitude: 33.81778,
      longitude: -118.1517,
    },
    address: {
      cityName: "LONG BEACH",
      cityCode: "LGB",
      countryName: "UNITED STATES OF AMERICA",
      countryCode: "US",
      stateCode: "CA",
      regionCode: "NAMER",
    },
    analytics: {
      travelers: {
        score: 2,
      },
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "LONDON ASHFORD",
    detailedName: "LYDD/GB:LONDON ASHFORD",
    id: "ALYX",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/ALYX",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LYX",
    geoCode: {
      latitude: 50.95611,
      longitude: 0.93917,
    },
    address: {
      cityName: "LYDD",
      cityCode: "LYX",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 2,
      },
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "LYDD",
    detailedName: "LYDD/GB:LONDON ASHFORD",
    id: "CLYX",
    self: {
      href: "https://test.api.amadeus.com/v1/reference-data/locations/CLYX",
      methods: ["GET"],
    },
    timeZoneOffset: "+01:00",
    iataCode: "LYX",
    geoCode: {
      latitude: 50.95611,
      longitude: 0.93917,
    },
    address: {
      cityName: "LYDD",
      cityCode: "LYX",
      countryName: "UNITED KINGDOM",
      countryCode: "GB",
      regionCode: "EUROP",
    },
    analytics: {
      travelers: {
        score: 2,
      },
    },
  },
];

//console.log("airports :>> ", airports);
