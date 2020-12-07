//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Image, } from "react-bootstrap";

export default function RecentTeams(props){

    return (
        <a href="/matchdetails/5234534" className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className={props.backgroundColor + " p-1"}>
          <Container>
            <Row className="">
                <Col md={2} xs={2} className="p-0 mx-auto my-auto"><h3 className="text-center my-auto RecentTeamTitle font-weight-bold">VS</h3></Col>
              <Col md={10} xs={10} className="p-0 mx-auto">
                <Row className="">
                  <Col md={12} xs={12} className="align-items-left d-flex">
                    <Image src="https://web2.hirez.com/esports/teams/ghost-70x70.png" className="RecentTeamLogo mr-2"></Image>
                    <h3 className="text-center my-auto RecentTeamTitle font-weight-bold">Ghost Gaming</h3>
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