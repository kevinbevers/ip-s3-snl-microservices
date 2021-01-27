//default react imports
import React, { useState } from "react";
import DefaultErrorPage from "next/error";
import Link from "next/link";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//boostrap components
import { Button, FormControl, Card, Col, Row, Container, Jumbotron } from "react-bootstrap";
//icons
import { FaReply } from "react-icons/fa";
//custom components
import GodPickCard from "src/components/GodPickCard";
//Auth
import helpers from "utils/helpers";
//services
import teamservice from "services/teamservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function PickPercentages({ LoginSession, TeamPicks, status, errMsg }) {

  const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + TeamPicks?.team?.teamLogoPath;

  const [GodsMatched, setGodsMatched] = useState(TeamPicks?.gods);
  const [SearchValue, setSearchValue] = useState("");

  const searchChange = (evt) => {
    setSearchValue(evt.target.value);

    if (evt.target.value?.length > 0) {
      setGodsMatched(TeamPicks.gods.filter(g =>
        g.godName?.toLowerCase().includes(evt.target.value.toLowerCase())
      ));
    }
    else {
      setGodsMatched(TeamPicks.gods);
    }
  };

  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="playerpageErrorPage" /></>);
  }
  else {
  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      {/* {postData} */}
      <Container fluid className="mt-2">
        {/* Team Header */}
        <Row className="">
          <Col md={2} lg={2} xl={1} xs={3} className="my-auto">
          {TeamPicks.team?.teamLogoPath != null ? <div className="MainTeamImage position-relative"><Image layout={"fill"} alt={TeamPicks.team?.teamName} src={imagePath} draggable={false}></Image></div>  : 
                        <Img alt={TeamPicks.team?.teamName} src={require("public/images/teamBadge.png")} className="MainTeamImage" draggable={false}></Img>
                      }
          </Col>
          <Col md={6} lg={6} xl={8} xs={9} className="pb-0 my-auto">
            <Row className="">
              <Col md={12} className=""> <h3 className="TeamStatTitle">{TeamPicks?.team?.teamName}</h3></Col>
            </Row>
            <Row>
              <Col md={12} xl={10} xs={12} className="">
                <Row>

                </Row>
              </Col>
            </Row>
          </Col>
          <Col md={4} lg={4} xl={3} xs={12} className="">
              <Row className="mb-4">
                <Col md={4} xs={4}></Col>
                <Col md={8} xs={8}>
                  <Link href={`/stats/team/${TeamPicks?.team?.teamID}`}><Button className="w-100"><div className="d-flex text-center justify-content-center"><FaReply className="mr-2 my-auto" /><h5 className="my-auto BackButtonText">Back to player stats</h5></div></Button></Link>
                </Col>
              </Row>
              <Row>
                <Col md={12} xs={12}>

                  <FormControl
                    value={SearchValue}
                    onChange={searchChange}
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
       {/* insert all gods with data */}
       {TeamPicks.gods != null ? <>
            {GodsMatched?.length > 0 ? <>
              <Row className="row-cols-2 row-cols-md-5 row-cols-xl-6 mt-4">
                {GodsMatched.map((g, index) => (
                  <GodPickCard key={index} God={g} TotalGamesPlayedInSnl={TeamPicks.totalGamesPlayedInSNL} TotalGamesPlayed={TeamPicks.totalGamesPlayed} />
                ))}
              </Row> </> : <>
                <Row className="mt-5">
                  <Col md={3}></Col>
                  <Col md={6} className="d-inline-flex justify-content-center">
                  <Alert variant="warning" className="rounded">
                    <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No pick & ban data found with the given search input</h3>
                  </Alert> 
                  </Col>
                  <Col md={3}></Col>
                </Row>
              </>}
          </> :
            <>
              <Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No pick and ban data available</h3>
                </Alert> 
                </Col>
                <Col md={3}></Col>
              </Row>
            </>}
        </Container>
        <Footer />
    </>
  );
  }

}

export async function getServerSideProps(context) {

  const loginSessionData = await helpers.GetLoginSession(context.req);

  //id from url
  const teamID = context.params.id;
  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };
  //call api for the data
  await teamservice.GetTeamPickPercentagesByTeamID(teamID)
    .then(res => { response.data = res.data })
    .catch(err => {
      if (err.response == null) {
        response.statusCode = 503;
        response.errMsg = "SNL API unavailable";
      }
      else {
        response.statusCode = JSON.stringify(err?.response?.status);
        response.errMsg = err?.response?.data;
      }
    });

  return {
    props: {
      LoginSession: loginSessionData,
      TeamPicks: response.data,
      status: response.statusCode,
      errMsg: response.errMsg,
    },
  };
}