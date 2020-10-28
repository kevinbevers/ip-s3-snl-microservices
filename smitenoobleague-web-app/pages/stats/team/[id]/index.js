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
import { Badge, Image, Modal, Button } from 'react-bootstrap';
//icons
import { FaBox, FaInfoCircle } from 'react-icons/fa';
//chart
import {Line} from 'react-chartjs-2';
//custom components
import RecentTeams from 'src/components/RecentTeams';

export default function TeamStat({ postData }) {

    // RPP recent peformance points. a calculation done in the back-end based on gametime, kills, win or loss, gold earned and a few more stats. combined into a algorithm
    const data = {
        labels: ['week 1','week 2','week 3', 'week 4','week 5'],
        datasets: [
          {
            label: 'Recent peformance points',
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
            data: [2450,2300,2600,2000,2100,2230,2300,2400,2600]
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
                    stepSize: 500,
                    suggestedMax: 3000,
                }
            }]
        }
      };
// Modal for info about linechart
      const [rppShow, setRPPShow] = useState(false);

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
                    <Col className="pr-0"><h5 className="mb-0 TeamBannerStats"><b>Games played:</b> 5000</h5></Col>
                    <Col className="pl-0 pr-0"><h5 className="mb-0 TeamBannerStats"><b>Win percentage:</b> 100%</h5></Col>
                    <Col className="pl-0 pr-0"><h5 className="mb-0 TeamBannerStats"><b>Current division:</b> Godlike</h5></Col>
                    </Row>
                </Col>
              </Row>
              </Col>
              <Col md={3} xl={3} xs={12} className="">
                 <Row>
                     <Col md={12} className="text-center"><h5 className="RecentPerformanceTitle">Recent peformance chart <a href="#" onClick={() => setRPPShow(true)} className="link-unstyled"><FaInfoCircle /></a></h5></Col>
                 </Row>
                 <Row className="text-center">
                     {/* Chart.JS Line graph */}
                     <Col><Line data={data} legend={legendOpts} height={100} options={options} /></Col>
                 </Row>
             </Col> 
            </Row>
            <Row>
                <Col><hr /></Col>
            </Row>
            {/* Team Stats */}
            <Row className="mt-3">
                {/* General stats */}
                <Col md={4} className="border-right">
                    <Row className="mb-2">
                    <Col><h2 className="font-weight-bold StatTitle">GENERAL STATS</h2></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team kills:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team deaths:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team assists:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team damage dealt:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">1.000.000.000</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team damage taken:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team damage mitigated:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">1.999.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team healing:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-4">
                <Col className="text-center">
                    {/* Link to pick percentages of team */}
                <Button href="/stats/team/2345/pickpercentages" className="StatSubTitle">Click to see team pick percentages</Button>
                </Col>
                </Row>
                </Col>
                {/* Pick stats and Star player */}
                <Col md={3} className="border-right">
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST PLAYED</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col>                      
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                    </Col>
                </Row>
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST BANNED</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImgStats mr-1" rounded/>
                    </Col>
                </Row>
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">STAR PLAYER</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Jungle_Logo.png" className="GodImgStats mr-2" />
                        <h3 className="my-auto RecentTeamPlayerName">lolliepoep</h3>
                    </Col>
                </Row>
               
                </Col >
                {/* Roster */}
                <Col md={3} className="border-right">
                <h2 className="font-weight-bold StatTitle">ROSTER</h2>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Solo_Logo.png" className="GodImgStats mr-2" />
                        <h3 className="my-auto RecentTeamPlayerName">verylonglonglongname</h3><Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Jungle_Logo.png" className="GodImgStats mr-2" />
                        <h3 className="my-auto RecentTeamPlayerName">lolliepoep</h3>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Mid_Logo.png" className="GodImgStats mr-2" />
                        <h3 className="my-auto RecentTeamPlayerName">lolliepoep</h3>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Support_Logo.png" className="GodImgStats mr-2" />
                        <h3 className="my-auto RecentTeamPlayerName">lolliepoep</h3>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Adc_Logo.png" className="GodImgStats mr-2" />
                        <h3 className="my-auto RecentTeamPlayerName">lolliepoep</h3>
                    </Col>
                </Row>
                </Col>
                {/* Recently played, no border right needed */}
                <Col md={2} className=""> 
                    <h2 className="font-weight-bold StatTitle">RECENTLY PLAYED</h2>
                    <Row><Col><RecentTeams backgroundColor={'RecentTeamWinBackground'} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={'RecentTeamWinBackground'} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={'RecentTeamLossBackground'} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={'RecentTeamWinBackground'} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={'RecentTeamLossBackground'} /></Col></Row>
                    
                </Col>
            </Row>
      </Container>
      <Footer />

      <Modal
        size=""
        show={rppShow}
        onHide={() => setRPPShow(false)}
        aria-labelledby="rppModal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="rppModalTitle">
            Recent performance chart
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>This chart shows the recent peformance of a team, The Recent performance is based of RPP(recent performance points)</p>
                <p>these points are calculated based on:</p> 
                <ul>
                <li>win or loss of a match</li> 
                <li>Time played</li>
                <li>Gold earned</li>
                <li>KDA of team</li>
                <li>Damage dealt</li> 
                <li>Kill particpation</li>
                </ul>
            </Modal.Body>
      </Modal>
    </>
  );

}

// export async function getStaticPaths() {
//   // Return a list of possible values for id
//   const paths = [
//     {
//       params: {
//         id: '2345'
//       }
//     },
//     {
//       params: {
//         id: '1234'
//       }
//     },
//     {
//       params: {
//         id: '1234'
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