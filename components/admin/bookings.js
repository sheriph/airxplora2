import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
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
import { useEffect, useState } from "react";
import { axiosAirxplora, getMoreOrderData } from "../../lib/utilities";
import { first, trim } from "lodash";
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

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function Bookings({ myRows = [], setRows }) {
  const columns = [
    // { field: "col1", headerName: "No", width: 100 },
    {
      field: "col2",
      headerName: "Created",
      width: 180,
      renderCell: ({ row: { col2: time } }) => (
        <span onClick={() => console.log(time)}>
          {dayjs(time).format("DD/MM/YYYY hh:mm a")}
        </span>
      ),
    },
    { field: "col3", headerName: "Name", width: 150 },
    { field: "col4", headerName: "Reference", width: 150 },
    { field: "col5", headerName: "Payable", width: 150 },
    {
      field: "col6",
      headerName: "View",
      width: 130,
      renderCell: ({
        row: {
          col6: { lastName, reference },
        },
      }) => (
        <Button
          onClick={() => checkNow(lastName, reference)}
          endIcon={<OpenInNewIcon />}
          variant="contained"
          color="primary"
          size="small"
          disabled={isChecking}
        >
          View
        </Button>
      ),
    },
  ];
 // const [myRows, setRows] = useState([]);
  const rows = [
    {
      id: 1,
      col1: "1",
      col2: "20-10-2021 6:15pm",
      col3: "Adeniyi Sheriff Subair",
      col4: "XFSFSHH",
      col5: "NGN 250,900",
      col6: "Ticketed",
      col7: "View",
    },
  ];
  const [order, setOrder] = useRecoilState(order_);
  const [associatedRecords, setRecord] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [ticketingAgreement, setAgreement] = useState(null);
  const [travelers, setTraveller] = useState(null);
  const [flightOffer, setOffer] = useRecoilState(flightOffer_);
  const [dictionary, setDictionary] = useRecoilState(xpaDictionary_);
  const [isChecking, setChecking] = useState(false);
  const [openDrawer, setDrawer] = useRecoilState(openDrawer_);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleClose = () => {
    setDrawer(false);
  };

  const getData = async () => {
    setChecking(true);
    let config = {
      method: "get",
      url: "/api/getadminorders",
    };
    try {
      const data = await axiosAirxplora(config, 2);
      console.log(`data`, data.data);
      const myRows = data.data.map((item, i) => ({
        id: i + 1,
        col1: `${i + 1}`,
        col2: first(
          item.associatedRecords.filter(
            (record) => record.originSystemCode === "GDS"
          )
        )["creationDate"],
        col3: `${first(item.travelers)["name"].lastName} ${
          first(item.travelers)["name"].firstName
        }`,
        col4: first(
          item.associatedRecords.filter(
            (record) => record.originSystemCode === "GDS"
          )
        )["reference"],
        col5: item.flightOffer.price.grandTotal,
        col6: {
          lastName: first(item.travelers)["name"].lastName,
          reference: first(item.associatedRecords)["reference"],
        },
      }));
      const sorted = console.log(`myRows`, myRows);
      setRows(myRows);
    } catch (err) {
      console.log(`err`);
    } finally {
      setChecking(false);
    }
  };

  const checkNow = async (lastName, reference) => {
    try {
      setChecking(true);
      const response = await getMoreOrderData(
        trim(lastName.toLocaleUpperCase()),
        trim(reference.toLocaleUpperCase())
      );
      console.log(`response`, response);
      const { id, dictionary, flightOffer } = response.data;
      let config = {
        method: "get",
        url: `https://test.api.amadeus.com/v1/booking/flight-orders/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            window.localStorage.getItem("access_token")
          )}`,
        },
      };
      const orderResponse = await axiosAirxplora(config, 2);
      console.log(`orderResponse`, orderResponse);
      setOffer(flightOffer);
      setDictionary(dictionary);
      const { associatedRecords, contacts, ticketingAgreement, travelers } =
        orderResponse.data.data;
      setRecord(associatedRecords);
      setContacts(contacts);
      setAgreement(ticketingAgreement);
      setTraveller(travelers);
      //    setOrder(orderResponse.data.data);
      setDrawer(true);
    } catch (error) {
      console.log(`booking retrieval error`, error);
      if (error.message?.includes("404")) {
        enqueueSnackbar("Booking Canceled", { variant: "error" });
      } else {
        enqueueSnackbar("Request Fail, Try Again", { variant: "warning" });
      }
      // setOpen(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    //console.log(`getting data`);
  }, [null]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/*  <Loader open={isChecking} /> */}
        <MyDrawer handleClose={handleClose} open={openDrawer}>
          <DetailedTripInfo
            ticketingAgreement={ticketingAgreement}
            associatedRecords={associatedRecords}
            travelers={travelers}
            contacts={contacts}
            dictionary={dictionary}
            flightOffer={flightOffer}
            handleClose={handleClose}
            booked={true}
          />
        </MyDrawer>
      </Grid>
      <Grid container item spacing={2} justifyContent="space-between">
        <Grid item>
          <Typography gutterBottom variant="h5" align="center">
            Online Bookings
          </Typography>
        </Grid>
        <Grid item>
          <Button
            disabled={isChecking}
            onClick={() => getData()}
            color="primary"
            variant="contained"
          >
            UPDATE
          </Button>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <DataGrid
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: CustomLoadingOverlay,
          }}
          loading={isChecking}
          autoHeight
          rows={myRows}
          // @ts-ignore
          columns={columns}
        />
      </Grid>
    </Grid>
  );
}
