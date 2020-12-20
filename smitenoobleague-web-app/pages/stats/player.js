//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Card, Image, FormControl, InputGroup } from "react-bootstrap";
import PlayerCard from "src/components/PlayerCard";
//Auth
import helpers from "utils/helpers";

export default function player({LoginSession}) {
    return (
      <>      
        <NavBar LoginSession={LoginSession}/>
        <Container className="mt-4">
        <Row>
          <Col></Col>
          <Col md={4} className="d-flex justify-content-center">
            <FormControl
              className="searchinput"
              placeholder="Search player..."
              aria-label="Search players"
              aria-describedby="Search"
            />
          </Col>
          <Col></Col>
        </Row>
        <Row className="mt-4">
          <Col md={12} xl={8} className="mx-auto">
            {/*Player cards */}
            <PlayerCard />
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