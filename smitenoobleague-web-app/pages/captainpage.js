//default react imports
import React, { useState, useEffect } from "react";
import Router from "next/router";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
import DefaultErrorPage from "next/error";
//bootstrap components
import { Container, Row, Col, Form, Card, Button, Image, Badge } from "react-bootstrap";
//custom imports
import { FaEdit, FaCheck, FaBan } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//importing images
import Jungle from "public/images/roles/Jungle_Logo.png";
import Solo from "public/images/roles/Solo_Logo.png";
import Support from "public/images/roles/Support_Logo.png";
import Mid from "public/images/roles/Mid_Logo.png";
import Adc from "public/images/roles/Adc_Logo.png";
import TeamBadge from "public/images/teamBadge.png"
//Auth
import helpers from "utils/helpers";

export default function captainpage({ LoginSession, apiResponse, status, errMsg }) {

  const [matchID, setMatchID] = useState();

  const handleChange = (event) => {
    setMatchID(event.target.value);
  };

  const handleSubmit = (event) => {
    Router.push("/matchdetails/" + matchID);
  };

  const [teamMembers, setTeamMembers] = useState([]);

  //Get every team member for each role. to make sure they are on the correct position if less then 5 members get returned
  useEffect(() => {
    const team = [];
    team.push(apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 1)[0]); //SOLO
    team.push(apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 2)[0]); //JUNGLE
    team.push(apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 3)[0]); //MID
    team.push(apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 4)[0]); //SUPPORT
    team.push(apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 5)[0]); //ADC

    setTeamMembers(team);
  }, []);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    console.log(result);

    const items = Array.from(teamMembers);
    items[result.source.index] = teamMembers[result.destination.index];
    items[result.destination.index] = teamMembers[result.source.index];

    console.log(items);

    setTeamMembers(items);
  }

  function getStyle(style, snapshot) {
    if (!snapshot.isDragging) return {};
    if (!snapshot.isDropAnimating) {
      return style;
    }

    return {
      ...style,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`
    };
  }



  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} /></>);
  }
  else {

    return (
      <>
        <NavBar LoginSession={LoginSession} />
        <Container fluid>
          <Row className="mt-4 mb-4"><Col className="text-center"><h1 className="font-weight-bold">CAPTAINPAGE</h1></Col></Row>
          <Row>
            <Col xl={1}></Col>
            <Col md={5} xl={4}>
              <Row className="mb-2">
                <Col className="rounded">
                  <Card className="bg-light">
                    <Card.Body className="">
                      <h2 className="font-weight-bold">SUBMIT MATCH</h2>
                      <Form.Group className="">
                        <Form.Control type="text" placeholder="Match ID..." className="mb-2" onChange={handleChange} />
                        <Button variant="primary" size="lg" block onClick={handleSubmit}>Submit</Button>
                      </Form.Group>

                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Card className="bg-light">
                    <Card.Body className="h-100">
                      <Container fluid>
                        <Row><Col className="pl-0"><h2 className="font-weight-bold">TEAM INFO</h2></Col></Row>
                        <Row className="mb-4">
                          <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Name:</h5></Col>
                          <Col md={7} xs={7} className="my-auto p-0">
                            <Form.Group className="my-auto">
                              <Form.Control type="text" value={apiResponse != null ? apiResponse.teamName : "Api Unavailable"} placeholder={"Teamname..."} className="TeamInfoText" disabled />
                            </Form.Group>
                          </Col>
                          <Col className="my-auto p-0 ml-2">
                            <a href="" className="TeamInfoIcon my-auto"><FaEdit /></a>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Logo:</h5></Col>
                          <Col md={7} xs={7} className="my-auto p-0"><Image src={TeamBadge} className="MainTeamImage"></Image></Col>
                          <Col className="my-auto p-0 ml-2">
                            <a href="" className="TeamInfoIcon my-auto"><FaEdit /></a>
                          </Col>
                        </Row>

                      </Container>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={7} xl={6} className="mb-2">
              <Card className="bg-light w-100 h-100">
                <Card.Body className="">
                  <Container>
                    <Row><Col><h2 className="font-weight-bold">MANAGE TEAM</h2></Col></Row>
                    <Row>
                      <Col md={1} xs={2}>
                        <Row className="mb-2">
                          <Image src={Solo} className="PlayerRole my-auto"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Jungle} className="PlayerRole my-auto"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Mid} className="PlayerRole my-auto"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Support} className="PlayerRole my-auto"></Image>
                        </Row>
                        <Row className="mb-2">
                          <Image src={Adc} className="PlayerRole my-auto"></Image>
                        </Row>
                      </Col>
                      <Col md={1} xs={0} className="d-none d-sm-none d-md-block"></Col>
                      <Col md={10} xs={10}>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                          <Droppable droppableId="teammembers">
                            {(provided, snapshot) => (<div {...provided.droppableProps} ref={provided.innerRef}>

                              <Draggable key={0} draggableId={"Solo"} index={0}>
                                {(provided, snapshot) => (
                                  <Row className="mb-2 rounded bg-white border border-silver PlayerRole" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getStyle(provided.draggableProps.style, snapshot)}>
                                    <Col md={10} xs={10} className="d-flex p-0">
                                      <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{teamMembers[0] != null ? teamMembers[0].teamMemberName : "This role is still empty"} {teamMembers[0] != null && teamMembers[0].teamCaptain == true ? <Badge variant="secondary">Captain</Badge> : <></>}</h4>
                                    </Col>
                                    <Col xs={2} className="my-auto p-0 pr-2">{teamMembers[0] != null ? <Button variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
                                  </Row>
                                )}</Draggable>

                              <Draggable key={1} draggableId={"Jungle"} index={1}>
                                {(provided, snapshot) => (
                                  <Row className="mb-2 rounded bg-white border border-silver PlayerRole" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getStyle(provided.draggableProps.style, snapshot)}>
                                    <Col md={10} xs={10} className="d-flex p-0">
                                      <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{teamMembers[1] != null ? teamMembers[1].teamMemberName : "This role is still empty"} {teamMembers[1] != null && teamMembers[1].teamCaptain == true ? <Badge variant="secondary">Captain</Badge> : <></>}</h4></Col>
                                    <Col xs={2} className="my-auto p-0 pr-2">{teamMembers[1] != null ? <Button variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
                                  </Row>
                                )}</Draggable>

                              <Draggable key={2} draggableId={"Mid"} index={2}>
                                {(provided, snapshot) => (
                                  <Row className="mb-2 rounded bg-white border border-silver PlayerRole" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getStyle(provided.draggableProps.style, snapshot)}>
                                    <Col md={10} xs={10} className="d-flex p-0">
                                      <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{teamMembers[2] != null ? teamMembers[2].teamMemberName : "This role is still empty"} {teamMembers[2] != null && teamMembers[2].teamCaptain == true ? <Badge variant="secondary">Captain</Badge> : <></>}</h4></Col>
                                    <Col xs={2} className="my-auto p-0 pr-2">{teamMembers[2] != null ? <Button variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
                                  </Row>
                                )}</Draggable>

                              <Draggable key={3} draggableId={"Support"} index={3}>
                                {(provided, snapshot) => (
                                  <Row className="mb-2 rounded bg-white border border-silver PlayerRole" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getStyle(provided.draggableProps.style, snapshot)}>
                                    <Col md={10} xs={10} className="d-flex p-0">
                                      <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{teamMembers[3] != null ? teamMembers[3].teamMemberName : "This role is still empty"} {teamMembers[3] != null && teamMembers[3].teamCaptain == true ? <Badge variant="secondary">Captain</Badge> : <></>}</h4></Col>
                                    <Col xs={2} className="my-auto p-0 pr-2">{teamMembers[3] != null ? <Button variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
                                  </Row>
                                )}</Draggable>

                              <Draggable key={4} draggableId={"Adc"} index={4}>
                                {(provided, snapshot) => (
                                  <Row className="mb-2 rounded bg-white border border-silver PlayerRole" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getStyle(provided.draggableProps.style, snapshot)}>
                                    <Col md={10} xs={10} className="d-flex p-0">
                                      <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{teamMembers[4] != null ? teamMembers[4].teamMemberName : "This role is still empty"} {teamMembers[4] != null && teamMembers[4].teamCaptain == true ? <Badge variant="secondary">Captain</Badge> : <></>}</h4></Col>
                                    <Col xs={2} className="my-auto p-0 pr-2">{teamMembers[4] != null ? <Button variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
                                  </Row>
                                )}</Draggable>


                              {/* <span style={{ display: "none" }}> */}
                                {provided.placeholder}
                              {/* </span> */}
                            </div>)}
                          </Droppable>
                        </DragDropContext>
                      </Col>
                    </Row>







                    {/* Maybe have an info alert here. with info about the page */}
                  </Container>


                </Card.Body>
              </Card>
            </Col>
            <Col xl={1}></Col>
          </Row>
        </Container>
        <Footer />
      </>
    );
  }
}

export async function getServerSideProps({ req, params, res }) {

  const loginSessionData = await helpers.GetLoginSession(req);

  if (loginSessionData.user != null) {
    const httpClient = await helpers.GetSecureApi(req, res);
    let response = { data: null, statusCode: null, errMsg: null };
    await httpClient.get("team-service/team/bycaptainid/" + loginSessionData.user.sub)
      .then(res => {
        response.data = res.data;
      })
      .catch(err => {
        if (err.response == null) {
          response.statusCode = 503;
          response.errMsg = "SNL API unavailable";
        }
        else {
          response.statusCode = JSON.stringify(err?.response?.status);
          response.errMsg = err?.response?.data;
        }

      });

    return {
      props: {
        LoginSession: loginSessionData,
        apiResponse: response.data,
        status: response.statusCode,
        errMsg: response.errMsg
      }
    }
  }
  else {
    res.statusCode = 302
    res.setHeader('Location', `/api/login`) // redirect to login page
  }

  return {
    props: {
      LoginSession: loginSessionData
    },
  };
}