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
//services
import inhouseservice from "services/inhouseservice";

function Home({LoginSession, Data, status, errMsg, apiToken }) {
  return (
    <>
    <FullBackground src={"inhouse_bg"} />
    <InhouseNavBar LoginSession={LoginSession} apiToken={apiToken}/>
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
              <Col md={3} className="p-0 pl-1 pr-1">
              {Data?.top5KdaPlayers != null ? <InhouseStatCard Title="Average KDA" Stat={Data?.top5KdaPlayers} /> : <> </>}
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
              {Data?.damageDealt != null ? <InhouseStatCard Title="Average Damage Dealt" Stat={Data?.damageDealt} /> : <></>}
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
              {Data?.damageMitigated != null ? <InhouseStatCard Title="Average Damage Mitigated" Stat={Data?.damageMitigated} /> : <> </>}
              </Col>

              <Col md={3} className="p-0 pl-1 pr-1">
              {Data?.killParticipation != null ? <InhouseStatCard Title="Average Kill Participation" Stat={Data?.killParticipation} Percentage={"%"} />: <> </>}
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
  let apiTokenForClient = null;

  if (loginSessionData?.user != null) {
    apiTokenForClient = await helpers.GetAccessTokenForClient(context.req, context.res);
  }

  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };
  //call api for the data
  await inhouseservice.GetInhouseLeaderboardDataLandingPage()
    .then(res => { response.data = res.data })
    .catch(err => {
      if (err.response == null) {
        response.statusCode = 503;
        response.errMsg = "SNL API unavailable";
      }
      else {
        response.statusCode = JSON.stringify(err?.response?.status);
        response.errMsg = err?.response?.data;
      }
    });

  return {
    props: {
      LoginSession: loginSessionData,
      Data: response.data,
      status: response.statusCode,
      errMsg: response.errMsg,
      apiToken: apiTokenForClient
    },
  };
}

export default Home;
