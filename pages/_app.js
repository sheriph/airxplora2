import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import { RecoilRoot } from "recoil";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";
import { UserProvider } from "@auth0/nextjs-auth0";

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const { user } = pageProps;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <UserProvider user={user}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            maxSnack={3}
          >
            <CookiesProvider>
              <RecoilRoot>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
              </RecoilRoot>
            </CookiesProvider>
          </SnackbarProvider>
        </UserProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
