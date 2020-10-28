//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';
//bootstrap components
import {Container, Row, Col, Form, Card, Button, Image, Badge} from 'react-bootstrap';
//custom imports
import {FaEdit, FaCheck, FaBan} from 'react-icons/fa';

export default function captainpage() {
    return (
      <>      
        <NavBar />
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
                    <Form.Control type="text" placeholder="Match ID..." className="mb-2"/>
                    <Button variant="primary" size="lg" block>Submit</Button>
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
                            <Form.Control type="text" value="Spacestation Gaming" placeholder="Teamname." className="TeamInfoText" disabled/>
                          </Form.Group>
                          </Col>
                          <Col className="my-auto p-0 ml-2">
                            <a href="" className="TeamInfoIcon my-auto"><FaEdit /></a>
                          </Col>
                        </Row>
                        <Row>
                        <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Logo:</h5></Col>
                        <Col md={7} xs={7} className="my-auto p-0"><Image src="https://web2.hirez.com/smite-esports/dev/teams/SSG.png" className="MainTeamImage"></Image></Col>
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
                      <Row className="mb-2">
                        <Col md={9} xs={12} className="d-flex">
                          <Image src="images/roles/Solo_Logo.png" className="PlayerRole my-auto mr-2"></Image>
                          <h4 className="my-auto font-weight-bold p-2">lolliepoep <Badge variant="secondary">Captain</Badge></h4>
                          </Col>
                        <Col className="my-auto"><Button className="" variant="primary" size="lg" block>Edit</Button></Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={9} className="d-flex"><Image src="images/roles/Jungle_Logo.png" className="PlayerRole my-auto mr-2"></Image><h4 className="my-auto font-weight-bold p-2">lolliepoep</h4></Col><Col className="my-auto"><Button variant="primary" size="lg" block>Edit</Button></Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={9} className="d-flex"><Image src="images/roles/Mid_Logo.png" className="PlayerRole my-auto mr-2"></Image><h4 className="my-auto font-weight-bold p-2">lolliepoep</h4></Col><Col className="my-auto"><Button variant="primary" size="lg" block>Edit</Button></Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={9} className="d-flex"><Image src="images/roles/Support_Logo.png" className="PlayerRole my-auto mr-2"></Image><h4 className="my-auto font-weight-bold p-2">lolliepoep</h4></Col><Col className="my-auto"><Button variant="primary" size="lg" block>Edit</Button></Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={9} className="d-flex"><Image src="images/roles/Adc_Logo.png" className="PlayerRole my-auto mr-2"></Image><h4 className="my-auto font-weight-bold p-2">lolliepoep</h4></Col><Col className="my-auto"><Button variant="primary" size="lg" block>Edit</Button></Col>
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