import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import {Row, Container} from "react-bootstrap";
import Image from "next/image";

export default function GodPickCard({God, TotalGamesPlayed, TotalGamesPlayedInSnl}){

    return (
<Col className="mb-4">
<Card className="h-100">
  <Card.Body className="p-1 bg-light">
    <Container>
      <Row>
        <Col>
        <h4 className="font-weight-bold GodPickTitle">{God?.godName}</h4>
        </Col>
      </Row>
       <Row>
         <Col md={4} xs={4}>
         <div className="GodImgPick mr-1 mb-2 position-relative"><Image layout={"fill"} src={God?.godIcon != null ? God?.godIcon : "/images/empty_slot.png"} alt={God?.godName} className="rounded" draggable={false}/></div>
         </Col>
         <Col md={8} xs={8}>
         <Row>
           <Col><h6 className="GodPickSubTitle"><b>Picked:</b> {TotalGamesPlayed > 0 ? Math.round(God?.timesPlayed / TotalGamesPlayed * 100) : 0}%</h6></Col>
         </Row>
         <Row>
         <Col><h6 className="GodPickSubTitle"><b>Banned:</b> {TotalGamesPlayed > 0 ? Math.round(God?.timesBanned / TotalGamesPlayed * 100): 0}%</h6></Col>
         </Row>
         </Col>
       </Row>
       <hr /> 
       <Row>
         <Col><h5 className="font-weight-bold GodPickTitle">SNL AVERAGE</h5></Col>
        </Row>    
        <Row>
        <Col><h6 className="GodPickSubTitle"><b>Picked:</b> {TotalGamesPlayedInSnl > 0 ? Math.round(God?.timesPlayedInSNL / TotalGamesPlayedInSnl * 100): 0}%</h6></Col>
        <Col><h6 className="GodPickSubTitle"><b>Banned:</b> {TotalGamesPlayedInSnl > 0 ? Math.round(God?.timesBannedInSNL / TotalGamesPlayedInSnl * 100): 0}%</h6></Col>
          </Row>  
        </Container>
  </Card.Body>
</Card>
</Col>
    );
}