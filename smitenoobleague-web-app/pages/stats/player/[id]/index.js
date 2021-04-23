//default react imports
import React, { useState } from "react";
import Link from "next/link";
//default page stuff
import NavBar from "src/components/NavBar"; 
import Footer from "src/components/Footer"; 
import DefaultErrorPage from "next/error";
//boostrap components
import { Badge, Modal, Button, Container, Row, Col, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
//icons
import {FaTimes, FaPlaystation, FaXbox, FaSteam} from "react-icons/fa";
import {RiSwitchFill} from "react-icons/ri";
import {GiPc} from "react-icons/gi";
import {SiEpicgames} from "react-icons/si";
//chart
import {Doughnut} from "react-chartjs-2";
//Auth
import helpers from "utils/helpers";
//services
import playerservice from "services/playerservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function PlayerStat({LoginSession, PlayerStats, status, errMsg }) {

  const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + PlayerStats?.team?.teamLogoPath;

  const ToolTipForBestPicks = (data) => {
    if(data?.god?.godName != null)
    {
    return <Tooltip id="button-tooltip">
      <div>
        <h6 className="font-weight-bold">{data?.god?.godName}</h6>
        <p className="text-left"><b>Times played:</b> {data?.totalGamesPlayed}<br />
        <b>Winpercentage:</b> {(data?.totalWins / data?.totalGamesPlayed * 100)}%<br />
        <b>Kill participation:</b> {data?.averageKillParticipation}%<br />
        <b>Average Kills:</b> {data?.averageKills}<br />
        <b>Average Deaths:</b> {data?.averageDeaths}<br />
        <b>Average Assists:</b> {data?.averageAssists}<br />
        <b>Average GPM:</b> {data?.averageGPM}<br />
        </p>
        
    </div></Tooltip>
    }
    else {
      return <Tooltip id="button-tooltip"><div><b>Not enough data yet to show.</b></div></Tooltip>
    }
  };

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

  //Data for the graph
  let damageByTopDamageGods = 0;
  PlayerStats?.highestDamageGods?.forEach(e => {
    damageByTopDamageGods += e.damageDealt;
  })
  let labelList = ["Other"];
  let DamageList = [PlayerStats?.totalDamageDealt - damageByTopDamageGods];
  PlayerStats?.highestDamageGods?.forEach(e => {
    labelList.push(e.godName);
    DamageList.push(e.damageDealt);
  });
    

    const data = {
        labels: labelList,
        datasets: [{
            data: DamageList,
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

      if (status != null) {
        return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="playerpageErrorPage"/></>);
      }
      else {

  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <Container fluid className="mt-2">
          {/* Player Header */}
          <Row className="">
              <Col md={2} xl={1} xs={3} className="my-auto">
                  <Img src={require("public/images/roles/" + PlayerStats?.player?.teamMemberRole?.roleName + "_Logo.png")} className="MainRoleImage" draggable={false}></Img>
              </Col>
              <Col md={4} xl={5} xs={9} className="pb-0 my-auto">
              {PlayerStats.team?.teamID != null ? <>
              <Row className="">
                 <Col md={12} className="d-flex">
                 {PlayerStats.team?.teamLogoPath != null ? <Image layout="fixed" height={35} width={35} alt={PlayerStats.team?.teamName} src={imagePath} className="SmallTeamImage mr-1 my-auto" draggable={false}></Image>  : 
                        <Img alt={PlayerStats.team?.teamName} src={require("public/images/teamBadge.png")} className="SmallTeamImage mr-1 my-auto" draggable={false}></Img>
                      }
                  <Link href={`/stats/team/${PlayerStats.team?.teamID}`} ><h4 className="mb-0 PlayerStatTeamTitle my-auto Clickable Hoverable" title={"click to see team stats"}>{PlayerStats?.team?.teamName}</h4></Link> 
                  </Col>
              </Row> </> : <></> }
              <Row className="">
                <Col md={12} className=""><h3 className="PlayerStatTitle my-auto">{(PlayerStats?.player?.teamMemberPlatform == "PS4" &&
                                                    <FaPlaystation />)
                                                || (PlayerStats?.player?.teamMemberPlatform == "Steam" &&
                                                    <FaSteam />)
                                                || (PlayerStats?.player?.teamMemberPlatform == "Xbox" &&
                                                    <FaXbox />)
                                                || (PlayerStats?.player?.teamMemberPlatform == "HiRez" &&
                                                    <GiPc />)
                                                || (PlayerStats?.player?.teamMemberPlatform == "Switch" &&
                                                    <RiSwitchFill />)
                                                || (PlayerStats?.player?.teamMemberPlatform == "Epic_Games" && 
                                                    <SiEpicgames />)
                                                ||
                                                PlayerStats?.player?.teamMemberPlatform
                                                } {PlayerStats?.player?.teamMemberName}</h3></Col>
              </Row>
              <Row className="pt-2">
                <Col md={12} xl={10} xs={12} className="">
                    <Row>
                    <Col className="pr-0"><h5 className="mb-0 PlayerBannerStats"><b>Games played:</b> {PlayerStats?.gamesPlayed}</h5></Col>
                    <Col md={6} xs={6} className="pl-0 pr-0"><h5 className="mb-0 PlayerBannerStats"><b>Win / Loss:</b> {PlayerStats?.wins} / {PlayerStats?.losses}</h5></Col>
                    </Row>
                </Col>
              </Row>
              </Col>
              <Col md={3} xl={3} xs={6} className="border-left border-right mt-1">
                  <Row><Col><h4 className="font-weight-bold PlayerBannerStatTitle text-center">RECENT PICKS</h4></Col></Row>
                  <Row className="mb-1">                  
                    <Col className="d-flex justify-content-center"> 
                    {PlayerStats?.recentPicks != null ? <>                     
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.recentPicks[0])}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={PlayerStats?.recentPicks[0]?.godIcon != null ? PlayerStats?.recentPicks[0]?.godIcon : "/images/empty_slot.png"} alt={PlayerStats?.recentPicks[0]?.godName != null ? PlayerStats?.recentPicks[0]?.godName : "RecentPick1"} title={PlayerStats?.recentPicks[1]?.godName != null ? PlayerStats?.recentPicks[1]?.godName : "RecentPick1"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.recentPicks[1])}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={PlayerStats?.recentPicks[1]?.godIcon != null ? PlayerStats?.recentPicks[1]?.godIcon : "/images/empty_slot.png"} alt={PlayerStats?.recentPicks[1]?.godName != null ? PlayerStats?.recentPicks[1]?.godName : "RecentPick2"} title={PlayerStats?.recentPicks[1]?.godName != null ? PlayerStats?.recentPicks[1]?.godName : "RecentPick2"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.recentPicks[2])}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={PlayerStats?.recentPicks[2]?.godIcon != null ? PlayerStats?.recentPicks[2]?.godIcon : "/images/empty_slot.png"} alt={PlayerStats?.recentPicks[2]?.godName != null ? PlayerStats?.recentPicks[2]?.godName : "RecentPick3"} title={PlayerStats?.recentPicks[2]?.godName != null ? PlayerStats?.recentPicks[2]?.godName : "RecentPick3"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    </> : <>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"RecentPick1"} title={"RecentPick1"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"RecentPick2"} title={"RecentPick2"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"RecentPick3"} title={"RecentPick3"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger></>}
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center">
                      {PlayerStats?.recentPicks != null ? <>                 
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.recentPicks[3])}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={PlayerStats?.recentPicks[3]?.godIcon != null ? PlayerStats?.recentPicks[3]?.godIcon : "/images/empty_slot.png"} alt="" className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.recentPicks[4])}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={PlayerStats?.recentPicks[4]?.godIcon != null ? PlayerStats?.recentPicks[4]?.godIcon : "/images/empty_slot.png"} alt="" className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.recentPicks[5])}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={PlayerStats?.recentPicks[5]?.godIcon != null ? PlayerStats?.recentPicks[5]?.godIcon : "/images/empty_slot.png"} alt="" className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    </> :  <>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"RecentPick1"} title={"RecentPick1"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"RecentPick2"} title={"RecentPick2"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger>
                    <OverlayTrigger placement="bottom" overlay={SimpleToolTip(null)}><div className="PlayerRecentPickImg position-relative mr-1"><Image layout="fill" src={"/images/empty_slot.png"} alt={"RecentPick3"} title={"RecentPick3"} className="PlayerRecentPickImg rounded" draggable={false}/></div></OverlayTrigger></>}
                    </Col>
                </Row>
             </Col> 
             <Col md={3} xl={3} xs={6} className="mt-1">
             <Row> <Col md={1} xs={1}></Col><Col><h4 className="font-weight-bold PlayerBannerStatTitle">AVERAGE STATS</h4></Col></Row>
             <Row>
             <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>K/D/A:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText"> {PlayerStats?.averageKills}/{PlayerStats?.averageDeaths}/{PlayerStats?.averageAssists}</h5></Col>
             </Row>
             <Row>
                <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>DAMAGE DEALT:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText">{PlayerStats?.averageDamageDealt}</h5></Col>
             </Row>
             <Row>
                <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>DAMAGE TAKEN:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText">{PlayerStats?.averageDamageTaken}</h5></Col>
             </Row>
             <Row>
                <Col md={1} xs={1}></Col>
                 <Col md={6} xs={6} className="pr-0"><h5 className="PlayerBannerStatText"><b>KILL PARTICIPATION:</b></h5></Col>
                 <Col className=""><h5 className="PlayerBannerStatText">{PlayerStats?.averageKillParticipation}%</h5></Col>
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
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalKills}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player deaths:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalDeaths}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player assists:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalAssists}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player damage dealt:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalDamageDealt}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player damage taken:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalDamageTaken}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player damage mitigated:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalDamageMitigated}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player healing:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalHealing}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total player distance travelled:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalDistanceTravelled}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total wards placed:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalWardsPlaced}</h4></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col md={8} xs={8} className=""><h4 className="font-weight-bold StatSubTitle">Total structure damage:</h4></Col>
                    <Col className=""><h4 className="StatNumbers">{PlayerStats?.totalStructureDamage}</h4></Col>
                    </Row>
                </Col>
                {/* Pick stats and Star player */}
                <Col md={4} className="border-right">
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">BEST PICKS</h2></Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex">
                      <OverlayTrigger placement="bottom" overlay={ToolTipForBestPicks(PlayerStats?.bestPicks[0])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.bestPicks[0]?.god?.godIcon != null ? PlayerStats?.bestPicks[0]?.god?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                      <OverlayTrigger placement="bottom" overlay={ToolTipForBestPicks(PlayerStats?.bestPicks[1])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.bestPicks[1]?.god?.godIcon != null ? PlayerStats?.bestPicks[1]?.god?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                      <OverlayTrigger placement="bottom" overlay={ToolTipForBestPicks(PlayerStats?.bestPicks[2])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.bestPicks[2]?.god?.godIcon != null ? PlayerStats?.bestPicks[2]?.god?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                      <OverlayTrigger placement="bottom" overlay={ToolTipForBestPicks(PlayerStats?.bestPicks[3])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.bestPicks[3]?.god?.godIcon != null ? PlayerStats?.bestPicks[3]?.god?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                      <OverlayTrigger placement="bottom" overlay={ToolTipForBestPicks(PlayerStats?.bestPicks[4])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.bestPicks[4]?.god?.godIcon != null ? PlayerStats?.bestPicks[4]?.god?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                    </Col>
                </Row>
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">MOST PICKED</h2></Col>
                </Row>
                <Row className="mb-4">
                <Col className="d-flex">
                <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(PlayerStats?.mostPicked[0])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.mostPicked[0]?.godIcon != null ? PlayerStats?.mostPicked[0]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded"  draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(PlayerStats?.mostPicked[1])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.mostPicked[1]?.godIcon != null ? PlayerStats?.mostPicked[1]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded"  draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(PlayerStats?.mostPicked[2])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.mostPicked[2]?.godIcon != null ? PlayerStats?.mostPicked[2]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded"  draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(PlayerStats?.mostPicked[3])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.mostPicked[3]?.godIcon != null ? PlayerStats?.mostPicked[3]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded"  draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTipForMostPicked(PlayerStats?.mostPicked[4])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.mostPicked[4]?.godIcon != null ? PlayerStats?.mostPicked[4]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded"  draggable={false}/></div></OverlayTrigger>
                    </Col>
                </Row>
                <Row className="">
                    <Col><h2 className="font-weight-bold StatTitle">TOP BANS AGAINST</h2></Col>
                </Row>
                <Row className="mb-4">
                <Col className="d-flex">
                <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.topBansAgainst[0])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.topBansAgainst[0]?.godIcon != null ? PlayerStats?.topBansAgainst[0]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.topBansAgainst[1])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.topBansAgainst[1]?.godIcon != null ? PlayerStats?.topBansAgainst[1]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.topBansAgainst[2])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.topBansAgainst[2]?.godIcon != null ? PlayerStats?.topBansAgainst[2]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.topBansAgainst[3])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.topBansAgainst[3]?.godIcon != null ? PlayerStats?.topBansAgainst[3]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={SimpleToolTip(PlayerStats?.topBansAgainst[4])}><div className="GodImgStats position-relative mr-1"><Image layout="fill" src={PlayerStats?.topBansAgainst[4]?.godIcon != null ? PlayerStats?.topBansAgainst[4]?.godIcon : "/images/empty_slot.png"} alt="" className="rounded" draggable={false}/></div></OverlayTrigger>
                    </Col>
                </Row>
                <Row className="mb-4">
                <Col className="">
                    {/* Link to pick percentages of team */}
                <Button href={`/stats/player/${PlayerStats?.player?.playerID}/pickpercentages`} className="StatNumbers">Click to see player pick percentages</Button>
                </Col>
                </Row>
                </Col >
                {/* Roster */}
                <Col md={4} className="border-right">
               
                <Row><Col> <h2 className="font-weight-bold StatTitle">TOTAL DAMAGE DEALT</h2></Col></Row>
                <Row className="">
                    <Col className="mb-2">
                    {/* Doughnut chart */}
                    {PlayerStats?.totalDamageDealt > 0 ? <>
                        <Doughnut data={data} height={14} width={20} options={options}/>
                        </> : <><Alert variant="warning" className="rounded"><h3 className="my-auto RecentTeamPlayerName text-center">not enough data</h3></Alert> </>}
                    </Col>
                </Row>
                </Col>
            </Row>
      </Container>
      <Footer />
    </>
  );
  }

}

export async function getServerSideProps(context) {
  
  const loginSessionData = await helpers.GetLoginSession(context.req);

  //id from url
  const playerID = context.params.id;
  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };
  //call api for the data
  await playerservice.GetPlayerStatisticsByPlayerID(playerID)
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
          PlayerStats: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
      },
  };
}