//default react imports
import React, { useState } from "react";
//default page stuff
import InhouseNavBar from "src/components/inhouses/InhouseNavBar";
import Footer from "src/components/Footer";
//bootstrap implements
import { Container, Button, Col, Row, Card, Alert } from "react-bootstrap";
//custom implements
import InhouseMatchHistoryCard from "src/components/inhouses/InhouseMatchHistoryCard";
//Auth
import helpers from "utils/helpers";
//services
import inhouseservice from "services/inhouseservice";

export default function matchhistory({LoginSession, MatchHistory, apiToken}) {
  const [MatchHistoryState, setMatchHistoryState] = useState(MatchHistory);
  const [index, setIndex] = useState(1);
  const [matchesRemaining, setMatchesRemaining] = useState(MatchHistory?.length > 9);
  
  const loadMoreMatches = async() => {
    if(matchesRemaining)
    {
      await inhouseservice.GetInhouseHistoryList(1,index)
      .then(res => {
        setMatchHistoryState(MatchHistoryState.concat(res.data)); 
        setIndex(index + 1); 
        setMatchesRemaining(res.data?.length > 9)
      }).catch(err => {setMatchesRemaining(false);});
    }
  };

  function RemoveMatch(gameID){
    let art = MatchHistoryState;
    const arr = art.filter((item) => item.gameID !== gameID);
    setMatchHistoryState(arr);
  };

  return (
    <>
      <InhouseNavBar LoginSession={LoginSession} apiToken={apiToken}/>
      <Container className="mt-4">
      {MatchHistoryState?.length > 0 ? <>
              {MatchHistoryState.map((mh, index) => (
                        <InhouseMatchHistoryCard key={index} MatchupResult={mh} adminManage={LoginSession?.isAdmin || LoginSession?.isMod} apiToken={apiToken} removeMatchFunc={RemoveMatch} />
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
          <Card className="text-center mb-2 link-unstyled Clickable" onClick={loadMoreMatches}>
            <Card.Header><h4 className="m-0">Load more matches...</h4></Card.Header>
            </Card> : <></>}

      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  let apiTokenForClient = null;

  if (loginSessionData?.user != null) {
    apiTokenForClient = await helpers.GetAccessTokenForClient(context.req, context.res);
  }

  let latest10Matches = null;

  await inhouseservice.GetInhouseHistoryList(10,0).then(res => {latest10Matches = res.data;}).catch(err => {});

  return {
      props: {
          LoginSession: loginSessionData,
          MatchHistory: latest10Matches,
          apiToken: apiTokenForClient
      },
  };
}