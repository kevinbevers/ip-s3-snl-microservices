//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';
//boostrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
//custom imports
import LeaderBoardStatCard from 'src/components/LeaderboardStatCard';

export default function leaderboards() {

  const [Top10Array, setTop10Array] = useState([
    {standing: 1,player: "playername", statvalue: "9999999999"},
    {standing: 2,player: "playername", statvalue: "9999999999"},
    {standing: 3,player: "playername", statvalue: "9999999999"},
    {standing: 4,player: "playername", statvalue: "9999999999"},
    {standing: 5,player: "playername", statvalue: "9999999999"},
    {standing: 6,player: "playername", statvalue: "9999999999"},
    {standing: 7,player: "playername", statvalue: "9999999999"},
    {standing: 8,player: "playername", statvalue: "9999999999"},
    {standing: 9,player: "playername", statvalue: "9999999999"},
    {standing: 10,player: "playername", statvalue: "9999999999"},
  ]); //Init top10array value

  // question#1 should all the data be pulled on page load and drippled down to the components or should each component make it's own call.
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
                <LeaderBoardStatCard title={"Kill"} val={Top10Array}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard title={"Assists"} val={Top10Array}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard title={"Damage dealt"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Damage Mitigated"} val={Top10Array}/>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Pie chart of total damage dealt */}
            <Row>
              <Col md={12} className="text-center"><h3>Pie chart of damage</h3></Col>
            </Row>
            <div className='border border-dark mr-1 piechart  mx-auto rounded-circle'></div>

          </Col>
        </Row>

        {/* Second row of stats */}
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
              <LeaderBoardStatCard title={"Kill participation"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Deaths"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Damage taken"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Healing"} val={Top10Array}/>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Line Chart of stats */}
            <Row>
              <Col md={12} className="text-center"><h3>Chart of stats</h3></Col>
            </Row>
            <Row className="h-75">
              <div className='border border-dark mr-1 w-100'></div>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}