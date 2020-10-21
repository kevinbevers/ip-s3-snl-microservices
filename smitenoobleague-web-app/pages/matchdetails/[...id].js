//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from 'src/components/NavBar';
import Footer from 'src/components/Footer';
//boostrap components
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
//icons
import { FaBox } from 'react-icons/fa';
//custom components
import WinnerTeamTable from 'src/components/matchdetails/WinnerTeamTable';
import LoserTeamTable from 'src/components/matchdetails/LoserTeamTable';

export default function matchdetails({ postData }) {
  return (
    <>
      <NavBar />
      {postData}
      <Container>
        {/* Team 1 */}
       <WinnerTeamTable />
        {/* Divider */}
        <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
        {/* Team 2 */}
        <LoserTeamTable />
      </Container>
      <Footer />
    </>
  );

}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = [
    {
      params: {
        id: ['5234534']
      }
    },
    {
      params: {
        id: ['5234534', 'game', '1']
      }
    },
    {
      params: {
        id: ['5234534', 'game', '2']
      }
    }
  ];
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const postData = params.id;
  return {
    props: {
      postData
    }
  }
}