import "../styles/globals.css";
import type { AppProps } from "next/app";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import convexConfig from "../convex.json";
import clientConfig from "../convex/_generated/clientConfig";
const convex = new ConvexReactClient(clientConfig);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProviderWithAuth0
      client={convex}
      authInfo={convexConfig.authInfo[0]}
    >
      <Component {...pageProps} />;
    </ConvexProviderWithAuth0>
  );
}

export default MyApp;
