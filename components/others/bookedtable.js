import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import dayjs from "dayjs";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableCellRoot: { borderBottom: "0" },
  typography: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
}));

export default function BookedTable({ associatedRecords, contacts }) {
  const classes = useStyles();
  const records = associatedRecords.filter(
    (record) => record.originSystemCode === "GDS"
  )[0];

  return (
    <TableContainer>
      <Table padding="none" size="small" aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell
              style={{ paddingRight: "20px", borderBottom: "0" }}
              align="left"
            >
              <Typography className={classes.typography}>Date</Typography>
            </TableCell>
            <TableCell style={{ borderBottom: "0" }} align="left">
              <Typography className={classes.typography}>
                {dayjs(records.creationDate).format("ddd DD MMM YYYY")}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ paddingRight: "20px", borderBottom: "0" }}
              align="left"
            >
              <Typography className={classes.typography}>Agency</Typography>
            </TableCell>
            <TableCell style={{ borderBottom: "0" }} align="left">
              <Typography className={classes.typography}>
                NaijaGoingAbroad Ltd
                <br />
                info@naijagoingabroad.com
                <br />
                09065369929
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
