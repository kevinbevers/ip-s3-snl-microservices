
//default react imports
import React, { useState } from "react";
import Link from "next/link";
//bootstrap implements
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

export default function InhouseLeaderboardStatCard({Stat, Title, Percentage}){

    return (
<Card className="mt-2 mb-2 mx-auto LeaderboardCard">
    <Card.Header className="text-center LeaderBoardTitleText font-weight-bold">{Title}</Card.Header>
    {Stat?.length > 0 ? <>
                  <Row>
                    <Col md={7} xs={7} className="pr-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 1.</b> {Stat[0]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 2.</b> {Stat[1]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 3.</b> {Stat[2]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 4.</b> {Stat[3]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 5.</b> {Stat[4]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 6.</b> {Stat[5]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 7.</b> {Stat[6]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 8.</b> {Stat[7]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 9.</b> {Stat[8]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>10.</b> {Stat[9]?.player?.playername}</p></ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={5} xs={5} className="pl-0 text-right">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[0]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[1]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[2]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[3]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[4]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[5]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[6]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[7]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[8]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[9]?.score}{Percentage}</p></ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                  </> : <> No Data </> }
                </Card>
    );
}