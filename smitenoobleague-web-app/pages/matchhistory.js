//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from 'src/components/NavBar';
import Footer from 'src/components/Footer';
//bootstrap implements
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Container, Image } from 'react-bootstrap';
//custom implements
import MatchHistoryCard from 'src/components/MatchHistoryCard';

export default function matchhistory() {
  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <MatchHistoryCard team1_name={'Spacestation Gaming'} total_score={'2 - 0'} team2_name={'Ghost gaming'} matchID={5234534}/>
        <MatchHistoryCard team1_name={'Spacestation Gaming'} total_score={'2 - 0'} team2_name={'Ghost gaming'} matchID={5234534}/>
        <MatchHistoryCard team1_name={'Spacestation Gaming'} total_score={'2 - 0'} team2_name={'Ghost gaming'}/>
        <MatchHistoryCard team1_name={'Spacestation Gaming'} total_score={'2 - 0'} team2_name={'Ghost gaming'}/>
        <MatchHistoryCard team1_name={'Spacestation Gaming'} total_score={'2 - 0'} team2_name={'Ghost gaming'}/>
        <MatchHistoryCard team1_name={'Spacestation Gaming'} total_score={'2 - 0'} team2_name={'Ghost gaming'}/>
        <Card className="text-center mb-2">
          <a href="#" className="link-unstyled">
            <Card.Header><h4 className="m-0">Load more matches...</h4></Card.Header>
            </a>
            </Card>
      </Container>
      <Footer />
    </>
  );
}