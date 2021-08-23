import { Button, Container, Grid } from "@material-ui/core";
import { useCookies } from "react-cookie";
import SearchResult from "../components/searchresults/searchresult";
import SimpleSearchSummary from "../components/searchresults/simplesearchsumm";

export default function Test4() {
  return (
    <Container>
      <SimpleSearchSummary />
    </Container>
  );
}
