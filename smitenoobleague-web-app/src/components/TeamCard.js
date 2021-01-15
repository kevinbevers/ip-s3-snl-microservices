//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Image, } from "react-bootstrap";
import Link from "next/link";

export default function TeamCard({Team}){

    return (
        <Link href="/stats/team/2345">
          <a className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className="pb-0 pt-1">
          <Container>
            <Row className="">
              <Col md={10} className="p-0 mx-auto">
                <Row>
                  <Col md={2} className="p-0 align-items-left"><Image src={Team?.teamLogoPath != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/" + Team?.teamLogoPath : require("public/images/teamBadge.png")} className="MhTeamImg" draggable={false}></Image></Col>
                  <Col md={8} className="my-auto pt-2"><h3 className="text-center mb-0">{Team?.teamName}</h3>
                  <p className="text-muted smallfootertext">Click to see team stats</p>
                  </Col>
                  <Col></Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      </a>
      </Link>
    );
}