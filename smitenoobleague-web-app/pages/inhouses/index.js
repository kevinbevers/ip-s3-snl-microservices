//default react imports
import React, { useState } from "react";
//default page stuff
import InhouseNavBar from "src/components/inhouses/InhouseNavBar";
import Footer from "src/components/Footer";
import InhouseStatCard from "src/components/inhouses/InhouseStatCard";
//import bootstrap
import {Row, Col, Container} from "react-bootstrap";
//import background component
import FullBackground from "src/components/FullBackground";
//Auth
import helpers from "utils/helpers";
//icon
import {FaDiscord} from "react-icons/fa";

function Home({LoginSession}) {

  return (
    <>
    <FullBackground src={"inhouse_bg"} />
    <InhouseNavBar LoginSession={LoginSession}/>
    <Container fluid>
  <div className="jumbotron-fluid">
    {/* render body here */}
    <div className=" container halfTransparent mb-2 mt-5 rounded p-4" id="welcomeScreen">
        <h3 className="landingTitle font-weight-bold">Welcome to InHouse StatTracker, a SmiteNoobLeague x AudacityGaming partnership</h3>
        <h2 className="lead">Inhouse match history, leaderboards and detailed statistics.</h2>
        <hr className="my-4" />
        <h4 className="font-weight-bold mb-0">Join the inhouses now!</h4>
        <p className="smallText">
        If you want to join an InHouse, join the Discord and go to <a href="https://discord.gg/mYgpURSwK3" target="_blank" title="Join AudacityGaming Discord">#inhouses</a><br />
        </p>
        <a className="btn btn-primary btn-block" target="_blank" href="https://discord.gg/audacitygaming">Join AudacityGaming <FaDiscord /></a>
    </div>
  </div>
  <Row>
          <Col md={11} className="mx-auto">
            <Row>
              <Col md={3}>
              <InhouseStatCard Title="Average KDA" />
              </Col>

              <Col md={3}>
              <InhouseStatCard Title="Average Damage Dealt" />
              </Col>

              <Col md={3}>
              <InhouseStatCard Title="Average Damage Mitigated" />
              </Col>

              <Col md={3}>
              <InhouseStatCard Title="Average Kill Participation" />
              </Col>
            </Row>
          </Col>
        </Row>
        </Container>
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
