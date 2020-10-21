//default react imports
import React, { useState } from 'react';
//bootstrap implements
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Container, Image } from 'react-bootstrap';

export default function MatchHistoryCard(props){

    return (
            <Card className="text-center mb-2">
            <Card.Header>Played at 11 october 2020</Card.Header>
            <Card.Body>
            <Container>
            <Row>
            <Col md={5} className="p-0">
            <Row>
            <Col md={3} className="p-0"><Image src="https://web2.hirez.com/esports/teams/ssg-70x70.png" className="MhTeamImg"></Image></Col>
    <Col md={9} className="my-auto"><h3>{props.team1_name}</h3></Col>
            </Row>
            </Col>
            <Col md={2} className="my-auto"><h2>{props.total_score}</h2></Col>
            <Col md={5} className="p-0">
            <Row>    
            <Col md={9} className="my-auto"><h3>{props.team2_name}</h3></Col>
            <Col md={3} className="p-0"><Image src="http://via.placeholder.com/70x70" className="MhTeamImg"></Image></Col> 
            </Row>
            </Col>
            </Row>
            <Row>
            <Col className="mt-4 mt-md-0">
            <Button className="my-auto" variant="primary" href={`/matchdetails/${props.matchID}`}>See match details</Button>
            </Col>
            </Row>
            </Container>
            </Card.Body>
            <Card.Footer className="text-muted"><p className="float-right m-0">Total match duration: 80 min 32 seconds</p></Card.Footer>
            </Card>
    );
}