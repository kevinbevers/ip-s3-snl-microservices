//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Image, } from "react-bootstrap";

export default function TeamCard(){

    return (
        <a href="/stats/team/2345" className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className="pb-0 pt-1">
          <Container>
            <Row className="">
              <Col md={10} className="p-0 mx-auto">
                <Row>
                  <Col md={2} className="p-0 align-items-left"><Image src="https://web2.hirez.com/esports/teams/ssg-70x70.png" className="MhTeamImg"></Image></Col>
                  <Col md={9} className="my-auto pt-2"><h3 className="text-center mb-0">Spacestation Gaming</h3>
                  <p>Godlike division</p>
                  </Col>
                  <Col></Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      </a>
    );
}