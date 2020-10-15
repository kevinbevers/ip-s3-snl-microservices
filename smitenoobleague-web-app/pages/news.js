//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CardColumns, Container } from 'react-bootstrap';
import NewsCard from 'src/components/NewsCard';

export default function news() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Row className="row-cols-1 row-cols-md-3 row-cols-xl-4 mt-4">
          <NewsCard title="Card title" desc="This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer."/>

          <NewsCard title="test article" desc="this is the description of this test article." />

          <NewsCard title="Card title" desc="This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer."/>

          <NewsCard title="Card title" desc="This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer."/>

          <NewsCard title="Card title" desc="This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer."/>

          <NewsCard title="Card title" desc="This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer."/>

        </Row>
      </Container>
      <Footer />
    </>
  );
}