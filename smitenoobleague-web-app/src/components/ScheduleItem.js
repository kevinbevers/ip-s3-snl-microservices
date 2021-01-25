//default react imports
import React, { useState } from "react";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Card } from "react-bootstrap";
import Link from "next/link";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function ScheduleItem({homeTeam, awayTeam, matchupID, byeWeek, score}) {

    const RenderTeamImage = (t) => {
        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return (t?.teamLogoPath != null ? <Image height={70} width={70} alt={t?.teamName} title={t?.teamName} src={imagePath} className="MhTeamImg" draggable={false}></Image> :
                <Img webp width={70} height={70} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Img>);
};

    return (
        <Card className="text-center mb-2">
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={3} className="p-0">
                                    {RenderTeamImage(homeTeam)}
                                </Col>
                                <Col md={9} className="my-auto"><h3 className="">{homeTeam?.teamName != null ? homeTeam?.teamName : "No opponent this week"}</h3></Col>
                            </Row>
                        </Col>
                        <Col md={2} className="my-auto"><h2>VS</h2></Col>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={9} className="my-auto"><h3 className="">{awayTeam?.teamName != null ? awayTeam?.teamName : "No opponent this week"}</h3></Col>
                                <Col md={3} className="p-0">
                                    {RenderTeamImage(awayTeam)}
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