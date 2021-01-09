//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//boostrap components
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
//page imports
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ScoreTable from "src/components/ScoreTable";
//import background component and the image for it
import FullBackground from "../src/components/FullBackground"
import BG from "../public/images/dark_bg.jpg?webp"
//Auth
import helpers from "utils/helpers";


export default function standings({LoginSession}) {

  const [SelectedDivision, setSelectedDivision] = useState({id: 1, name: "Godlike division"});

  const changeDivision = (evt) => {
    var id = evt.target.value;
    // - 1 array index always starts at 0
    var name = evt.target[id - 1].text;
    setSelectedDivision({id: id, name: name});
    console.log(SelectedDivision);
  }

  const [SelectedPeriod, setSelectedPeriod] = useState("Split 1 2020");

  const changePeriod = (evt) => {
    setSelectedPeriod(evt.target.value);
    console.log(evt.target.value);
  }



  return (
    <>
      <FullBackground src={BG} />
      <NavBar LoginSession={LoginSession}/>
      <Container>
        <Row className="mt-4">
          <Col md={6} className="mx-auto">
            <Row>
          <Col md={6} className="mx-auto">
            <Form>
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivision.id}>
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
       <ScoreTable title={SelectedDivision.name}/>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  return {
      props: {
          LoginSession: loginSessionData
      },
  };
}