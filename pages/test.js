import { Box, Container } from "@material-ui/core";
import BookingForm from "../components/bookingform/bookingForm";
import OneStop from "../components/searchresults/onestop";
import ResultPage from "../components/searchresults/resultpage";
import SearchSummary from "../components/searchresults/searchsummary";
import Stop from "../components/searchresults/stop";
import TripCard from "../components/searchresults/tripcard";
import TripLine from "../components/searchresults/tripline";

export default function Test() {
  return (
    <Container>
      <ResultPage />
    </Container>
  );
}
