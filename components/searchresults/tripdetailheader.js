import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Button, Grid, useMediaQuery } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ClearIcon from "@material-ui/icons/Clear";
import { Box } from "@material-ui/core";
import PriceTable from "./pricetable";
import { useMoney } from "../../lib/utilities";
import { openDrawer_ } from "../../lib/state";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function TripDetailHeader({ grandTotal, travelerPricings }) {
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const mini = useMediaQuery("(max-width:300px)");
  const [open, setOpen] = useRecoilState(openDrawer_);

  return (
    <div className={classes.root}>
      <Accordion expanded={expand}>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid
            container
            alignContent="center"
            alignItems="center"
            justifyContent="space-around"
          >
            <Grid item xs onClick={() => setOpen(false)}>
              <ClearIcon />
            </Grid>
            <Grid item xs>
              <Button
                size="small"
                disableFocusRipple
                disableRipple
                disableTouchRipple
                endIcon={
                  <KeyboardArrowDownIcon
                    style={{
                      transform: expand ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.5s",
                    }}
                  />
                }
                onClick={() => setExpand(!expand)}
              >
                <span style={{ whiteSpace: "nowrap" }}>
                  {useMoney(grandTotal)}
                </span>
              </Button>
            </Grid>
            <Grid item xs>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary">
                  <span style={{ whiteSpace: "nowrap" }}>Book Now</span>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <PriceTable
            travelerPricings={travelerPricings}
            grandTotal={grandTotal}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
