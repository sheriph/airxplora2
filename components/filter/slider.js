import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { getMinMax, useMoney } from "../../lib/utilities";
import { first, last } from "lodash";
import { Grid } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { useRecoilState } from "recoil";

const AirbnbSlider = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    height: 3,
    padding: "13px 0",
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    marginTop: -12,
    marginLeft: -13,
    boxShadow: "#ebebeb 0 2px 2px",
    "&:focus, &:hover, &$active": {
      boxShadow: "#ccc 0 2px 3px 1px",
    },
    "& .bar": {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  track: {
    height: 3,
  },
  rail: {
    color: "#d8d8d8",
    opacity: 1,
    height: 3,
  },
}))(Slider);

function AirbnbThumbComponent(props) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

export default function CustomizedSlider({ flightOffersFixed, setPriceRange }) {
  const minMax = getMinMax(flightOffersFixed);
  console.log("price", minMax);

  const [price, setPrice] = useState(minMax);
  useEffect(() => {
    setPriceRange(minMax);
  }, [null]);

  const handleChange = (e, v) => {
    setPriceRange(v);
    /* console.log("handleChange", v);
    try {
      const sortedByPrice = flightOffersFixed.filter((item) => {
        if (
          Number(item.price.grandTotal) >= first(v) &&
          item.price.grandTotal <= last(v)
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFlexibleOffers(sortedByPrice);
      console.log("sorted", sortedByPrice);
    } catch (error) {
      console.log(`error`, error);
    } */
  };

  return (
    <Grid container>
      <Grid item component={Box} px={1} xs={12}>
        <AirbnbSlider
          value={price}
          // @ts-ignore
          onChange={(e, v) => setPrice(v)}
          onChangeCommitted={handleChange}
          ThumbComponent={AirbnbThumbComponent}
          // defaultValue={[20, 40]}
          min={first(minMax)}
          max={last(minMax)}
        />
      </Grid>
      <Grid item container justifyContent="space-between">
        <Grid item>
          <Typography>{useMoney(first(price))}</Typography>
        </Grid>
        <Grid item>
          <Typography>{useMoney(last(price))}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
