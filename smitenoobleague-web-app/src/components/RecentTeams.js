//default react imports
import React, { useState } from "react";
import Link from "next/link";
//bootstrap implements
import { Container, Row, Col, Button, Card } from "react-bootstrap";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";
export default function RecentTeams({recent}){

  const RenderTeamImage = (t) => {
    const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
    return (t?.teamLogoPath != null ? <div className="RecentTeamLogo mr-2 position-relative"><Image layout={"fill"} alt={t?.teamName} title={t?.teamName} src={imagePath} className="" draggable={false}></Image></div> :
            <Img webp alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="RecentTeamLogo mr-2" draggable={false}></Img>);
};

console.log(recent);

const ReadableDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

    return (
      <Row><Col>
      <Link href={`/matchhistory/${recent?.matchupID}`}>
        <a className="link-unstyled" title={`click to see match details`}>
        <Card className="text-center mb-2">
        <Card.Body className={recent?.won ? "RecentTeamWinBackground p-1" : recent?.lost ? "RecentTeamLossBackground p-1" : "bg-light p-1"}>
          <Container>
            <Row className="">
                <Col md={2} xs={2} className="p-0 mx-auto my-auto"><h3 className="text-center my-auto RecentTeamTitle font-weight-bold">VS</h3></Col>
              <Col md={10} xs={10} className="p-0 mx-auto">
                <Row className="">
                  <Col md={12} xs={12} className="align-items-left d-flex">
                    {RenderTeamImage(recent?.opponent)}
                    <h3 className="text-center my-auto RecentTeamTitle font-weight-bold mb-0">{recent?.opponent?.teamName}</h3>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mb-0">
              <Col className="mb-0"> 
                <p className="mb-0 RecentTeamExtra float-left">{recent?.MatchDurationInSeconds > 0 ? "" : recent?.won ? "Won by Forfeit" : recent?.lost ? "Lost by forfeit" : "In progress"}</p>
                <p className="mb-0 RecentTeamExtra float-right">{ReadableDate(recent?.datePlayed)}</p>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      </a>
      </Link>
      </Col>
      </Row>
    );
}