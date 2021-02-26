//default react imports
import React, { useState, useEffect } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//boostrap components
import { Alert, Tab, Nav, Table, Col, Row, Container, Jumbotron } from "react-bootstrap";
//icons
import { FaBox } from "react-icons/fa";
//custom components
import GameStats from "src/components/matchdetails/GameStats";
import DefaultErrorPage from "next/error";
//Auth
import helpers from "utils/helpers";
//services
import matchservice from "services/matchservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function matchdetails({LoginSession, MatchupData, status, errMsg}) {

  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="matchpageErrorPage"/></>);
  }
  else {
    
  return (
    <>
     <NavBar LoginSession={LoginSession}/>
      {/* {postData} */}
      <Container fluid className="mt-2">
            {MatchupData?.matchResults?.length > 0 ?  <GameStats MatchResult={MatchupData?.matchResults[0]} teamsInMatch={MatchupData?.teamsInMatch}/>
              : <Row><Col xl={3} md={5} xs={12} className="mx-auto text-center NotPlayedText"><h4 className="font-weight-bold">Game not played</h4></Col></Row>}
      </Container>
      <Footer />
    </>
  );
  }
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);


  //id from url
  const matchupID = context.params.id;
  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };

   //call api for the data
   await matchservice.GetMatchupHistoryByMatchupID(matchupID)
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
    }, // will be passed to the page component as props
  }
}