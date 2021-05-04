//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";

//import background component
import FullBackground from "src/components/FullBackground";
//Auth
import helpers from "utils/helpers";

function Home({LoginSession}) {

  return (
    <>
    <FullBackground src={"bg"} />
    <NavBar LoginSession={LoginSession}/>
  <div className="jumbotron-fluid">
    {/* render body here */}
    <div className=" container halfTransparent mb-2 mt-5 rounded p-4" id="welcomeScreen">
        <h2 className="landingTitle font-weight-bold">Welcome to the Smitenoobleague website!</h2>
        <h2 className="lead">The fully automated smite amateur league! Stats, Leaderboards and more.</h2>
        <hr className="my-4" />
        <h6>
          sending screenshots of match results to an admin? no longer!<br />
          the team captain can easily submit the match id on the captain dashboard and the rest happens automatically.<br />
          Questions? your answer is probably found in the <a href="/faq">FAQ</a>.
        </h6>
        <br />
        <p className="smallText">
        Wondering what's coming up for the Smitenoobleague? check out the <a href="/roadmap">roadmap</a>!
        </p>
        <h4 className="font-weight-bold mb-0">Sign up!</h4>
        <p className="smallText">
        If you want to sign up as a team captain you should send an e-mail to <a href="mailto:signup@smitenoobleague.com?SUBJECT=Sign up for captain">signup@smitenoobleague.com</a> with the following information:<br />
          - Your Gamertag / IGN.<br />
          - Your Platform.<br />
          - Your Region <br />
          - Your estimated skill level (Bronze/Silver/Gold/Platinum/Diamond/Masters).<br />
          - Skill level of the team you have in mind(Estimation of all members combined).<br />
        </p>
        <h4 className="font-weight-bold mb-0">Partnership with Audacity Gaming</h4>
        <p>
        We’re proud to partner with <a href="https://discord.gg/PNAH9P9RJU" target="_blank">Audacity Gaming</a>.<br />One of the first things that this partnership brings is an <a href="/inhouses" target="_blank">InHouse StatTracker</a> where you can compete to be the top dog of the Audacity inhouses.<br />
        We are both looking forward to bring you more innovative solutions to elevate your smite experience to the next level.
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
