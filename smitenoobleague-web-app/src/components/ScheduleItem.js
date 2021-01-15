//default react imports
import React, { useState } from "react";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Card, Image } from "react-bootstrap";
import Link from "next/link";

export default function ScheduleItem({homeTeam, awayTeam, matchupID, byeWeek, score}) {
    return (
        <Card className="text-center mb-2">
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={3} className="p-0"><Image src={homeTeam?.teamLogoPath != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/" + homeTeam?.teamLogoPath : require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Image></Col>
                                <Col md={9} className="my-auto"><h3 className="">{homeTeam?.teamName != null ? homeTeam?.teamName : "No opponent this week"}</h3></Col>
                            </Row>
                        </Col>
                        <Col md={2} className="my-auto"><h2>VS</h2></Col>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={9} className="my-auto"><h3 className="">{awayTeam?.teamName != null ? awayTeam?.teamName : "No opponent this week"}</h3></Col>
                                <Col md={3} className="p-0"><Image src={awayTeam?.teamLogoPath != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/" + awayTeam?.teamLogoPath : require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Image></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Card.Text>
                        {byeWeek ? "Bye week" 
                        : <>{score != null ? <Link href={"/matchhistory/" + matchupID}>{score}</Link> : "Not played yet"}  </>}
                       
                    </Card.Text>
                </Container>
            </Card.Body>

        </Card>
    );
}