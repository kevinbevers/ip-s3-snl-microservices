//default react imports
import React, { useState } from "react";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Card, Image } from "react-bootstrap";
import Link from "next/link";

export default function ScheduleItem({homeTeam, awayTeam, matchupID, byeWeek, score}) {

    const homeTeamImagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + homeTeam?.teamLogoPath;
    const awayTeamImagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + awayTeam?.teamLogoPath;

    return (
        <Card className="text-center mb-2">
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={3} className="p-0">
                                {homeTeam?.teamLogoPath != null ?
                                        <Image height={70} width={70} alt={homeTeam?.teamName} src={homeTeamImagePath} draggable={false}></Image>
                                        : <Img src={require("public/images/teamBadge.png")} alt={homeTeam?.teamName} className="MhTeamImg" draggable={false}></Img>
                                        }
                                    </Col>
                                <Col md={9} className="my-auto"><h3 className="">{homeTeam?.teamName != null ? homeTeam?.teamName : "No opponent this week"}</h3></Col>
                            </Row>
                        </Col>
                        <Col md={2} className="my-auto"><h2>VS</h2></Col>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={9} className="my-auto"><h3 className="">{awayTeam?.teamName != null ? awayTeam?.teamName : "No opponent this week"}</h3></Col>
                                <Col md={3} className="p-0">
                                {awayTeam?.teamLogoPath != null ?
                                        <Image height={70} width={70} alt={awayTeam?.teamName} src={awayTeamImagePath} draggable={false}></Image>
                                        : <Img src={require("public/images/teamBadge.png")} alt={awayTeam?.teamName} className="MhTeamImg" draggable={false}></Img>
                                        }
                                </Col>
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