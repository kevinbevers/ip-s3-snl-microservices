//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Image, } from "react-bootstrap";

export default function PlayerCard(){

    return (
        <a href="/stats/player/343532" className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className="p-1">
          <Container>
            <Row className="">
              <Col md={12} className="p-0 mx-auto">
                <Row>
                  <Col md={2} className="p-0 align-items-left"><Image src="/images/roles/Jungle_Logo.png" className="MhTeamImg"></Image></Col>
                  <Col md={5} className="my-auto pl-0 pr-0"><h3 className="text-center mb-0">lolliepoep</h3>
                  </Col>
                  <Col md={5} className="pl-0 my-auto d-flex justify-content-center">
                  <Image src="https://web2.hirez.com/esports/teams/ssg-70x70.png" className="SmallTeamImage"></Image><h6 className="ml-2 my-auto">Spacestation Gaming</h6>
                      </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      </a>
    );
}