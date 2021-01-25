//default react imports
import React, { useState } from "react";
//bootstrap implements
import { Container, Col, Button, Row, Card } from "react-bootstrap";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function MatchHistoryCard({ MatchupResult }) {

        const RenderTeamImage = (t) => {
                const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
                return (t?.teamLogoPath != null ? <Image height={70} width={70} alt={t?.teamName} title={t?.teamName} src={imagePath} className="MhTeamImg" draggable={false}></Image> :
                        <Img webp width={70} height={70} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Img>);
        };

        const ReadableDate = (date) => {
                const d = new Date(date);
                return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
            };

        return (<>
                <Card className="text-center mb-2">
                <Card.Header>Last game completed at {ReadableDate(MatchupResult?.datePlayed)}{MatchupResult?.homeTeamScore > 1 ||  MatchupResult?.awayTeamScore > 1 ? "" : "(Matchup in progress)"}</Card.Header>
                     <Card.Body>
                         <Container>
                                <Row>
                                    <Col md={5} className="p-0">
                                        <Row>
                                          <Col md={3} className="p-0">{RenderTeamImage(MatchupResult?.homeTeam)}</Col>
                                          <Col md={9} className="my-auto"><h3 className="">{MatchupResult?.homeTeam?.teamName}</h3></Col>
                                        </Row>
                                     </Col>
                                     <Col md={2} className="my-auto"><h2>{MatchupResult?.homeTeamScore} - {MatchupResult?.awayTeamScore}</h2></Col>
                                     <Col md={5} className="p-0">
                                         <Row>
                                            <Col md={9} className="my-auto"><h3 className="">{MatchupResult?.awayTeam?.teamName}</h3></Col>
                                            <Col md={3} className="p-0">{RenderTeamImage(MatchupResult?.awayTeam)}</Col>
                                         </Row>
                                    </Col>
                                </Row>
                                <Row>
                                      <Col className="mt-4 mt-md-0"><Button className="my-auto" variant="primary" href={`/matchhistory/${MatchupResult?.matchupID}`}>See match details</Button></Col>
                                </Row>
                          </Container>
                     </Card.Body>
                <Card.Footer className="text-muted"><p className="float-right m-0">Total match duration: {MatchupResult?.totalMatchDuration}</p></Card.Footer>
                </Card>
        </>);
}