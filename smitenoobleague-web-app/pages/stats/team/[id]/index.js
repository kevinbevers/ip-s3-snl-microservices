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
import { Badge, Modal, Button } from "react-bootstrap";
//icons
import { FaBox, FaInfoCircle } from "react-icons/fa";
//chart
import {Line} from "react-chartjs-2";
//custom components
import RecentTeams from "src/components/RecentTeams";
//Auth
import helpers from "utils/helpers";
//services
import teamservice from "services/teamservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function TeamStat({LoginSession, TeamStats, status, errMsg }) {

    const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + TeamStats?.team?.teamLogoPath;

    // RPP recent peformance points. a calculation done in the back-end based on gametime, kills, win or loss, gold earned and a few more stats. combined into a algorithm
    const data = {
        labels: ["week 1","week 2","week 3", "week 4","week 5"],
        datasets: [
          {
            label: "Recent peformance points",
            fill: false,
            order: 0,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
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

      console.log(TeamStats);

      if (status != null) {
        return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="playerpageErrorPage"/></>);
      }
      else {

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      {/* {postData} */}
      <Container fluid className="">
          {/* Team Header */}
          <Row className="">
              <Col md={2} xl={1} xs={3} className="my-auto pl-1">
              {TeamStats.team?.teamLogoPath != null ? <div className="MainTeamImage position-relative"><Image layout={"fill"} alt={TeamStats.team?.teamName} src={imagePath} draggable={false}></Image></div>  : 
                        <Img alt={TeamStats.team?.teamName} src={require("public/images/teamBadge.png")} className="MainTeamImage" draggable={false}></Img>
                      }
              </Col>
              <Col md={7} xl={8} xs={9} className="pb-0 my-auto">
              <Row className="">
                  <Col md={12} className="pl-1"> <h3 className="TeamStatTitle">{TeamStats?.team?.teamName}</h3></Col>
              </Row>
              <Row>
                <Col md={12} xl={11} xs={12} className="pl-1">
                    <Row>
                    <Col xl={4} md={4} xs={4} className="pr-0"><h5 className="mb-0 TeamBannerStats"><b>Games played:</b> {TeamStats?.gamesPlayed}</h5></Col>
                    <Col xl={8} md={8} xs={8} className="pl-0 pr-0 d-flex">
                        <h5 className="mb-0 TeamBannerStats mr-md-3 mr-1"><b>Win percentage:</b> {TeamStats?.winPercentage}%</h5>
                        <h5 className="mb-0 TeamBannerStats"><b>Current division:</b> {TeamStats?.divisionName}</h5>
                    </Col>
                    {/* <Col xl={5} md={5} xs={4} className="pl-0 pr-0"></Col> */}
                    </Row>
                </Col>
              </Row>
              </Col>
              <Col md={3} xl={3} xs={12} className="">
                 <Row>
                     <Col md={12} className="text-center"><h5 className="RecentPerformanceTitle">Recent performance chart <a href="#" onClick={() => setRPPShow(true)} className="link-unstyled"><FaInfoCircle /></a></h5></Col>
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
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalKills}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team deaths:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalDeaths}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team assists:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalAssists}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team damage dealt:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalDamageDealt}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team damage taken:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalDamageTaken}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team damage mitigated:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalDamageMitigated}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team healing:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalHealing}</h4></Col>
                    </Row>
                </Col>
                {/* Pick stats and Star player */}
                <Col md={3} className="border-right">
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">STAR PLAYER</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Jungle_Logo.png" className="GodImgStats mr-2" draggable={false}/>
                        <h3 className="my-auto RecentTeamPlayerName">STAR PLAYER NAME</h3>
                    </Col>
                </Row>  
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST PLAYED</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">                      
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    </Col>
                </Row>
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST BANNED</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    <div className="GodImgStats position-relative mr-1"><Image layout="fill" src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="rounded" draggable={false}/></div>
                    </Col>
                </Row>
                <Row className="mb-4">
                <Col className="">
                    {/* Link to pick percentages of team */}
                <Button href="/stats/team/2345/pickpercentages" className="StatNumbers">Click to see team pick percentages</Button>
                </Col>
                </Row>              
               
                </Col >
                {/* Roster */}
                <Col md={3} className="border-right">
                <h2 className="font-weight-bold StatTitle">ROSTER</h2>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Solo_Logo.png" className="GodImgStats mr-2" draggable={false}/>
                        <h3 className="my-auto RecentTeamPlayerName">{TeamStats?.team?.teamMembers[0]?.teamMemberName}</h3>{TeamStats?.team?.teamMembers[0]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Jungle_Logo.png" className="GodImgStats mr-2" draggable={false}/>
                        <h3 className="my-auto RecentTeamPlayerName">{TeamStats?.team?.teamMembers[1]?.teamMemberName}</h3>{TeamStats?.team?.teamMembers[1]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Mid_Logo.png" className="GodImgStats mr-2" draggable={false}/>
                        <h3 className="my-auto RecentTeamPlayerName">{TeamStats?.team?.teamMembers[2]?.teamMemberName}</h3>{TeamStats?.team?.teamMembers[2]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Support_Logo.png" className="GodImgStats mr-2" draggable={false}/>
                        <h3 className="my-auto RecentTeamPlayerName">{TeamStats?.team?.teamMembers[3]?.teamMemberName}</h3>{TeamStats?.team?.teamMembers[3]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <img src="/images/roles/Adc_Logo.png" className="GodImgStats mr-2" draggable={false}/>
                        <h3 className="my-auto RecentTeamPlayerName">{TeamStats?.team?.teamMembers[4]?.teamMemberName}</h3>{TeamStats?.team?.teamMembers[4]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                </Col>
                {/* Recently played, no border right needed */}
                <Col md={2} className=""> 
                    <h2 className="font-weight-bold StatTitle">RECENTLY PLAYED</h2>
                    <Row><Col><RecentTeams backgroundColor={"RecentTeamWinBackground"} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={"RecentTeamWinBackground"} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={"RecentTeamLossBackground"} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={"RecentTeamWinBackground"} /></Col></Row>
                    <Row><Col><RecentTeams backgroundColor={"RecentTeamLossBackground"} /></Col></Row>
                    
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

}

export async function getServerSideProps(context) {
  
    const loginSessionData = await helpers.GetLoginSession(context.req);
  
  //id from url
  const teamID = context.params.id;
  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };
  //call api for the data
  await teamservice.GetTeamStatisticsByTeamID(teamID)
  .then(res => {response.data = res.data})
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
          TeamStats: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
      },
  };
  }