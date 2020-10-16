//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from 'src/components/NavBar';
import Footer from 'src/components/Footer';
//bootstrap implements
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';

export default function matchhistory() {
  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Card className="text-center mb-2">
          <Card.Header>Played at 11 october 2020</Card.Header>
          <Card.Body>
           <Row>
             <Col><h3>Teamname</h3></Col>
             <Col><h3>2 - 0</h3></Col>
             <Col><h3>Teamname</h3></Col>
           </Row>
            <Button variant="primary" href="/matchdetails/5234534">See match details</Button>
          </Card.Body>
          <Card.Footer className="text-muted"><p className="float-right m-0">Total match duration: 80 min 32 seconds</p></Card.Footer>
        </Card>
      </Container>
      <Footer />
    </>
  );
}