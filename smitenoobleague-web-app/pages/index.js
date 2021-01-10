//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";

//import background component
import FullBackground from "../src/components/FullBackground";
//Auth
import helpers from "utils/helpers";

function Home({LoginSession}) {

  return (
    <>
    <FullBackground src={"dark_bg"} />
    <NavBar LoginSession={LoginSession}/>
  <div className="jumbotron-fluid">
    {/* render body here */}
    <div className=" container halfTransparent mb-2 mt-5 rounded p-3" id="welcomeScreen">
        <h1 className="display-5">Hello, welcome to the Smite Noob League website!</h1>
        <p className="lead">On this site you can view information about the league, including stats and game results.</p>
        <hr className="my-4" />
        <p>If you want more information about the league click the button below to check out our FAQ page</p>
        <p className="lead">
            <a className="btn btn-primary btn-lg mb-4 btn-block" href="/faq" role="button">I want Info</a>
        </p>
    </div>
  </div>
    <Footer />
    </>
  )
}

export async function getServerSideProps(context) {

  const loginSessionData = await helpers.GetLoginSession(context.req);

  return {
      props: {
          LoginSession: loginSessionData
      },
  };
}

export default Home;
