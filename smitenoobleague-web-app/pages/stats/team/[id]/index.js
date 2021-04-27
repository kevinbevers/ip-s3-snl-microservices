//default react imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
import DefaultErrorPage from "next/error";
//boostrap components
import { Badge, Modal, Button, Row, Col, Container, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
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

        // custom loader, this one doesn't use server performance and just displays the image vanilla
        const imageLoader = ({ src, width, quality }) => {
          // return `${src}?w=${width}&q=${quality || 75}`
          return `${src}`;
          }

    const SimpleToolTipForMostPicked = (data) => {
        if(data?.godName != null)
        {
        return <Tooltip id="button-tooltip">
          <div>
            <h6 className="font-weight-bold">{data?.godName}</h6>
            <p className="text-left"><b>Times played:</b> {data?.timesPlayed}</p>
        </div></Tooltip>
        }
        else {
          return <Tooltip id="button-tooltip"><div><b>Not enough data yet to show.</b></div></Tooltip>
        }
      };
    
    const SimpleToolTip = (data) => {
      if(data?.godName != null)
      {
      return <Tooltip id="button-tooltip">
        <div>
          <h6 className="font-weight-bold">{data?.godName}</h6>    
      </div></Tooltip>
      }
      else {
        return <Tooltip id="button-tooltip"><div><b>Not enough data yet to show.</b></div></Tooltip>
      }
    };

    const [teamMembers, setTeamMembers] = useState([]);
    //const [test, setTest] = useState([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }, { id: 3, name: "Player 3" }, { id: 4, name: "Player 4" }, { id: 5, name: "Player 5" }]);
    //Get every team member for each role. to make sure they are on the correct position if less then 5 members get returned
    useEffect(() => {
      const team = [];
      const solo = TeamStats?.team?.teamMembers.filter(member => member.teamMemberRole.roleID == 1)[0];
      team.push(solo != undefined ? solo : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 1, roleName: "Solo" } }); //SOLO
      const jungle = TeamStats?.team?.teamMembers.filter(member => member.teamMemberRole.roleID == 2)[0]
      team.push(jungle != undefined ? jungle : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 2, roleName: "Jungle" } }); //JUNGLE
      const mid = TeamStats?.team?.teamMembers.filter(member => member.teamMemberRole.roleID == 3)[0];
      team.push(mid != undefined ? mid : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 3, roleName: "Mid" } }); //MID
      const support = TeamStats?.team?.teamMembers.filter(member => member.teamMemberRole.roleID == 4)[0];
      team.push(support != undefined ? support : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 4, roleName: "Support" } }); //SUPPORT
      const adc = TeamStats?.team?.teamMembers.filter(member => member.teamMemberRole.roleID == 5)[0];
      team.push(adc != undefined ? adc : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 5, roleName: "Adc" } }); //ADC
  
      setTeamMembers(team);
  
    }, []);

    const lastGamesCount = TeamStats?.recentPerformanceScore?.length;
    let counter = 0;
    let labelList = [];
    TeamStats?.recentPerformanceScore?.forEach(e => {
        if(lastGamesCount - counter == 1)
        {
            labelList.push("last game");
        }
        else {
      labelList.push(lastGamesCount - counter + " games ago");
        }
      counter++;
    });

    // RPP recent peformance points. a calculation done in the back-end based on gametime, kills, win or loss, gold earned and a few more stats. combined into a algorithm
    const data = {
        labels: labelList,
        datasets: [
          {
            label: "RPP",
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
            data: TeamStats?.recentPerformanceScore
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
                    stepSize: 100,
                    suggestedMax: 1000,
                }
            }],
            xAxes: [{
                ticks: {
                    display: false //this will remove only the label
                }
            }]
        }
      };
// Modal for info about linechart
      const [rppShow, setRPPShow] = useState(false);

      if (status != null) {
        return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="playerpageErrorPage"/></>);
      }
      else {

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <Container fluid className="">
          {/* Team Header */}
          <Row className="">
              <Col md={2} xl={1} xs={3} className="my-auto pl-1">
              {TeamStats.team?.teamLogoPath != null ? <div className="MainTeamImage position-relative"><Image loading={"eager"} layout={"fill"} alt={TeamStats.team?.teamName} src={imagePath} draggable={false}></Image></div>  : 
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
                        <h5 className="mb-0 TeamBannerStats mr-md-3 mr-1"><b>Win percentage:</b> {TeamStats?.gamesPlayed > 0 ? Math.round(TeamStats?.wins / TeamStats?.gamesPlayed * 100) : 0}%</h5>
                        <h5 className="mb-0 TeamBannerStats"><b>Current division:</b> {TeamStats?.divisionName != null ? TeamStats?.divisionName?.replace("division", "") : "..."}</h5>
                    </Col>
                    {/* <Col xl={5} md={5} xs={4} className="pl-0 pr-0"></Col> */}
                    </Row>
                </Col>
              </Row>
              </Col>
              <Col md={3} xl={3} xs={12} className="">
                 <Row>
                     <Col md={12} className="text-center"><h5 className="RecentPerformanceTitle">Recent performance chart <a onClick={() => setRPPShow(true)} className="link-unstyled Clickable"><FaInfoCircle /></a></h5></Col>
                 </Row>
                 <Row className="text-center">
                     {/* Chart.JS Line graph */}
                     <Col className=""><Line data={data} legend={legendOpts} height={100} options={options} /></Col>
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
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total team wards placed:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{TeamStats?.totalWardsPlaced}</h4></Col>
                    </Row>
                </Col>
                {/* Pick stats and Star player */}
                <Col md={3} className="border-right">
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">STAR PLAYER</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        {TeamStats?.starPlayer != null ? <>
                        <Img webp src={require(`public/images/roles/${TeamStats?.starPlayer?.teamMemberRole?.roleName}_Logo.png`)} className="GodImgStats mr-2" draggable={false}/>
                        <Link href={`/stats/player/${TeamStats.starPlayer.playerID}`}><h3 className="my-auto RecentTeamPlayerName Clickable Hoverable" title={"click to see player stats"}>{TeamStats?.starPlayer?.teamMemberName}</h3></Link></>
                        :  <Alert variant="warning" className="rounded"><h5 className="my-auto font-weight-bold">No star player, not enough data</h5></Alert>}
                    </Col>
                </Row>  
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST PLAYED</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">          
                    {TeamStats?.mostPlayed != null ? <>        
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(TeamStats?.mostPlayed[0])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostPlayed[0]?.godIcon != null ? TeamStats?.mostPlayed[0]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostPlayed[0]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(TeamStats?.mostPlayed[1])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostPlayed[1]?.godIcon != null ? TeamStats?.mostPlayed[1]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostPlayed[2]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(TeamStats?.mostPlayed[2])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostPlayed[2]?.godIcon != null ? TeamStats?.mostPlayed[2]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostPlayed[3]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(TeamStats?.mostPlayed[3])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostPlayed[3]?.godIcon != null ? TeamStats?.mostPlayed[3]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostPlayed[3]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(TeamStats?.mostPlayed[4])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostPlayed[4]?.godIcon != null ? TeamStats?.mostPlayed[4]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostPlayed[4]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    </> : <>        
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst1"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst2"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst3"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst4"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst5"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    </>}
                    </Col>
                </Row>
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST BANNED</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        {TeamStats?.mostBanned ? <>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(TeamStats?.mostBanned[0])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostBanned[0]?.godIcon != null ? TeamStats?.mostBanned[0]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostBanned[0]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(TeamStats?.mostBanned[1])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostBanned[1]?.godIcon != null ? TeamStats?.mostBanned[1]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostBanned[2]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(TeamStats?.mostBanned[2])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostBanned[2]?.godIcon != null ? TeamStats?.mostBanned[2]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostBanned[3]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(TeamStats?.mostBanned[3])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostBanned[3]?.godIcon != null ? TeamStats?.mostBanned[3]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostBanned[3]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(TeamStats?.mostBanned[4])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" loader={imageLoader} src={TeamStats?.mostBanned[4]?.godIcon != null ? TeamStats?.mostBanned[4]?.godIcon : "/images/empty_slot.png"} alt={TeamStats?.mostBanned[4]?.godName} className="rounded" draggable={false}/></div></OverlayTrigger>
                    </> : <>        
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst1"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst2"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst3"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst4"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"BannedAgainst5"} className="rounded" draggable={false}/></div></OverlayTrigger>
                    </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                <Col className="">
                    {/* Link to pick percentages of team */}
                <Button href={`/stats/team/${TeamStats?.team?.teamID}/pickpercentages`} className="StatNumbers">Click to see team pick percentages</Button>
                </Col>
                </Row>              
               
                </Col >
                {/* Roster */}
                <Col md={3} className="border-right">
                <h2 className="font-weight-bold StatTitle">ROSTER</h2>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <Img webp src={require("public/images/roles/Solo_Logo.png")} className="GodImgStats mr-2" draggable={false}/>
                        <Link href={`/stats/player/${teamMembers[0]?.playerID}`}><h3 className="my-auto RecentTeamPlayerName Clickable Hoverable" title="click to see player stats">{teamMembers[0]?.teamMemberName != null ? teamMembers[0]?.teamMemberName : "No player in this role yet"}</h3></Link>{teamMembers[0]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <Img webp src={require("public/images/roles/Jungle_Logo.png")} className="GodImgStats mr-2" draggable={false}/>
                        <Link href={`/stats/player/${teamMembers[1]?.playerID}`}><h3 className="my-auto RecentTeamPlayerName Clickable Hoverable" title="click to see player stats">{teamMembers[1]?.teamMemberName != null ? teamMembers[1]?.teamMemberName : "No player in this role yet"}</h3></Link>{teamMembers[1]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <Img webp src={require("public/images/roles/Mid_Logo.png")} className="GodImgStats mr-2" draggable={false}/>
                        <Link href={`/stats/player/${teamMembers[2]?.playerID}`}><h3 className="my-auto RecentTeamPlayerName Clickable Hoverable" title="click to see player stats">{teamMembers[2]?.teamMemberName != null ? teamMembers[2]?.teamMemberName : "No player in this role yet"}</h3></Link>{teamMembers[2]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <Img webp src={require("public/images/roles/Support_Logo.png")} className="GodImgStats mr-2" draggable={false}/>
                        <Link href={`/stats/player/${teamMembers[3]?.playerID}`}><h3 className="my-auto RecentTeamPlayerName Clickable Hoverable" title="click to see player stats">{teamMembers[3]?.teamMemberName != null ? teamMembers[3]?.teamMemberName : "No player in this role yet"}</h3></Link>{teamMembers[3]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                        <Img webp src={require("public/images/roles/Adc_Logo.png")} className="GodImgStats mr-2" draggable={false}/>
                        <Link href={`/stats/player/${teamMembers[4]?.playerID}`}><h3 className="my-auto RecentTeamPlayerName Clickable Hoverable" title="click to see player stats">{teamMembers[4]?.teamMemberName != null ? teamMembers[4]?.teamMemberName : "No player in this role yet"}</h3></Link>{teamMembers[4]?.teamCaptain ? <Badge variant="secondary" className="my-auto ml-1 mr-1 StatBadge">Captain</Badge> : <> </>}
                    </Col>
                </Row>
                </Col>
                {/* Recently played, no border right needed */}
                <Col md={2} className=""> 
                    <h2 className="font-weight-bold StatTitle">RECENTLY PLAYED</h2>
                    {TeamStats?.recentMatches != null ? <>
              {TeamStats?.recentMatches.map((r, index) => ( <>
                <RecentTeams key={index} recent={r} />
                </>
              ))}
             </> : 
             <> 
              <Row className="mt-2 mb-2">
                <Col md={12} className="text-left">
                <Alert variant="warning" className="rounded"><h6 className="mb-0 align-self-center font-weight-bold">No recent played matches.</h6></Alert>
                </Col>
              </Row> 
            </>}        
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
            <p>This chart shows the recent match peformance of the team, each match get's a certain amount of RPP(recent performance points)</p>
                <p>these points are calculated based on:</p> 
                <ul>
                <li>win or loss of a match</li> 
                <li>Time played</li>
                <li>Gold earned</li>
                <li>KDA of team</li>
                <li>Damage dealt</li> 
                <li>Objectives taken</li>
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