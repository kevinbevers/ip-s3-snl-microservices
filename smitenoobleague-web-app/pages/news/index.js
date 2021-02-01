//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
import { CardColumns, Container, Button, Col, Row, Card, Alert } from "react-bootstrap";
import NewsCard from "src/components/NewsCard";
//import background component
import FullBackground from "src/components/FullBackground";
//Auth
import helpers from "utils/helpers";
//services
import newsservice from "services/newsservice";


export default function news({LoginSession, LatestArticles}) {

  const [ArticlesState, setArticlesState] = useState(LatestArticles);
  const [index, setIndex] = useState(1);
  const [articlesRemaining, setArticlesRemaining] = useState(LatestArticles?.length > 7);

  const loadMoreArticles = async() => {
    if(articlesRemaining)
    {
      await newsservice.GetArticleList(8,index)
      .then(res => {
        setArticlesState(ArticlesState.concat(res.data)); 
        setIndex(index + 1); 
        setArticlesRemaining(res.data?.length > 7)
      }).catch(err => {setArticlesRemaining(false); });
    }
  };

  return (
    <>
      <FullBackground src={"news_bg"} />
      <NavBar LoginSession={LoginSession}/>
      <Container fluid>
    {ArticlesState != null ? <>
      <Row className="row-cols-1 row-cols-md-3 row-cols-xl-4 mt-4">
              {ArticlesState.map((a, index) => (
                         <NewsCard key={index} Article={a}/>
              ))}
                    </Row> </> : 
             <> 
              <Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No articles.</h3>
                  </Alert>
                </Col>
                <Col md={3}></Col>
              </Row> 
            </>}
        {/* Load more */}
        <Row>
          <Col>   
          {articlesRemaining ?  
            <Button variant={"light"} className="text-center mb-2 btn-block" onClick={loadMoreArticles}>
                Load more news...
            </Button> : <> </> }
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  let latest8Articles = null;

  await newsservice.GetArticleList(8,0).then(res => {latest8Articles = res.data;}).catch(err => {});

  return {
      props: {
          LoginSession: loginSessionData,
          LatestArticles: latest8Articles
      },
  };
}