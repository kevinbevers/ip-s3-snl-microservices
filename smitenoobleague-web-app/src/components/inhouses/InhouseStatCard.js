
//default react imports
import React, { useState } from "react";
import Link from "next/link";
//bootstrap implements
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

export default function InhouseStatCard({Stat, Title, Percentage}){

    return (
<Card className="mt-2 mb-2 mx-auto LeaderboardCard">
    <Card.Header className="text-center LeaderBoardTitleText font-weight-bold">{Title}</Card.Header>
    {Stat?.length > 0 ? <>
                  <Row>
                    <Col md={8} xs={8} className="pr-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText1"><b>&#8205; 1.</b>  {Stat[0]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText2"><b>&#8205; 2.</b>  {Stat[1]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText3"><b>&#8205; 3.</b>  {Stat[2]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText4"><b>&#8205; 4.</b>  {Stat[3]?.player?.playername}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText"><b>&#8205; 5.</b>  {Stat[4]?.player?.playername}</p></ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={4} xs={4} className="pl-0 text-right">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText1 pr-2">{Stat[0]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText2 pr-2">{Stat[1]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText3 pr-2">{Stat[2]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText4 pr-2">{Stat[3]?.score}{Percentage}</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText pr-2">{Stat[4]?.score}{Percentage}</p></ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                  </> : <> No Data </> }
                </Card>
    );
}