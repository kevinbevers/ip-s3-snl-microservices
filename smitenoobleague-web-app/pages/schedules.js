//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Card, Image, Form } from "react-bootstrap";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";
//custom components
import ScheduleItem from "src/components/ScheduleItem";
//Auth
import helpers from "utils/helpers";

export default function schedules({LoginSession}) {


  const [SelectedDivision, setSelectedDivision] = useState({id: 1, name: "Godlike division"});

  const changeDivision = (evt) => {
    var id = evt.target.value;
    // - 1 array index always starts at 0
    var name = evt.target[id - 1].text;
    setSelectedDivision({id: id, name: name});
    console.log(SelectedDivision);
  }

  const [count, setCount] = useState(0);

  const components = [
    <><div>Week 1 date</div><ScheduleItem /><ScheduleItem /><ScheduleItem /><ScheduleItem /></>,
    <><div>Week 2 date</div><ScheduleItem /><ScheduleItem /><ScheduleItem /><ScheduleItem /></>,
    <><div>Week 3 date</div><ScheduleItem /><ScheduleItem /><ScheduleItem /><ScheduleItem /></>,
    <><div>Week 4 date</div><ScheduleItem /><ScheduleItem /><ScheduleItem /><ScheduleItem /></>,
  ];


  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <Container fluid>
        <Row className="mt-4">
        <Col md={3} className="mx-auto">
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
        </Row>
        <Row>
          <Col md={3}></Col>
          <Col md={6} className="d-inline-flex justify-content-center">
            {/* show previous button if we are not on first element */}
            {count > 0 && <Button variant="primary" onClick={() => setCount(count - 1)}>prev</Button> || <Button variant="primary" disabled onClick={() => setCount(count - 1)}>prev</Button>}
            <h4 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">Schedule Week {count + 1}</h4>
            {/* hide next button if we are at the last element */}
            {count < components.length - 1 && <Button variant="primary" onClick={() => setCount(count + 1)}>next</Button> || <Button variant="primary" disabled onClick={() => setCount(count + 1)}>next</Button>}
          </Col>
          <Col md={3}></Col>
        </Row>
        <Row className="mt-2">
          <Col md={1} xl={2}></Col>
          <Col md={10} xl={8} className="text-center">
            {
              // render component from our components array
              components[count]
            }
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
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