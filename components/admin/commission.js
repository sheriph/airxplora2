import React from "react";
import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Container,
  IconButton,
  Fab,
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
  GetAirlineName,
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
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { remove } from "lodash";

export default function Commission({ rows, setRows }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const starterTemp = {
    id: 1,
    col2: { iataCode: "-" },
    col3: "-",
    col4: "-",
    col5: "-",
    col6: "-",
  };

  const renderEditCellComponent = (props) => {
    const { id, value, api, field } = props;

    const [commisionType, setType] = useState("-");
    console.log(`id, value, field`, id, value, field);

    const handleChange = (event) => {
      setType(event.target.value);
      api.setEditCellValue({ id, field, value: event.target.value }, event);
      // Check if the event is not from the keyboard
      // https://github.com/facebook/react/issues/7407
      if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
        api.commitCellChange({ id, field });
        // api.setCellMode(id, field, "view");
        const rowUpdate = rows.map((row) => {
          if (row.id === id) {
            return { ...row, [field]: event.target.value };
          }
          return row;
        });
        setRows(rowUpdate);
      }
    };
    console.log(`commissionType`, commisionType === "Mark Up (₦)")
    return (
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={commisionType}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="-">-</MenuItem>
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
        const rowUpdate = rows.map((row) => {
          if (row.id === id) {
            return { ...row, [field]: event.target.value };
          }
          return row;
        });
        setRows(rowUpdate);
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
        if (
          event.nativeEvent.clientX !== 0 &&
          event.nativeEvent.clientY !== 0
        ) {
          api.commitCellChange({ id, field });
          const rowUpdate = rows.map((row) => {
            if (row.id === id) {
              return { ...row, [field]: value };
            }
            return row;
          });
          setRows(rowUpdate);
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

  const columns = [
    {
      field: "col2",
      headerName: "Airline",
      width: 180,
      editable: true,
      renderEditCell: renderEditCellComponent3,
      renderCell: ({ row: { col2 } }) => renderCellComponent2(col2.iataCode),
    },
    {
      field: "col3",
      editable: true,
      headerName: "Type A",
      renderEditCell: renderEditCellComponent,
      renderCell: ({ row: { col3 } }) => renderCellComponent(col3),
      width: 150,
    },
    {
      field: "col4",
      editable: true,
      renderEditCell: renderEditCellComponent2,
      renderCell: ({ row: { col4 } }) => renderCellComponent(col4),
      headerName: "Value A",
      width: 150,
    },
    {
      field: "col5",
      headerName: "Type B",
      renderEditCell: renderEditCellComponent,
      editable: true,
      renderCell: ({ row: { col5 } }) => renderCellComponent(col5),
      width: 150,
    },
    {
      field: "col6",
      headerName: "Value B",
      width: 150,
      editable: true,
      renderEditCell: renderEditCellComponent2,
      renderCell: ({ row: { col6 } }) => renderCellComponent(col6),
    },
  ];

  console.log(`rows`, rows);

  const handleDelete = () => {
    const getRemainingRows = rows.filter((row) => {
      for (let item of selectedRows) {
        if (item === row.id) return false;
      }
      return true;
    });
    const updateId = getRemainingRows.map((row, i) => ({
      ...row,
      id: i + 1,
    }));
    setRows(updateId);
  };

  const handleAdd = () => {
    const updateRow = [...rows, { ...starterTemp, id: rows.length + 1 }];
    setRows(updateRow);
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSave = async () => {
    console.log(`rows`, rows);
    for (let row of rows) {
      console.log(`row`, row);
      const {
        col2: { iataCode },
        col3,
        col4,
        col5,
        col6,
      } = row;

      if (!iataCode) {
        enqueueSnackbar("Airline name is mandatory", { variant: "error" });
        return;
      }
      if (col3 === col5) {
        enqueueSnackbar(
          "Type A and Type B must not be the same. Avoid repetition  of same commission types. Alternatively, you can set only one of the the commission types",
          { variant: "error" }
        );
        return;
      }
      if (col3.includes("%")) {
        if (Number(col4) > 100) {
          enqueueSnackbar("Percentage must be between 0 and 100", {
            variant: "error",
          });
          return;
        }
      }
      if (col5.includes("%")) {
        if (Number(col6) > 100) {
          enqueueSnackbar("Percentage must be between 0 and 100", {
            variant: "error",
          });
          return;
        }
      }
    }

    let config = {
      method: "post",
      url: "/api/updatecommission",
      data: {
        commission: rows,
      },
    };

    try {
      setLoading(true);
      const response = await axiosAirxplora(config, 3);
      console.log("response", response);
      enqueueSnackbar("Saved successfully", { variant: "success" });
    } catch (error) {
      console.log("error :>> ", error);
      enqueueSnackbar("Update fail, please try again", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getRows = async () => {
      let config = {
        method: "get",
        url: "/api/getcommission",
      };
      try {
        setLoading(true);
        const response = await axiosAirxplora(config, 3);
        const { commission } = response.data;
        console.log("response", commission);
        setRows(commission);
        enqueueSnackbar("Success", { variant: "success" });
      } catch (error) {
        console.log("error :>> ", error);
        enqueueSnackbar("Database connection fail, refresh page", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (rows.length === 0) {
      getRows();
    }
  }, [null]);
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
          loading={loading}
          checkboxSelection={true}
          disableSelectionOnClick
          onSelectionModelChange={(s, r) => setSelectedRows(s)}
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: CustomLoadingOverlay,
            Footer: () => (
              <Container>
                <Box display="flex" justifyContent="space-between" mt={5}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    save
                  </Button>
                  <Fab
                    disabled={selectedRows.length > 0 ? false : true}
                    size="small"
                    color="primary"
                    aria-label="add"
                    onClick={handleDelete}
                  >
                    <DeleteOutlineIcon />
                  </Fab>
                  <Button
                    disabled={loading}
                    color="primary"
                    variant="contained"
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                </Box>
              </Container>
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

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

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

const renderCellComponent2 = (iataCode) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      alignContent="center"
    >
      <Grid item>
        {iataCode !== "-" ? <GetAirlineName iataCode={iataCode} /> : "-"}
      </Grid>
      <Grid item style={{ paddingTop: "10px" }}>
        <EditIcon fontSize="small" color="primary" />
      </Grid>
    </Grid>
  );
};
