//default page stuff
import NavBar from 'src/components/NavBar';
import Footer from 'src/components/Footer';
//bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Container, Card, Image, FormControl, InputGroup } from 'react-bootstrap';
import TeamCard from 'src/components/TeamCard';


export default function team() {
  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Row>
          <Col></Col>
          <Col md={4} className="d-flex justify-content-center">
            <FormControl
              className="searchinput"
              placeholder="Search team..."
              aria-label="Search teams"
              aria-describedby="Search"
            />
          </Col>
          <Col></Col>
        </Row>
        <Row className="mt-4">
          <Col md={6 } className="mx-auto">
            {/*Team cards */}
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}