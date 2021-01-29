//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//bootstrap imports
import { CardColumns, Container, Col, Row, Card, Jumbotron } from "react-bootstrap";
//import background component
import FullBackground from "../src/components/FullBackground";
//Auth
import helpers from "utils/helpers";
//react timeline
import { VerticalTimeline, VerticalTimelineElement }  from "react-vertical-timeline-component";
import 'react-vertical-timeline-component/style.min.css';
//icons 
import {FaStar, FaTrophy, FaBinoculars,FaUsers, FaAdjust} from "react-icons/fa";
import {GiAchievement} from "react-icons/gi";
import {BsTable} from "react-icons/bs";
import {MdShowChart} from "react-icons/md";
//image optimization
import Img from 'react-optimized-image';


export default function roadmap({LoginSession}) {
  return (
    <>
      <FullBackground src={"roadmap_bg"} />
      <NavBar LoginSession={LoginSession}/>
      <Container fluid>       
<VerticalTimeline animate={false}>
<Row><Col className="mx-auto" xs={8}><Img alt={"SNL Roadmap"} height={300} webp src={require("public/images/SNL_Roadmap.png")} className="" draggable={false}></Img></Col></Row>
  <VerticalTimelineElement
    className="mt-0"
    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    icon={<FaBinoculars />}
  >
    <h3 className="vertical-timeline-element-title">Free agent area</h3>
    <h6 className="vertical-timeline-element-subtitle">Coming end of Q1 2021</h6>
    <p>
      Add yourself into a list of free agents, with experiences, preffered roles, and contact information.<br />
      Captains of teams can look in here to find players to fill their teams with. Or maybe you can even find other people to form your own team.
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    className=""
    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    icon={<FaUsers />}
  >
    <h3 className="vertical-timeline-element-title">Roster page per division</h3>
    <h6 className="vertical-timeline-element-subtitle">Coming early Q2 2021</h6>
    <p>
      Easily see which teams are competing in each division.
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    className=""
    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    icon={<FaAdjust />}
  >
    <h3 className="vertical-timeline-element-title">Dark mode</h3>
    <h6 className="vertical-timeline-element-subtitle">Coming Q2 2021</h6>
    <p>
      For those who like it.
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
     icon={<MdShowChart />}
  >
    <h3 className="vertical-timeline-element-title">Player Championships</h3>
    <h6 className="vertical-timeline-element-subtitle">Coming end of Q2 2021</h6>
    <p>
      Player Championships offer a way to see what player is performing the best in a specific league. And give player the chance to compete on a personal level.
    </p>
  </VerticalTimelineElement>
  <VerticalTimelineElement
    className=""
    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    icon={<BsTable />}
  >
    <h3 className="vertical-timeline-element-title">Other schedule types</h3>
    <h6 className="vertical-timeline-element-subtitle">Coming early Q3 2021</h6>
    <p>
      Tournament brackets, Faster splits,
      Best of 1's, Best of 5's
    </p>
  </VerticalTimelineElement>
</VerticalTimeline>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  return {
      props: {
          LoginSession: loginSessionData
      },
  };
}