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
import TeamTable from "src/components/matchdetails/TeamTable";
import LoserTeamTable from "src/components/matchdetails/LoserTeamTable";
import WinnerTeamTableStatic from "src/components/matchdetails/WinnerTeamTableStatic";
import LoserTeamTableStatic from "src/components/matchdetails/LoserTeamTableStatic";
import DefaultErrorPage from "next/error";
//Auth
import helpers from "utils/helpers";
//services
import matchservice from "services/matchservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function matchdetails({LoginSession, MatchupData, status, errMsg}) {

  console.log(MatchupData);

  const CalculateTotals = (winner, loser) => {

    let totals = {killCount: 0, fireGiantsWinner: 0, fireGiantsLoser: 0, goldFuriesWinner: 0, goldFuriesLoser: 0}

    winner.forEach(p => {totals.killCount += p.kills; totals.fireGiantsWinner += p.fireGiantsKilled; totals.goldFuriesWinner += p.goldFuriesKilled;});
    loser.forEach(p => {totals.killCount += p.kills; totals.fireGiantsLoser += p.fireGiantsKilled; totals.goldFuriesLoser += p.goldFuriesKilled;});

    return totals;
  };

  const RenderTeamImage = (t) => {

    const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
    return (t?.teamLogoPath != null ? <Image height={20} width={20} alt={t?.teamName} src={imagePath} className="" draggable={false}></Image>  : 
    <Img width={20} height={20} alt={t?.teamName} src={require("public/images/teamBadge.png")} className="" draggable={false}></Img>);
  };

  const [totals, setTotals] = useState([]);
  
  useEffect(() => {
    if(MatchupData?.matchResults?.length > 0)
    {
      MatchupData?.matchResults.forEach(mr => {const data = CalculateTotals(mr?.winners, mr?.losers); setTotals(totals => [...totals, data]);});
    }
  }, []);

  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="matchpageErrorPage"/></>);
  }
  else {
    
  return (
    <>
     <NavBar LoginSession={LoginSession}/>
      {/* {postData} */}
      <Container fluid className="mt-2">
        <Tab.Container id="GameNavBar" defaultActiveKey="Game1">
          <Row>
            <Col></Col>
            <Col xl={3} md={5} xs={12} className="">
              <Nav variant="pills" className="nav-justified"> {/*flex and justify center to have the nav links be in the middle of the object, grey color: id="pillNav" */}
                <Nav.Item className="secondary">
                  <Nav.Link eventKey="Game1" >Game 1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Game2">Game 2</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Game3">Game 3</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col></Col>
          </Row>
          <Tab.Content className="mt-2">
            <Tab.Pane eventKey="Game1">
              <Row>
                <Col xl={2} md={0}></Col>
                <Col xl={8} md={9} xs={12}>
                  {/* Team 1 */}
                  <TeamTable playerdata={MatchupData?.matchResults[0].winners} team={MatchupData.teamsInMatch.filter(t => t.teamID == MatchupData?.matchResults[0].winningTeamID)[0]}/>
                  {/* Divider */}
                  <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
                  {/* Team 2 */}
                  <TeamTable playerdata={MatchupData?.matchResults[0].losers} team={MatchupData.teamsInMatch.filter(t => t.teamID == MatchupData?.matchResults[0].losingTeamID)[0]}/>
                </Col>
                <Col xl={2} md={3} className="my-auto">
                  <Alert variant="secondary">
                    <h5 className="font-weight-bold">Game stats</h5>
                    <hr />
                    <h6><b>Game length:</b> {MatchupData?.matchResults[0].matchDuration}</h6>
                    <h6><b>Total kills:</b> {totals[0]?.killCount}</h6>
                    <h6 className="d-flex"><b>FG's 🔥taken:</b> <span className="mr-1 ml-1">{totals[0]?.fireGiantsWinner}</span> {RenderTeamImage(MatchupData.teamsInMatch.filter(t => t.teamID == MatchupData?.matchResults[0].winningTeamID)[0])} <span className="ml-1 mr-1">{totals[0]?.fireGiantsLoser}</span> {RenderTeamImage(MatchupData.teamsInMatch.filter(t => t.teamID == MatchupData?.matchResults[0].losingTeamID)[0])}</h6>
                    <h6 className="d-flex"><b>GF's 🔱taken:</b> <span className="mr-1 ml-1">{totals[0]?.goldFuriesWinner}</span> {RenderTeamImage(MatchupData.teamsInMatch.filter(t => t.teamID == MatchupData?.matchResults[0].winningTeamID)[0])} <span className="ml-1 mr-1">{totals[0]?.goldFuriesLoser}</span> {RenderTeamImage(MatchupData.teamsInMatch.filter(t => t.teamID == MatchupData?.matchResults[0].losingTeamID)[0])}</h6>
                    <h6 className="d-flex"> <b className="mr-1">MVP:</b> <Image height={20} width={20} src={"https://static.smite.guru/i/champions/icons/ratatoskr.jpg"} alt="MvpGod" className="GodImg rounded"/> <span className="ml-1">lolliepoep</span></h6>
                    <p className="mb-0">A little text describing the game, possibly auto generated.</p>
                  </Alert>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="Game2">
            <Row>
                <Col xl={2} md={0}></Col>
                <Col xl={8} md={9} xs={12}>
                  {/* Team 1 */}
                  <WinnerTeamTableStatic />
                  {/* Divider */}
                  <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
                  {/* Team 2 */}
                  <LoserTeamTableStatic />
                </Col>
                <Col xl={2} md={3} className="my-auto">
                <Alert variant="secondary">
                    <h5 className="font-weight-bold">Game stats</h5>
                    <hr />
                    <h6><b>Length:</b> 24 min 35 sec</h6>
                    <h6><b>Total kills:</b> 100</h6>
                    <h6><b>Total Distance traveled:</b> 200000 units</h6>
                    <h6><b>Objectives taken:</b> 7</h6>
                    <h6><b>MVP:</b> <Image height={30} width={30} src={"https://static.smite.guru/i/champions/icons/ratatoskr.jpg"} alt="MvpGod" className="GodImg rounded"/> lolliepoep</h6>
                    <p className="mb-0">A little text describing the game, possibly auto generated.</p>
                  </Alert>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="Game3">  
            <Row>
              <Col xl={3} md={5} xs={12} className="mx-auto text-center NotPlayedText"><h4 className="font-weight-bold">Game not played</h4></Col>
            </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
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