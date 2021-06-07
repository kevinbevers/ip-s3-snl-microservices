//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap
import {Row, Col} from "react-bootstrap";
//import background component
import FullBackground from "src/components/FullBackground";
import VideoBackground from "src/components/VideoBackground";
//Auth
import helpers from "utils/helpers";
//image optimization
import Img from 'react-optimized-image';

function Home({LoginSession}) {

  return (
    <>
    <VideoBackground />
    {/* <FullBackground src={"bg"} /> */}
    <NavBar LoginSession={LoginSession} hideLogo={true}/>
  <div className="jumbotron-fluid">
    {/* render body here */}
    <div className=" container mb-2 mt-5 rounded p-4" id="welcomeScreen">
        <Row className="mb-2"><Col className="d-flex justify-content-center"><Img alt={"SNL Roadmap"} height={400} webp src={require("public/images/SCL_Logo.png")} className="" draggable={false}></Img></Col></Row>
        <h2 className="landingTitle font-weight-bold text-white text-center">The fully automated smite amateur league!</h2>
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
