//default react imports
import React, { useState } from "react";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Card, Image } from "react-bootstrap";

export default function ScheduleItem() {
    return (
        <Card className="text-center mb-2">
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={3} className="p-0"><Image src="https://web2.hirez.com/esports/teams/ssg-70x70.png" className="MhTeamImg" draggable={false}></Image></Col>
                                <Col md={9} className="my-auto"><h3 className="">Spacestation Gaming</h3></Col>
                            </Row>
                        </Col>
                        <Col md={2} className="my-auto"><h2>VS</h2></Col>
                        <Col md={5} className="p-0">
                            <Row>
                                <Col md={9} className="my-auto"><h3 className="">Ghost Gaming</h3></Col>
                                <Col md={3} className="p-0"><Image src="https://web2.hirez.com/esports/teams/ghost-70x70.png" className="MhTeamImg" draggable={false}></Image></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Card.Text>
                        Not played yet
</Card.Text>
                </Container>
            </Card.Body>

        </Card>
    );
}