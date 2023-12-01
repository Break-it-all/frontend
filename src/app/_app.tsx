import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import wrapper from "../store";

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>MyApp</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(MyApp);
