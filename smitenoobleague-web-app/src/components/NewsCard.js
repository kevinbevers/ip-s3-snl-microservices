
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Link from "next/link";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function NewsCard({Article}){

  const ReadableDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

    return (
    <Col className="mb-4">
      <Link href={"news/" + Article?.articleSlug}>
    <Card className="h-100 Clickable">
      {/* <Card.Img variant="top" src={require("public/images/news_bg.jpg")}  className="newsimg" draggable={false}/> */}
      <div className="w-100 newsimg2 position-relative"><Image alt={"SNL News Image"} className="newsimg2 rounded-top" layout={"fill"} src={"/images/news_bg.jpg"} draggable={false}></Image></div>
      <Card.Body>
            <Card.Title>{Article?.articleTitle}</Card.Title>
            <Card.Text>{Article?.articleDescription}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Posted on {ReadableDate(Article?.articleDate)}</small>
        <small className="text-muted float-right">{Article?.articleType}</small>
      </Card.Footer>
    </Card>
    </Link>
  </Col>
    );
}