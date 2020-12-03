//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//boostrap components
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import { Alert, Tab, Nav } from "react-bootstrap";
//icons
import { FaBox } from "react-icons/fa";
//custom components
import WinnerTeamTable from "src/components/matchdetails/WinnerTeamTable";
import LoserTeamTable from "src/components/matchdetails/LoserTeamTable";
import WinnerTeamTableStatic from "src/components/matchdetails/WinnerTeamTableStatic";
import LoserTeamTableStatic from "src/components/matchdetails/LoserTeamTableStatic";

import DefaultErrorPage from "next/error";
import axios from "axios";

export default function matchdetails({received}) {

  console.log(received);

  if(received.status != 200)
  {
    return <DefaultErrorPage statusCode={received.status} />
  }
  else if(received.data.ret_msg != ""){
    return <DefaultErrorPage statusCode={404} />
  }
  else {
  return (
    <>
      <NavBar />
      {/* {postData} */}
      <Container fluid className="mt-2">
        <Tab.Container id="GameNavBar" defaultActiveKey="Game1">
          <Row>
            <Col></Col>
            <Col xl={3} md={5} xs={12} className="">
              <Nav variant="pills" className="nav-justified" id="pillNav"> {/*flex and justify center to have the nav links be in the middle of the object */}
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
                  <WinnerTeamTable playerdata={received.data.winners}/>
                  {/* Divider */}
                  <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
                  {/* Team 2 */}
                  <LoserTeamTable playerdata={received.data.losers}/>
                </Col>
                <Col xl={2} md={3} className="my-auto">
                  <Alert variant="secondary">
                    <h5 className="font-weight-bold">Game stats</h5>
                    <hr />
                    <h6><b>Length:</b> {received.data.matchDuration}</h6>
                    <h6><b>Total kills:</b> 100</h6>
                    <h6><b>Total Distance traveled:</b> 200000 units</h6>
                    <h6><b>Objectives taken:</b> 7</h6>
                    <h6><b>MVP:</b> <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="SSG" className="GodImg" rounded/> lolliepoep</h6>
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
                    <h6><b>MVP:</b> <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="SSG" className="GodImg" rounded/> lolliepoep</h6>
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

export async function getServerSideProps({params}) {

try {
  const response = await axios.get("http://localhost:5000/smiteapi-service/Match/" + params.id);
  const received = {
    status: response.status,
    data: response.data,
  }
  return {
    props: {
      received
    }, // will be passed to the page component as props
  }
}
catch {
  const received = {
    status: 404,
    data: {},
  }
  return {
    props: {
      received
    }, // will be passed to the page component as props
  }
}
}