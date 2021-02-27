//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import Link from "next/link";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function TeamCard({Team}){

  const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + Team?.teamLogoPath;

    return (
        <Link href={"/stats/team/" + Team?.teamID}>
          <a className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className="pb-0 pt-1">
          <Container>
            <Row className="">
              <Col md={10} className="p-0 mx-auto">
                <Row>
                  <Col md={2} className="p-0 align-items-left">
                    {Team?.teamLogoPath != null ?
                    <Image priority={true} height={70} width={70} alt={Team?.teamName} src={imagePath} draggable={false}></Image>
                    : <Img src={require("public/images/teamBadge.png")} alt={Team?.teamName} className="MhTeamImg" draggable={false}></Img>
                    }
                  </Col>
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