//default react imports
import React, { useState } from "react";
//bootstrap implements
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Image, } from "react-bootstrap";
//icons
import {FaTimes, FaPlaystation, FaXbox, FaSteam} from "react-icons/fa";
import {RiSwitchFill} from "react-icons/ri";
import {GiPc} from "react-icons/gi";
import {SiEpicgames} from "react-icons/si";
//next link
import Link from "next/link";

export default function PlayerCard({Player,Team}){


    //Player.playerID for link

    return (
      <>
      <Link href={"/stats/player/" + Player?.playerID}>
        <a  className="link-unstyled">
        <Card className="text-center mb-2">
        <Card.Body className="p-1">
          <Container>
            <Row className="">
              <Col md={12} className="p-0 mx-auto">
                <Row>
                  <Col md={2} className="p-0 align-items-left"><Image alt={Player?.teamMemberRole?.roleName} src={require("public/images/roles/" + Player.teamMemberRole.roleName + "_Logo.png")} className="MhTeamImg" draggable={false}></Image></Col>
                  <Col md={6} className="my-auto pl-0 pr-0"><h3 className="text-md-left text-center mb-0">{(Player.teamMemberPlatform == "PS4" &&
                                                    <FaPlaystation />)
                                                || (Player?.teamMemberPlatform == "Steam" &&
                                                    <FaSteam />)
                                                || (Player.teamMemberPlatform == "Xbox" &&
                                                    <FaXbox />)
                                                || (Player.teamMemberPlatform == "HiRez" &&
                                                    <GiPc />)
                                                || (Player.teamMemberPlatform == "Switch" &&
                                                    <RiSwitchFill />)
                                                || (Player.teamMemberPlatform == "Epic_Games" && 
                                                    <SiEpicgames />)
                                                ||
                                                Player.teamMemberPlatform
                                                } {Player?.teamMemberName}</h3>
                  </Col>
                  <Col md={4} className="my-auto">
                    <Row className="">
                      <Col className="d-flex justify-content-center justify-content-md-start">
                        <Image alt={Team?.teamName} src={Team?.teamLogoPath != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/" + Team?.teamLogoPath : require("public/images/teamBadge.png")} className="SmallTeamImage" draggable={false}></Image><p className="ml-2 my-auto">{Team?.teamName}</p>
                    </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
      </a>
      </Link>
      </>
    );
}