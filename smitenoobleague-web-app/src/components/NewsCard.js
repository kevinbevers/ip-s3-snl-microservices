
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Link from "next/link";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function NewsCard({Article}){
  // custom loader, this one doesn't use server performance and just displays the image vanilla
  const imageLoader = ({ src, width, quality }) => {
    // return `${src}?w=${width}&q=${quality || 75}`
    return `${src}`;
    }

  const ArticleImg = (a) => {
    const articleImg = process.env.NEXT_PUBLIC_BASE_API_URL + "/news-service/images/" + Article?.articleImagePath;
    return Article?.articleImagePath != null ? <Image loader={imageLoader} alt={"SNL News Image"} className="newsimg2 rounded-top newsArticleImg" layout={"fill"} src={articleImg} draggable={false}></Image>
    : <Image alt={"SNL News Image"} className="newsimg2 rounded-top newsArticleImg" layout={"fill"} src={"/images/news_placeholder.jpg"} draggable={false}></Image>;
  };

  const ReadableDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

    return (
    <Col className="mb-4">
      <Link href={"news/" + Article?.articleSlug}>
    <Card className="h-100 Clickable newsArticle">
      {/* <Card.Img variant="top" src={require("public/images/news_bg.jpg")}  className="newsimg" draggable={false}/> */}
      <div className="w-100 newsimg2 position-relative">{ArticleImg(Article)}</div>
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