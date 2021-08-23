import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useMediaQuery } from "@material-ui/core";
import { useMoney } from "../../lib/utilities";
import { lowerCase, startCase } from "lodash";

const useStyles = makeStyles({
  table: {
    //  minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function PriceTable({ grandTotal, travelerPricings = [] }) {
  const classes = useStyles();
  const mini = useMediaQuery("(max-width:400px)");

  return (
    <TableContainer>
      <Table
        padding={mini ? "none" : "normal"}
        size="small"
        className={classes.table}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Fare</TableCell>
            <TableCell align="right">Taxes</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {travelerPricings.map((traveler, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {startCase(lowerCase(traveler.travelerType))}
              </TableCell>
              <TableCell align="right">
                {useMoney(traveler.price.base)}
              </TableCell>
              <TableCell align="right">
                {useMoney(traveler.price.total - traveler.price.base)}
              </TableCell>
              <TableCell align="right">
                {useMoney(traveler.price.total)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} component="th" scope="row">
              Grand Total
            </TableCell>
            <TableCell align="right">{useMoney(grandTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
