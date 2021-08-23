import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Collapse } from "@material-ui/core";
import { useEffect } from "react";

export default function CustomAccordion({ children, title, icon }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setOpen(true);
    }, 500);
    const t2 = setTimeout(() => {
      setOpen(false);
    }, 5000);
    return () => {
      setOpen(false);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [null]);

  return (
    <Box
      onClick={() => {
        setOpen(!open);
        setTimeout(() => setOpen(false), 3000);
      }}
    >
      <Grid container alignContent="center" alignItems="center" spacing={1}>
        <Grid item>{icon}</Grid>
        <Grid item>{title}</Grid>
        <Grid item>
          <ExpandMoreIcon />
        </Grid>
      </Grid>
      <Collapse in={open} timeout={500}>
        <Box pl={4}>{children}</Box>
      </Collapse>
    </Box>
  );
}
