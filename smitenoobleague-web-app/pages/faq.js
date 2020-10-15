//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';

//boostrap components
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//page components
import GeneralQuestions from 'src/components/faqpage/GeneralQuestions';
import TeamQuestions from 'src/components/faqpage/teamquestions';
import PlayerQuestions from 'src/components/faqpage/PlayerQuestions';
import CaptainQuestions from 'src/components/faqpage/CaptainQuestions';
import DivisionQuestions from 'src/components/faqpage/DivisionQuestions';




export default function faq() {
  return (
    <>
      <NavBar />
      <Jumbotron className="faq-banner">
        <h2 className="display-5 m-0 text-uppercase font-weight-bold">FREQUENTLY ASKED QUESTIONS</h2>
      </Jumbotron>
      <Container>
      <Row className="mb-3">
          <Col><GeneralQuestions /></Col>
        </Row>
        <Row className="mb-3">
          <Col><TeamQuestions /></Col>
        </Row>
        <Row className="mb-3">
          <Col><PlayerQuestions /></Col>
        </Row>
        <Row className="mb-3">
          <Col><CaptainQuestions /></Col>
        </Row>
        <Row className="mb-3">
          <Col className="mb-4"><DivisionQuestions /></Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}