import "bootstrap/dist/css/bootstrap.min.css";
import "src/styles/globals.css"; 
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
      <title>Smite Champions 🏆</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
