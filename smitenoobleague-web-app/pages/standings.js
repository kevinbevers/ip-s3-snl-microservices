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
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
//page imports
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
//import background component and the image for it
import FullBackground from '../src/components/FullBackground'
import BG from '../public/images/dark_bg.png'
import ScoreTable from 'src/components/ScoreTable';



export default function standings() {

  const [SelectedDivision, setSelectedDivision] = useState('Godlike division');

  const changeDivision = (evt) => {
    setSelectedDivision(evt.target.value);
    console.log(evt.target.value);
  }

  const [SelectedPeriod, setSelectedPeriod] = useState('Split 1 2020');

  const changePeriod = (evt) => {
    setSelectedPeriod(evt.target.value);
    console.log(evt.target.value);
  }



  return (
    <>
      <FullBackground src={BG} />
      <NavBar />
      <Container>
        <Row className="mt-4">
          <Col md={6} className="mx-auto">
            <Row>
          <Col md={6} className="mx-auto">
            <Form>
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivision}>
                  <option value="1">Godlike division</option>
                  <option value="2">Prime division</option>
                  <option value="3">Bronze division</option>
                  <option value="4">Sweat division</option>
                  <option value="5">Divine division</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6} className="mx-auto">
            <Form>
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Control as="select" custom onChange={changePeriod} value={SelectedPeriod}>
                  <option value="1">Split 1 2020</option>
                  <option value="2">Mini-split 1 2020</option>
                  <option value="3">Summer 2020 split</option>
                  <option value="4">Fall 2020 split</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
          </Row>
          </Col>
        </Row>
       <ScoreTable />
      </Container>
      <Footer />
    </>
  );
}