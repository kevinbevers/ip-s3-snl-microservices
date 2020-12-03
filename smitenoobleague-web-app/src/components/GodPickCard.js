import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import {Image, Row, Container} from "react-bootstrap";


export default function GodPickCard(){

    return (
<Col className="mb-4">
<Card className="h-100">
  <Card.Body className="p-1 bg-light">
    <Container>
      <Row>
        <Col>
        <h4 className="font-weight-bold GodPickTitle">Ratatoskr</h4>
        </Col>
      </Row>
       <Row>
         <Col md={4} xs={4}>
         <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgPick mr-1 mb-2" rounded />
         </Col>
         <Col md={8} xs={8}>
         <Row>
           <Col><h6 className="GodPickSubTitle"><b>Picked:</b> 100%</h6></Col>
         </Row>
         <Row>
         <Col><h6 className="GodPickSubTitle"><b>Banned:</b> 100%</h6></Col>
         </Row>
         </Col>
       </Row>
       <hr /> 
       <Row>
         <Col><h5 className="font-weight-bold GodPickTitle">SNL AVERAGE</h5></Col>
        </Row>    
        <Row>
        <Col><h6 className="GodPickSubTitle"><b>Picked:</b> 100%</h6></Col>
        <Col><h6 className="GodPickSubTitle"><b>Banned:</b> 100%</h6></Col>
          </Row>  
        </Container>
  </Card.Body>
</Card>
</Col>
    );
}