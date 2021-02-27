//default react imports
import React, { useState } from "react";
import Link from "next/link";
//bootstrap implements
import { Container, Col, Button, Row, Card, Modal } from "react-bootstrap";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";
//icons
import {FaPlaystation, FaXbox, FaSteam, FaTrashAlt} from "react-icons/fa";
import {RiSwitchFill} from "react-icons/ri";
import {GiPc} from "react-icons/gi";
import {SiEpicgames} from "react-icons/si";
//API
import inhouseservice from "services/inhouseservice";

export default function InhouseMatchHistoryCard({ MatchupResult, adminManage, removeMatchFunc, apiToken }) {

    const [ModalAreYouSure, setModalAreYouSure] = useState(false);
    const deleteMatch = async() => {
        await inhouseservice.DeleteMatchByGameID(apiToken, MatchupResult.gameID).then(res => {removeMatchFunc(MatchupResult.gameID); setModalAreYouSure(false);}).catch(err => {console.log(err)});
    };


        const ReadableDate = (date) => {
                const d = new Date(date);
                return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
            };

        const PlayerPlatform = (p) => {
            return (p?.platform == "PS4" &&
                        <FaPlaystation />)
                    || (p?.platform  == "Steam" &&
                        <FaSteam />)
                    || (p?.platform  == "Xbox" &&
                        <FaXbox />)
                    || (p?.platform == "HiRez" &&
                        <GiPc />)
                    || (p?.platform == "Switch" &&
                        <RiSwitchFill />)
                    || (p?.platform  == "Epic_Games" && 
                        <SiEpicgames />)
                    ||
                    
                    member.teamMemberPlatform;
        };

        return (<>
                <Card className="text-center mb-2">
                <Card.Header>game completed at {ReadableDate(MatchupResult?.datePlayed)}</Card.Header>
                     <Card.Body className={`${MatchupResult?.homeWin ? "homeWin" : "awayWin"} border-danger`}>
                         <Container>
                                <Row>
                                    <Col md={5} className="p-0">
                                        <Row>
                                          <Col md={3} className="p-0"><Img webp width={70} height={70} alt={"OrderLogo"} title={"Order Side"} src={require("public/images/order.png")} className="MhTeamImg mb-1" draggable={false}></Img></Col>
                                          <Col md={9} className="my-auto"><h3 className="font-weight-bold mb-1">{"Order"}</h3></Col>
                                        </Row>
                                        <Row>
                                        <Col md={3} xs={3}></Col>
                                              <Col md={6} xs={6}>
                                        <ul className="list-unstyled text-md-left text-lg-left text-xl-left text-left matchPlayers mb-0">
                                            <li>{PlayerPlatform(MatchupResult?.orderPlayers[0])} {MatchupResult?.orderPlayers[0]?.playername}</li>
                                            <li>{PlayerPlatform(MatchupResult?.orderPlayers[1])} {MatchupResult?.orderPlayers[1]?.playername}</li>
                                            <li>{PlayerPlatform(MatchupResult?.orderPlayers[2])} {MatchupResult?.orderPlayers[2]?.playername}</li>
                                            <li>{PlayerPlatform(MatchupResult?.orderPlayers[3])} {MatchupResult?.orderPlayers[3]?.playername}</li>
                                            <li>{PlayerPlatform(MatchupResult?.orderPlayers[4])} {MatchupResult?.orderPlayers[4]?.playername}</li>
                                        </ul>
                                        </Col>
                                        <Col md={3} xs={3}></Col>
                                        </Row>
                                     </Col>
                                    <Col md={2} className="mt-1 mb-1"><Row><Col className="my-auto"><h1 className="font-weight-bold mb-0">VS</h1></Col></Row></Col>
                                     <Col md={5} className="p-0">
                                         <Row>
                                            <Col md={9} className="my-auto"><h3 className="font-weight-bold mb-1">{"Chaos"}</h3></Col>
                                            <Col md={3} className="p-0"><Img webp width={70} height={70} alt={"ChaosLogo"} title={"Chaos Side"} src={require("public/images/chaos.png")} className="MhTeamImg mb-1" draggable={false}></Img></Col>
                                         </Row>
                                         <Row>
                                         <Col md={3} xs={3}></Col>
                                              <Col md={6} xs={6}>
                                        <ul className="list-unstyled text-md-right text-lg-right text-xl-right text-right matchPlayers mb-0">
                                            <li>{MatchupResult?.chaosPlayers[0]?.playername} {PlayerPlatform(MatchupResult?.chaosPlayers[0])}</li>
                                            <li>{MatchupResult?.chaosPlayers[1]?.playername} {PlayerPlatform(MatchupResult?.chaosPlayers[1])}</li>
                                            <li>{MatchupResult?.chaosPlayers[2]?.playername} {PlayerPlatform(MatchupResult?.chaosPlayers[2])}</li>
                                            <li>{MatchupResult?.chaosPlayers[3]?.playername} {PlayerPlatform(MatchupResult?.chaosPlayers[3])}</li>
                                            <li>{MatchupResult?.chaosPlayers[4]?.playername} {PlayerPlatform(MatchupResult?.chaosPlayers[4])}</li>
                                        </ul>
                                        </Col>
                                        <Col md={3} xs={3}></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                <Col className="mt-md-0 p-0"><Button className="my-auto" variant="primary" href={`/inhouses/matchhistory/${MatchupResult?.gameID}`}>See match details</Button></Col>
                                </Row>
                          </Container>
                     </Card.Body>
                <Card.Footer className="text-muted"> {adminManage ? <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable float-left" title="Delete matchdata" onClick={() => setModalAreYouSure(true)} /> : <> </>}<p className="float-right m-0">match duration: {MatchupResult?.totalMatchDuration}</p></Card.Footer>
                </Card>

                <Modal
            show={ModalAreYouSure}
            onHide={() => setModalAreYouSure(false)}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h6 className="font-weight-bold">Are you sure you want to delete this match?</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
              <Row>
                  <Col className="justify-content-end d-flex p-auto">
                      <Button variant="primary" className="mr-2 font-weight-bold" onClick={() => setModalAreYouSure(false)}>
                          Cancel
                      </Button>

                      <Button className="font-weight-bold" onClick={deleteMatch} variant="danger">
                          Delete Match
                      </Button>
                  </Col>
              </Row>
              </Modal.Body>
            </Modal>
        </>);
}