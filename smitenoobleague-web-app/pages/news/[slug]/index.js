//default react imports
import React, { useState } from "react";
import DOMPurify from "dompurify";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
import { CardColumns, Container, Button, Col, Row, Card, Alert, Jumbotron } from "react-bootstrap";
//Auth
import helpers from "utils/helpers";
//services
import newsservice from "services/newsservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";


export default function news({LoginSession, Article}) {

  const clean = DOMPurify.sanitize(Article?.articleContent);

  const ReadableDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <div className="w-100 news-banner position-relative"><Image alt={"SNL News Image"} layout={"fill"} src={"/images/news_bg.jpg"} className="news-bannerimg" draggable={false}></Image></div>
      <Container fluid className="mt-3">
        <Row><Col md={6} className="mx-auto text-left">
        <h2 className="display-4 font-weight-bold">{Article?.articleTitle}</h2>
        </Col></Row>
        <Row><Col md={6} className="mx-auto text-left"><h6 className="font-weight-bold">Article type: {Article?.articleType}</h6></Col></Row>
        <Row><Col md={6} className="mx-auto text-left"><h6 className="font-weight-bold">Date posted: {ReadableDate(Article?.articleDate)}</h6></Col></Row>
        <Row><Col><hr/></Col></Row>
        <Row>
          <Col md={6} className="mx-auto text-left">
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
           
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  const slug = context.params.slug;

  let article = null;

  await newsservice.GetArticleBySlug(slug).then(res => {article = res.data;}).catch(err => {});

  return {
      props: {
          LoginSession: loginSessionData,
          Article: article
      },
  };
}