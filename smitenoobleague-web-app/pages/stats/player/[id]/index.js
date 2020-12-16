//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "src/components/NavBar"; 
import Footer from "src/components/Footer"; 
//boostrap components
import { Badge, Image, Modal, Button, Jumbotron, Container, Row, Col } from "react-bootstrap";
//icons
// import {} from "react-icons/fa";
//chart
import {Doughnut} from "react-chartjs-2";
//custom components

//Auth
import helpers from "utils/helpers";

export default function PlayerStat({ postData, LoginSession }) {

    const data = {
        labels: [
            "Ratatoskr",
            "Sun Wukong",
            "Ao Kuang",
            "Mulan",
            "Other"
        ],
        datasets: [{
            data: [20,20, 20, 10, 40],
            backgroundColor: [
                "#6925E8",
                "#27DBF2",
                "#57DB2D",
                "#F2C027",
                "#EB2602"
            ],
            hoverBackgroundColor: [
                "#6925E8",
                "#27DBF2",
                "#57DB2D",
                "#F2C027",
                "#EB2602"
            ]
        }]
    };
    // percentage option in tooltip
    const options = {
        legend: {
            display: true,
            labels: {
                fontSize: 10,
                fontStyle: "bold",
                fontFamily: "Roboto",
            },
         },
        tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                try {
                  let label = " " + data.labels[tooltipItem.index] || "";
        
                  if (label) {
                    label += ": ";
                  }
        
                  const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
                    return accumulator + curValue;
                  });
                  const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        
                  label += Number((value / sum) * 100).toFixed(0) + "%";
                  return label;
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
      };

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      {/* {postData} */}
      <Container fluid className="mt-2">
          {/* Team Header */}
          <Row className="">
              <Col md={2} xl={1} xs={3} className="my-auto">
                  <Image src="/images/roles/Jungle_Logo.png" className="MainRoleImage"></Image>
              </Col>
              <Col md={4} xl={5} xs={9} className="pb-0 my-auto">
              <Row className="">
                 <Col md={12} className="d-flex"><Image src="https://web2.hirez.com/smite-esports/dev/teams/SSG.png" className="SmallTeamImage mr-1 my-auto"></Image><h4 className="mb-0 PlayerStatTeamTitle my-auto">Spacestation Gaming</h4></Col>
              </Row>
              <Row className="">
                <Col md={12} className=""><h3 className="PlayerStatTitle my-auto">lolliepoep</h3></Col>
              </Row>
              <Row className="pt-2">
                <Col md={12} xl={10} xs={12} className="">
                    <Row>
                    <Col className="pr-0"><h5 className="mb-0 PlayerBannerStats"><b>Games played:</b> 5000</h5></Col>
                    <Col md={6} xs={6} className="pl-0 pr-0"><h5 className="mb-0 PlayerBannerStats"><b>Win / Loss:</b> 2500 / 2500</h5></Col>
                    </Row>
                </Col>
              </Row>
              </Col>
              <Col md={3} xl={3} xs={6} className="border-left border-right mt-1">
                  <Row><Col><h4 className="font-weight-bold PlayerBannerStatTitle text-center">RECENT PICKS</h4></Col></Row>
                  <Row className="mb-1">
                    <Col className="d-flex justify-content-center">                      
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="PlayerRecentPickImg mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="PlayerRecentPickImg mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="PlayerRecentPickImg mr-1" rounded/>
                    </Col>
                </Row>
                <Row>
                    <Col  className="d-flex justify-content-center">                      
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="PlayerRecentPickImg mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="PlayerRecentPickImg mr-1" rounded/>
                      <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="PlayerRecentPickImg mr-1" rounded/>
                    </Col>
                </Row>
             </Col> 
             <Col md={3} xl={3} xs={6} className="mt-1">
             <Row> <Col md={1} xs={1}></Col><Col><h4 className="font-weight-bold PlayerBannerStatTitle">AVERAGE STATS</h4></Col></Row>
             <Row>
             <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>K/D/A:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText"> 10/2/4</h5></Col>
             </Row>
             <Row>
                <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>DAMAGE DEALT:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText">20.341</h5></Col>
             </Row>
             <Row>
                <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>DAMAGE TAKEN:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText">10.231</h5></Col>
             </Row>
             <Row>
                <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>KILL PARTICIPATION:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText">100%</h5></Col>
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
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player kills:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player deaths:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player assists:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player damage dealt:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">1.000.000.000</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player damage taken:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player damage mitigated:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">1.999.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player healing:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player distance travelled:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">99.999.999</h4></Col>
                    </Row>
                    <Row className="mb-4">
                <Col className="text-center">
                    {/* Link to pick percentages of team */}
                <Button href="/stats/player/343532/pickpercentages" className="StatSubTitle">Click to see player pick percentages</Button>
                </Col>
                </Row>
                </Col>
                {/* Pick stats and Star player */}
                <Col md={4} className="border-right">
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">BEST PICKS</h2></Col>
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
                    <Col><h2 className="font-weight-bold StatTitle">MOST PICKED</h2></Col>
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
                    <Col><h2 className="font-weight-bold StatTitle">TOP BANS AGAINST</h2></Col>
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
               
                </Col >
                {/* Roster */}
                <Col md={4} className="border-right">
               
                <Row><Col> <h2 className="font-weight-bold StatTitle">TOTAL DAMAGE DEALT</h2></Col></Row>
                <Row className="">
                    <Col className="mb-2">
                    {/* Doughnut chart */}
                        <Doughnut data={data} height={14} width={20} options={options}/>
                    </Col>
                </Row>
                </Col>
            </Row>
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