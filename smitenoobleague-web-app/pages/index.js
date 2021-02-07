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
    <div className=" container halfTransparent mb-2 mt-5 rounded p-4" id="welcomeScreen">
        <h1 className="display-5">Welcome to the Smitenoobleague website!</h1>
        <h2 className="lead">The fully automated smite amateur league! Stats, Leaderboards and more.</h2>
        <hr className="my-4" />
        <h6>
          sending screenshots of match results to an admin? no longer!<br />
          the team captain can easily submit the match id on the captain dashboard and the rest happens automatically.<br />
          Questions? your answer is probably found in the <a href="/faq">FAQ</a>.
        </h6>
        <br />
        <p>
        Wondering what's coming up for the Smitenoobleague? check out the <a href="/roadmap">roadmap</a>!
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
