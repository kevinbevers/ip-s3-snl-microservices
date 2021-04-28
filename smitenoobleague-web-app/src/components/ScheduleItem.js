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

    // custom loader, this one doesn't use server performance and just displays the image vanilla
    const imageLoader = ({ src, width, quality }) => {
        // return `${src}?w=${width}&q=${quality || 75}`
        return `${src}`;
        }

    const RenderTeamImage = (t) => {
        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        if(t == null)
        {
            return (<Img webp width={70} height={70} alt={t?.teamName} title={t?.teamName} src={require("public/images/byeweek.png")} className="MhTeamImg" draggable={false}></Img>);
        }
        else {
        return (t?.teamLogoPath != null ? <Image loader={imageLoader} loading={"eager"} width={70} height={70} alt={t?.teamName} title={t?.teamName} src={imagePath} className="MhTeamImg" draggable={false}></Image> :
                <Img webp width={70} height={70} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Img>);
        }
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
                                <Col md={9} className="my-auto"><h3 className="">{homeTeam?.teamName != null ? <Link href={`/stats/team/${homeTeam.teamID}`}><span className="Hoverable Clickable" title={"click to see team stats"}>{homeTeam?.teamName}</span></Link> : "No opponent this week"}</h3></Col>
                            </Row>
                        </Col>
                        <Col md={2} className="my-auto"><h2>VS</h2></Col>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={9} className="my-auto"><h3 className="">{awayTeam?.teamName != null ? <Link href={`/stats/team/${awayTeam.teamID}`}><span className="Hoverable Clickable" title={"click to see team stats"}>{awayTeam?.teamName}</span></Link> : "No opponent this week"}</h3></Col>
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