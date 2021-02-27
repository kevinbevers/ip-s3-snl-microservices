//default react imports
import React, { useState, useEffect } from "react";
//default page stuff
import InhouseNavBar from "src/components/inhouses/InhouseNavBar";
import Footer from "src/components/Footer";
//boostrap components
import { Alert, Tab, Nav, Table, Col, Row, Container, Jumbotron } from "react-bootstrap";
//icons
import { FaBox } from "react-icons/fa";
//custom components
import InhouseGameStats from "src/components/inhouses/InhouseGameStats";
import DefaultErrorPage from "next/error";
//Auth
import helpers from "utils/helpers";
//services
import inhouseservice from "services/inhouseservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function matchdetails({LoginSession, MatchupData, status, errMsg, apiToken}) {

  const [teamsInMatch, setTeamsInMatch] = useState([{teamID: 1, teamName: "Order", teamLogoPath: "order.png"},{teamID: 2, teamName: "Chaos", teamLogoPath: "chaos.png"}]);

  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="matchpageErrorPage"/></>);
  }
  else {
    
  return (
    <>
     <InhouseNavBar LoginSession={LoginSession} apiToken={apiToken}/>
      {/* {postData} */}
      <Container fluid className="mt-2">
            {MatchupData?.matchResult != null ?  <InhouseGameStats MatchResult={MatchupData?.matchResult}/>
              : <Row><Col xl={3} md={5} xs={12} className="mx-auto text-center NotPlayedText"><h4 className="font-weight-bold">Game not played</h4></Col></Row>}
      </Container>
      <Footer />
    </>
  );
  }
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);
  let apiTokenForClient = null;

  if (loginSessionData?.user != null) {
    apiTokenForClient = await helpers.GetAccessTokenForClient(context.req, context.res);
  }

  //id from url
  const gameID = context.params.id;
  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };

   //call api for the data
   await inhouseservice.GetInhouseHistoryDetailsByGameID(gameID)
   .then(res => {response.data = res.data})
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
      MatchupData: response.data,
      status: response.statusCode,
      errMsg: response.errMsg,
      apiToken: apiTokenForClient
    }, // will be passed to the page component as props
  }
}