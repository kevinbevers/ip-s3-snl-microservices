//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Card, Image, FormControl, InputGroup } from "react-bootstrap";
import TeamCard from "src/components/TeamCard";
//Auth
import helpers from "utils/helpers";

export default function team({LoginSession}) {
  return (
    <>
      <NavBar LoginSession={LoginSession}/>
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
          <Col md={10} xl={6} className="mx-auto">
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

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  return {
      props: {
          LoginSession: loginSessionData
      },
  };
}