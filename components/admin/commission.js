import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  GridOverlay,
} from "@mui/x-data-grid";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import EditIcon from "@material-ui/icons/Edit";
import { useEffect, useState } from "react";
import {
  airlines,
  axiosAirxplora,
  getMoreOrderData,
} from "../../lib/utilities";
import { useRecoilState } from "recoil";
import {
  flightOffer_,
  openDrawer_,
  order_,
  xpaDictionary_,
} from "../../lib/state";
import Loader from "../others/loader";
import MyDrawer from "../others/drawer";
import DetailedTripInfo from "../searchresults/detailedtripinfo";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { Autocomplete } from "@material-ui/lab";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

const renderEditCellComponent = (props) => {
  const { id, value, api, field } = props;
  const [commisionType, setType] = useState("");

  const handleChange = (event) => {
    setType(event.target.value);
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    // Check if the event is not from the keyboard
    // https://github.com/facebook/react/issues/7407
    if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
      api.commitCellChange({ id, field });
      // api.setCellMode(id, field, "view");
    }
  };
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={commisionType}
      onChange={handleChange}
      fullWidth
    >
      <MenuItem value="None">None</MenuItem>
      <MenuItem value="Mark Up (%)">Mark Up (%)</MenuItem>
      <MenuItem value="Mark Down (%)">Mark Down (%)</MenuItem>
      <MenuItem value="Mark Up (&#8358;)">Mark Up (&#8358;)</MenuItem>
      <MenuItem value="Mark Down (&#8358;)">Mark Down (&#8358;)</MenuItem>
    </Select>
  );
};

const renderEditCellComponent2 = (props) => {
  const { id, value, api, field } = props;
  const [val, setVal] = useState("");

  const handleChange = (event) => {
    setVal(event.target.value);
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    // Check if the event is not from the keyboard
    // https://github.com/facebook/react/issues/7407
    if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
      api.commitCellChange({ id, field });
      // api.setCellMode(id, field, "view");
    }
  };
  return (
    <TextField
      value={val}
      onChange={handleChange}
      variant="outlined"
      type="number"
    />
  );
};

const renderEditCellComponent3 = (props) => {
  const { id, value, api, field } = props;
  const handleChange = (event, value, reason) => {
    // if (value.length > 2) return;
    //setVal(event.target.value);
    if (reason === "select-option") {
      console.log(`value`, value);
      api.setEditCellValue({ id, field, value: value }, event);
      // Check if the event is not from the keyboard
      // https://github.com/facebook/react/issues/7407
      if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
        api.commitCellChange({ id, field });
        // api.setCellMode(id, field, "view");
      }
    }
  };
  const options = [{ iataCode: "BA" }];
  return (
    <Autocomplete
      fullWidth
      options={airlines}
      onChange={handleChange}
      getOptionLabel={(option) => option.iataCode}
      // style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          fullWidth
          {...params}
          label="Airline Code"
          variant="outlined"
        />
      )}
    />
  );
};

const renderCellComponent = (col) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      alignContent="center"
    >
      <Grid item>{col}</Grid>
      <Grid item style={{ paddingTop: "10px" }}>
        <EditIcon fontSize="small" color="primary" />
      </Grid>
    </Grid>
  );
};

export default function Commission() {
  const [cell, setCell] = useState("");
  const columns = [
    {
      field: "col2",
      headerName: "Airline",
      width: 180,
      editable: true,
      renderEditCell: renderEditCellComponent3,
      renderCell: ({ row: { col2 } }) => renderCellComponent(col2.iataCode),
    },
    {
      field: "col3",
      editable: true,
      headerName: "Type 1",
      renderEditCell: renderEditCellComponent,
      renderCell: ({ row: { col3 } }) => renderCellComponent(col3),
      width: 150,
    },
    {
      field: "col4",
      editable: true,
      renderEditCell: renderEditCellComponent2,
      renderCell: ({ row: { col4 } }) => renderCellComponent(col4),
      headerName: "Value",
      width: 120,
    },
    {
      field: "col5",
      headerName: "Type 2",
      renderEditCell: renderEditCellComponent,
      editable: true,
      renderCell: ({ row: { col5 } }) => renderCellComponent(col5),
      width: 150,
    },
    {
      field: "col6",
      headerName: "Value",
      width: 120,
      editable: true,
      renderEditCell: renderEditCellComponent2,
      renderCell: ({ row: { col6 } }) => renderCellComponent(col6),
    },
  ];
  const rows = [
    {
      id: 1,
      col2: "-",
      col3: "-",
      col4: "-",
      col5: "-",
      col6: "-",
    },
  ];
  console.log(`rows`, rows);
  return (
    <Grid container spacing={2}>
      <Grid container item spacing={2}>
        <Grid item>
          <Typography gutterBottom variant="h5" align="center">
            Commission Settings
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <DataGrid
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: CustomLoadingOverlay,
            Footer: () => (
              <Button onClick={() => console.log(rows)}>save</Button>
            ),
          }}
          // loading={isChecking}
          autoHeight
          rows={rows}
          // @ts-ignore
          columns={columns}
        />
      </Grid>
    </Grid>
  );
}
