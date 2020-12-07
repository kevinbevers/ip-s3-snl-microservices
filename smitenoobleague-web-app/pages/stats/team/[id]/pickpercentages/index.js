//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//boostrap components
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import { Button, FormControl, Card } from "react-bootstrap";
//icons
import { FaReply } from "react-icons/fa";
//custom components
import GodPickCard from "src/components/GodPickCard";


export default function PickPercentages({ postData }) {
  return (
    <>
      <NavBar />
      {/* {postData} */}
      <Container fluid className="mt-2">
        {/* Team Header */}
        <Row className="">
          <Col md={2} xl={1} xs={3} className="my-auto">
            <Image src="https://web2.hirez.com/smite-esports/dev/teams/SSG.png" className="MainTeamImage"></Image>
          </Col>
          <Col md={7} xl={8} xs={9} className="pb-0 my-auto">
            <Row className="">
              <Col md={12} className=""> <h3 className="TeamStatTitle">Spacestation Gaming</h3></Col>
            </Row>
            <Row>
              <Col md={12} xl={10} xs={12} className="">
                <Row>

                </Row>
              </Col>
            </Row>
          </Col>
          <Col md={3} xl={3} xs={12} className="">
            <Row className="mb-4">
              <Col md={4} xs={4}></Col>
              <Col md={8} xs={8}>
                <Button href="/stats/team/2345" className="w-100"><div className="d-flex text-center justify-content-center"><FaReply className="mr-2 my-auto" /><h5 className="my-auto BackButtonText">Back to team stats</h5></div></Button>
              </Col>
            </Row>
            <Row>
              <Col md={12} xs={12}>

                <FormControl
                  className="searchinput"
                  placeholder="Search God..."
                  aria-label="Search God"
                  aria-describedby="Search"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col><hr /></Col>
        </Row>
        <Row className="row-cols-2 row-cols-md-5 row-cols-xl-6 mt-4">
          {/* insert all gods with data */}
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
          <GodPickCard />
        </Row>
      </Container>
      <Footer />
    </>
  );

}

// export async function getStaticPaths() {
//   // Return a list of possible value for id
//   const paths = [
//     {
//       params: {
//         id: ["2345", "pickpercentages"]
//       }
//     },
//     {
//       params: {
//         id: ["1234", "pickpercentages"]
//       }
//     },
//     {
//       params: {
//         id: ["2345", "pickpercentages"]
//       }
//     }
//   ];
//   return {
//     paths,
//     fallback: false
//   }
// }

// export async function getStaticProps({ params }) {
//   // Fetch necessary data for the blog post using params.id
//   const postData = params.id;
//   return {
//     props: {
//       postData
//     }
//   }
// }