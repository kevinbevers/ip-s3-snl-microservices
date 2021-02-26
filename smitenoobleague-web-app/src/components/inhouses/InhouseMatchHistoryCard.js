//default react imports
import React, { useState } from "react";
import Link from "next/link";
//bootstrap implements
import { Container, Col, Button, Row, Card } from "react-bootstrap";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function InhouseMatchHistoryCard({ MatchupResult }) {

        const ReadableDate = (date) => {
                const d = new Date(date);
                return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
            };

        return (<>
                <Card className="text-center mb-2">
                <Card.Header>game completed at {ReadableDate(MatchupResult?.datePlayed)}</Card.Header>
                     <Card.Body>
                         <Container>
                                <Row>
                                    <Col md={5} className="p-0">
                                        <Row>
                                          <Col md={3} className="p-0"><Img webp width={70} height={70} alt={"OrderLogo"} title={"Order Side"} src={require("public/images/order.png")} className="MhTeamImg" draggable={false}></Img></Col>
                                          <Col md={9} className="my-auto"><h3 className="font-weight-bold">{"Order"}</h3></Col>
                                        </Row>
                                        <Row>
                                        <Col md={3}></Col>
                                              <Col md={9}>
                                        <ul className="list-unstyled">
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                        </ul>
                                        </Col>
                                        </Row>
                                     </Col>
                                    <Col md={2} className="mt-4 mb-4"><h4 className="font-weight-bold">VS</h4></Col>
                                     <Col md={5} className="p-0">
                                         <Row>
                                            <Col md={9} className="my-auto"><h3 className="font-weight-bold">{"Chaos"}</h3></Col>
                                            <Col md={3} className="p-0"><Img webp width={70} height={70} alt={"ChaosLogo"} title={"Chaos Side"} src={require("public/images/chaos.png")} className="MhTeamImg" draggable={false}></Img></Col>
                                         </Row>
                                         <Row>
                                       
                                              <Col md={9}>
                                        <ul className="list-unstyled">
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                            <li>Player134234424324234324224</li>
                                        </ul>
                                        </Col>
                                        <Col md={3}></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                <Col className="mt-4 mt-md-0 p-0"><Button className="my-auto" variant="primary" href={`/matchhistory/${MatchupResult?.matchupID}`}>See match details</Button></Col>
                                </Row>
                          </Container>
                     </Card.Body>
                <Card.Footer className="text-muted"><p className="float-right m-0">match duration: {MatchupResult?.totalMatchDuration}</p></Card.Footer>
                </Card>
        </>);
}