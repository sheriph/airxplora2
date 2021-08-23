import { makeStyles, TextField, useTheme } from "@material-ui/core";
import { Box } from "@material-ui/core";
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";

export default function SearchRenderInput(
  params,
  showEndCircle,
  isOpen,
  showStartCircle,
  departure
) {
  const theme = useTheme();
  const styles = makeStyles((theme) => ({
    endBox: {
      position: "relative",
      // right: "-10px",
      width: "40px",
      height: "20px",
      // transform: "rotate(-90deg)",
      //  transform: "translate(-50%, -50%)",
      borderRadius: "30px 30px 0 0",
      backgroundColor: theme.palette.common.white,
      // top: "50%",
      // left: "50%",
      // borderColor: theme.palette.text.disabled,
      borderBottomColor: theme.palette.common.white,
      // borderWidth: "1px",
      borderStyle: "solid",
      zIndex: 10000000000000000,
    },
    inputRoot: {
      paddingLeft: "10px !important",
    },
    input: { position: "relative", left: showStartCircle ? "-25px" : "0" },
  }));
  const classes = styles();
  const updatedParams = {
    ...params,
    InputProps: {
      ...params.InputProps,
      endAdornment: showEndCircle ? (
        <Box
          // color={theme.palette.primary.main}
          className={classes.endBox}
          style={{
            borderWidth: isOpen ? "2px" : "1px",
            transform: "rotate(-90deg)",
            right: "-20px",
            margin: "0",
            padding: "0",
          }}
          borderColor={
            isOpen ? theme.palette.primary.main : theme.palette.text.disabled
          }
        ></Box>
      ) : (
        ""
      ),
      startAdornment: (
        <>
          {showStartCircle && (
            <Box
              // color={theme.palette.primary.main}
              className={classes.endBox}
              style={{
                borderWidth: isOpen ? "2px" : "1px",
                transform: "rotate(90deg)",
                left: "-20px",
              }}
              borderColor={
                isOpen
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled
              }
            ></Box>
          )}
          {departure ? (
            <FiberManualRecordOutlinedIcon
              style={{
                position: "relative",
                left: showStartCircle ? "-25px" : "0",
              }}
              color="disabled"
            />
          ) : (
            <LocationOnOutlinedIcon
              style={{
                position: "relative",
                left: showStartCircle ? "-25px" : "0",
              }}
              color="disabled"
            />
          )}
        </>
      ),
    },
  };
  return (
    <TextField
      placeholder={`${departure ? "Where from" : "Where To"}`}
      {...updatedParams}
      variant="outlined"
    />
  );
}
