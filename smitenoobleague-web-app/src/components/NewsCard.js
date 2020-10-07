
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';


export default function NewsCard(props){

    return (
    <Col className="mb-4">
    <Card className="h-100">
      <Card.Img variant="top" src="http://via.placeholder.com/300x150"  className='newsimg'/>
      <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.desc}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Posted on 11-10-2020</small>
        <small className="text-muted float-right">Article type here</small>
      </Card.Footer>
    </Card>
  </Col>
    );
}