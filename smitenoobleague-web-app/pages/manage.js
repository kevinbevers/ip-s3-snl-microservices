//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//bootstrap
import {Container, Row, Col, Card, Button} from "react-bootstrap";
//import background component
import FullBackground from "../src/components/FullBackground";
//Auth
import helpers from "utils/helpers";

export default function Manage({LoginSession}) {

  return (
    <>
    <FullBackground src={"roadmap_bg"} />
    <Container className="mb-2 mt-2" fluid>
        <Row className="">
            <Col md={6} className="mb-3">
                <Card>
                    <Card.Body>
                        <Card.Title><h2 className="font-weight-bolder">Manage teams</h2></Card.Title>
                        <Card.Text>Manage existing teams or create a new team.</Card.Text>
                        <Row>
                            <Col md={6} className="mb-2">
                                <Button variant={"primary"} size={"lg"} className="btn-block">Create new team</Button>
                            </Col>
                            <Col md={6} className="mb-2">
                            <Button variant={"primary"} size={"lg"} className="btn-block">Manage existing teams</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6} className="mb-3">
                <Card>
                    <Card.Body>
                        <Card.Title><h2 className="font-weight-bolder">Manage divisions</h2></Card.Title>
                        <Card.Text>Manage existing division or create a new one.</Card.Text>
                        <Row>
                            <Col md={6} className="mb-2">
                                <Button variant={"primary"} size={"lg"} className="btn-block">Create new division</Button>
                            </Col>
                            <Col md={6} className="mb-2">
                            <Button variant={"primary"} size={"lg"} className="btn-block">Manage exisiting divisions</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        <Row className="">
            <Col md={6}>
                <Row>
                    <Col md={12} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title><h2 className="font-weight-bolder">Manage schedules</h2></Card.Title>
                                <Card.Text>Generate, edit or delete a schedule. Each schedule is linked to a division.</Card.Text>
                                <Row>
                                    <Col md={6} className="mb-2">
                                        <Button variant={"primary"} size={"lg"} className="btn-block">Generate new schedule</Button>
                                    </Col>
                                    <Col md={6} className="mb-2">
                                    <Button variant={"primary"} size={"lg"} className="btn-block">Manage exisiting schedules</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title><h2 className="font-weight-bolder">Admin tools</h2></Card.Title>
                                <Card.Text>Enforce rules by removing score points from a team's standing, Add forfeit to a matchup</Card.Text>
                                <Row>
                                    <Col md={6} className="mb-2">
                                        <Button variant={"primary"} size={"lg"} className="btn-block">penalize team in standings</Button>
                                    </Col>
                                    <Col md={6} className="mb-2">
                                    <Button variant={"primary"} size={"lg"} className="btn-block">Enforce match forfeit</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                <Col md={12} className="mb-3">
                <Card>
                    <Card.Body>
                        <Card.Title><h2 className="font-weight-bolder">Manage news articles</h2></Card.Title>
                        <Card.Text>Add new articles or edit existing ones</Card.Text>
                        <Row>
                            <Col md={6} className="mb-2">
                                <Button variant={"primary"} size={"lg"} className="btn-block">Create new Article</Button>
                            </Col>
                            <Col md={6} className="mb-2">
                            <Button variant={"primary"} size={"lg"} className="btn-block">Manage existing Articles</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
                </Row>
            </Col>
            <Col md={6} className="">
                <Row className="h-100 ">
                    <Col md={12} className="mb-3">
                        <Card className="h-100 ">
                            <Card.Body className="">
                                <Card.Title><h2 className="font-weight-bolder">Admin log</h2></Card.Title>
                                <Card.Text>Important activities are logged and displayed here.</Card.Text>
                                <Row className="h-75">
                                    <Col md={12} className="mb-2 h-100">
                                        <div className="bg-dark text-light log pl-2 pt-1 pb-1">
                                            <p className="logmsg"><b className="logtime">02-02-2021 15:00</b> <b className="text-info logmsg">The Salty boys made a roster change:</b><br /> > Pandacat got swapped out for BarraCudda</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
    </>
  )
}

export async function getServerSideProps(context) {

  const loginSessionData = await helpers.GetLoginSession(context.req);

  return {
      props: {
          LoginSession: loginSessionData
      },
  };
}
