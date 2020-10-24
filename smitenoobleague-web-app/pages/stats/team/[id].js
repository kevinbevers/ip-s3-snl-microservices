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
import Image from 'react-bootstrap/Image';
import {  } from 'react-bootstrap';
//icons
import { FaBox } from 'react-icons/fa';
//chart
import {Line} from 'react-chartjs-2';
//custom components

export default function TeamStat({ postData }) {

    const data = {
        labels: ['week 1','week 2','week 3', 'week 4','week 5'],
        datasets: [
          {
            label: 'Win percentage',
            fill: false,
            order: 0,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [1,0,1,1,1,0,1,1,0]
          }
        ]
      };

      const legendOpts = {
        display: false,
      };

      const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        }
      };

  return (
    <>
      <NavBar />
      {/* {postData} */}
      <Container fluid className="mt-2">
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
                    <Col className="pr-0"><h5 className="mb-0 TeamBannerStats"><b>Games played:</b> 5000</h5></Col>
                    <Col className="pl-0 pr-0"><h5 className="mb-0 TeamBannerStats"><b>Win percentage:</b> 100%</h5></Col>
                    <Col className="pl-0 pr-0"><h5 className="mb-0 TeamBannerStats"><b>Current division:</b> Godlike</h5></Col>
                    </Row>
                </Col>
              </Row>
              </Col>
              <Col md={3} xl={3} xs={12} className="">
                 <Row>
                     <Col md={12} className="text-center"><h5 className="RecentPerformanceTitle">Recent peformance chart</h5></Col>
                 </Row>
                 <Row className="text-center">
                     <Col><Line data={data} legend={legendOpts} height={100} options={options} /></Col>
                 </Row>
             </Col> 
            </Row>
            <Row>
                <Col><hr /></Col>
            </Row>
      </Container>
      <Footer />
    </>
  );

}

export async function getStaticPaths() {
  // Return a list of possible values for id
  const paths = [
    {
      params: {
        id: '2345'
      }
    },
    {
      params: {
        id: '1234'
      }
    },
    {
      params: {
        id: '1234'
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