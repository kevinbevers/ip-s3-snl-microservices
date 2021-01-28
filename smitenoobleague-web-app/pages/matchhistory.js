//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap implements
import { Container, Button, Col, Row, Card, Alert } from "react-bootstrap";
//custom implements
import MatchHistoryCard from "src/components/MatchHistoryCard";
//Auth
import helpers from "utils/helpers";
//services
import matchservice from "services/matchservice";

export default function matchhistory({LoginSession, MatchHistory}) {

  const [MatchHistoryState, setMatchHistoryState] = useState(MatchHistory);
  const [index, setIndex] = useState(1);
  const [matchesRemaining, setMatchesRemaining] = useState(MatchHistory?.length > 9);

  const loadMoreMatches = async() => {
    if(matchesRemaining)
    {
      await matchservice.GetMatchupHistoryList(1,index)
      .then(res => {
        setMatchHistoryState(MatchHistoryState.concat(res.data)); 
        setIndex(index + 1); 
        setMatchesRemaining(res.data?.length > 9)
      }).catch(err => {});
    }
  };

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <Container className="mt-4">
      {MatchHistoryState != null ? <>
              {MatchHistoryState.map((mh, index) => (
                        <MatchHistoryCard key={index} MatchupResult={mh} />
              ))}
             </> : 
             <> 
              <Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No matches found / played yet.</h3>
                  </Alert>
                </Col>
                <Col md={3}></Col>
              </Row> 
            </>}
        {matchesRemaining ?        
          <Card className="text-center mb-2" onClick={loadMoreMatches}>
          <a href="#" className="link-unstyled">
            <Card.Header><h4 className="m-0">Load more matches...</h4></Card.Header>
            </a>
            </Card> : <></>}

      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  let latest10Matches = null;

  await matchservice.GetMatchupHistoryList(10,0).then(res => {latest10Matches = res.data;}).catch(err => {});

  return {
      props: {
          LoginSession: loginSessionData,
          MatchHistory: latest10Matches
      },
  };
}