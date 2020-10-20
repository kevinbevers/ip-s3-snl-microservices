
//default react imports
import React, { useState } from 'react';
//bootstrap implements
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function LeaderboardStatCard(props){

    return (
<Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Kill</Card.Header>
                  <Row>
                    <Col className="pr-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">1.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">2.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">3.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">4.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">5.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">6.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">7.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">9.  playername</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">10. playername</p></ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col className="pl-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                        <ListGroup.Item className="p-1"><p className="LeaderboardStatText">999999999</p></ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                </Card>
    );
}