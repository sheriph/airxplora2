import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { lowerCase, startCase } from "lodash";
import { Typography, useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableCellRoot: {
    borderBottom: "0",
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  tableContainer: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
}));

export default function NameTable({ travelers }) {
  const classes = useStyles();
  const mobile = useMediaQuery("(max-width:900px)");

  return (
    <TableContainer style={{ marginBottom: mobile ? "20px" : "0" }}>
      <Table padding="none" size="small" aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell
              style={{ paddingRight: "20px", borderBottom: "0" }}
              align="left"
            >
              <Typography className={classes.tableContainer}>
                Traveler(s)
              </Typography>
            </TableCell>
            <TableCell classes={{ root: classes.tableCellRoot }} align="left">
              {travelers.map((traveler, index) => (
                <Typography key={index}>
                  {startCase(lowerCase(traveler.name.lastName))} /{" "}
                  {startCase(lowerCase(traveler.name.firstName))}
                </Typography>
              ))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
