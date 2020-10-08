//default page stuff
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';
//boostrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function leaderboards() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
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
              </Col>

              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Assists</Card.Header>
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
              </Col>

              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Damage dealt</Card.Header>
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
              </Col>

              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Damage mitigated</Card.Header>
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
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Pie chart of total damage dealt */}
            <Row>
              <Col md={12} className="text-center"><h3>Pie chart of damage</h3></Col>
            </Row>
            <div className='border border-dark mr-1 piechart  mx-auto rounded-circle'></div>

          </Col>
        </Row>

        {/* Second row of stats */}
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Kill participation</Card.Header>
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
              </Col>

              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Deaths</Card.Header>
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
              </Col>

              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Damage taken</Card.Header>
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
              </Col>

              <Col md={3}>
                <Card className="mt-2 mb-2 mx-auto LeaderboardCard">
                  <Card.Header className="text-center LeaderBoardTitleText">Healing</Card.Header>
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
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Line Chart of stats */}
            <Row>
              <Col md={12} className="text-center"><h3>Chart of stats</h3></Col>
            </Row>
            <Row className="h-75">
              <div className='border border-dark mr-1 w-100'></div>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}