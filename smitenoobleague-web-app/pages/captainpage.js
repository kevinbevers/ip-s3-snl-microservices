//default react imports
import React, { useState, useEffect } from "react";
import Router from "next/router";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
import DefaultErrorPage from "next/error";
//bootstrap components
import { Container, Row, Col } from "react-bootstrap";
//custom imports
import CaptainMatchSubmit from "src/components/captainpage/CaptainMatchSubmit";
import CaptainTeamInfo from "src/components/captainpage/CaptainTeamInfo";
import CaptainTeamManagement from "src/components/captainpage/CaptainTeamManagement";
//Auth & API
import helpers from "utils/helpers";
import captainservice from "services/captainservice";

export default function captainpage({ LoginSession, apiResponse, status, errMsg, apiToken, ...props }) {

  if (status != null) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="captainPageError"/></>);
  }
  else {

    return (
      <>
        <NavBar LoginSession={LoginSession} />
        <Container fluid>
          <Row className="mt-4 mb-4"><Col className="text-center"><h1 className="font-weight-bold">CAPTAINPAGE</h1></Col></Row>
          <Row>
            <Col xl={1}></Col>
            <Col md={5} xl={4}>
            <Row className="mb-2">
                <Col className="rounded">
                  <CaptainMatchSubmit apiToken={apiToken} />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                <CaptainTeamInfo apiResponse={apiResponse} apiToken={apiToken} />
                </Col>
              </Row>
            </Col>
            <Col md={7} xl={6} className="mb-2">
              <CaptainTeamManagement apiResponse={apiResponse} apiToken={apiToken} />
            </Col>
            <Col xl={1}></Col>
          </Row>
        </Container>
        <Footer />
      </>
    );
  }
}

export async function getServerSideProps({ req, params, res }) {

  const loginSessionData = await helpers.GetLoginSession(req);

  if (loginSessionData?.user != null) {
    const apiTokenForClient = await helpers.GetAccessTokenForClient(req, req);
    let response = { data: null, statusCode: null, errMsg: null };
    await captainservice.GetTeamByCaptainID(apiTokenForClient,loginSessionData.user.sub)
      .then(res => {
        response.data = res.data;
      })
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
        apiResponse: response.data,
        status: response.statusCode,
        errMsg: response.errMsg,
        apiToken: apiTokenForClient
      }
    }
  }
  else {
    res.statusCode = 302
    res.setHeader('Location', `/api/login`) // redirect to login page
  }

  return {
    props: {
      LoginSession: loginSessionData
    },
  };
}