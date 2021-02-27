//default react imports
import React, { useState, useEffect } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//boostrap components
import { Alert, Tab, Nav, Table, Col, Row, Container, Jumbotron } from "react-bootstrap";
//icons
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
//custom components
import TeamTable from "src/components/matchdetails/TeamTable";
//Auth
import helpers from "utils/helpers";
//services
import matchservice from "services/matchservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function GameData({MatchResult, teamsInMatch}) {
    //states
    const [totals, setTotals] = useState({});
    const [firstTeam, setFirstTeam] = useState({});
    const [secondTeam, setSecondTeam] = useState({});
    //functions
    const CalculateTotals = (match) => {

        let totals = {mvp: {player: {}, godIcon: null}, firstBlood: {playername: null, godIcon: null}, killCount: 0, wardsPlaced: 0, phoenixesWinner: 0, phoenixesLoser: 0, towersWinner: 0, towersLoser: 0, fireGiantsWinner: 0, fireGiantsLoser: 0, goldFuriesWinner: 0, goldFuriesLoser: 0 }

        match?.winners?.forEach(p => { 
            totals.killCount += p.kills; 
            totals.fireGiantsWinner += p.fireGiantsKilled; 
            totals.goldFuriesWinner += p.goldFuriesKilled; 
            totals.wardsPlaced += p.wardsPlaced; 
            totals.towersWinner += p.towersDestroyed;
            totals.phoenixesWinner += p.phoenixesDestroyed;
            //Set firstblood object if the player firstblooded
            if(p.firstBlood == true)
            {
                totals.firstBlood.playername = p.player.playername;
                totals.firstBlood.godIcon = p.god.godIcon;
            }
            //Set the mvp
            if(MatchResult.mvpPlayerID == p.player.playerID)
            {
                totals.mvp.player = p.player;
                totals.mvp.godIcon = p.god.godIcon;
            }
        });
        match?.losers?.forEach(p => { 
            totals.killCount += p.kills; 
            totals.fireGiantsLoser += p.fireGiantsKilled; 
            totals.goldFuriesLoser += p.goldFuriesKilled; 
            totals.wardsPlaced += p.wardsPlaced; 
            totals.towersLoser += p.towersDestroyed;
            totals.phoenixesLoser += p.phoenixesDestroyed;
            //Set firstblood object if the player firstblooded
            if(p.firstBlood == true)
            {
                totals.firstBlood.playername = p.player.playername;
                totals.firstBlood.godIcon = p.god.godIcon;
            }
            //Set them mvp
            if(MatchResult.mvpPlayerID == p.player.playerID)
            {
                totals.mvp.player = p.player;
                totals.mvp.godIcon = p.god.godIcon;
            }
        });
        return totals;
    };

    const ReadableDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const RenderTeamImage = (t) => {

        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return (t?.teamLogoPath != null ? <Image loading={"eager"} layout="fixed" height={20} width={20} alt={t?.teamName} title={t?.teamName} src={imagePath} className="" draggable={false}></Image>  : 
        <Img webp width={20} height={20} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="" draggable={false}></Img>);
      };

      const RenderTeamImageLayoutFill = (t) => {

        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return <Image loading={"eager"} height={20} width={20} alt={t?.teamName} title={t?.teamName} src={t?.teamLogoPath != null ?imagePath : "/images/teamBadge.png"} className="" draggable={false}></Image>;
      };

      const BanWithTeamImage = (banNumber) => {
        return (<>
            <div className="position-relative mt-3 mr-lg-2 mr-1">               
                <div className="position-relative"><Image loading={"eager"} width={30} height={30} src={MatchResult?.bannedGods[banNumber - 1]?.godIcon != null ? MatchResult?.bannedGods[banNumber - 1]?.godIcon : "/images/empty_slot.png"} alt={MatchResult?.bannedGods[banNumber - 1]?.godName} title={MatchResult?.bannedGods[banNumber - 1]?.godName} className="GodImg rounded" draggable={false}/></div>
                <div className="SmallTeamImg position-absolute">{RenderTeamImageLayoutFill(banNumber%2 ? firstTeam : secondTeam)}</div>
            </div>  
            </>);
      };

      useEffect(() => {
        if(MatchResult != null)
        {
             
            setTotals(CalculateTotals(MatchResult));
            setFirstTeam(MatchResult.losers[0]?.firstBanSide ? teamsInMatch?.filter(t => t.teamID == MatchResult.losingTeamID)[0] : teamsInMatch?.filter(t => t.teamID == MatchResult.winningTeamID)[0]);        
            setSecondTeam(MatchResult.losers[0]?.firstBanSide ? teamsInMatch?.filter(t => t.teamID == MatchResult.winningTeamID)[0] : teamsInMatch?.filter(t => t.teamID == MatchResult.losingTeamID)[0]);
        }
      }, []);


    return (
        <>
            <Row className="mb-3">
                <Col xl={3} lg={5} md={7} xs={12} className="mx-auto rounded alert-secondary border">
                    <Row className="justify-content-center mt-2">
                        <Col xl={7} lg={7} xs={7} className="pb-1">
                            <Row><Col md={12} className="text-left border-right border-secondary"><h6 className="font-weight-bold">1st ban phase</h6></Col></Row>
                            <Row>
                                <Col md={12} className="d-flex border-right border-secondary">
                                <div className="d-flex align-items-center justify-content-left">
                                    {BanWithTeamImage(1)}
                                    {BanWithTeamImage(2)}
                                    {BanWithTeamImage(3)}
                                    {BanWithTeamImage(4)}
                                    {BanWithTeamImage(5)}
                                    {BanWithTeamImage(6)}
                                </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={5} lg={5} xs={5} className="pb-1">
                            <Row><Col md={12} className="text-left"><h6 className="font-weight-bold">2nd ban phase</h6></Col></Row>
                            <Row>
                                <Col md={12} className="d-flex">
                                <div className="d-flex align-items-center justify-content-left">
                                    {BanWithTeamImage(7)}
                                    {BanWithTeamImage(8)}
                                    {BanWithTeamImage(9)}
                                    {BanWithTeamImage(10)}
                                </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xl={2} md={0}></Col>
                <Col xl={8} lg={9} md={8} sm={8} xs={12}>
                    {/* Team 1 */}
                    <TeamTable playerdata={MatchResult?.winners[0]?.firstBanSide ? MatchResult?.winners : MatchResult?.losers } team={firstTeam} />
                    {/* Divider */}
                    <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
                    {/* Team 2 */}
                    <TeamTable playerdata={MatchResult?.losers[0]?.firstBanSide == false ? MatchResult?.losers : MatchResult?.winners} team={secondTeam} />
                </Col>
                <Col xl={2} lg={3} md={4} className="my-auto pl-0">
                    <Alert variant="secondary" className="p-lg-2 p-md-2">
                        <h4 className="font-weight-bold">Extra info</h4>
                        <hr />
                        <h6><b>Date:</b> {ReadableDate(MatchResult?.entryDate)}</h6>
                        <h6><b>Duration:</b> {MatchResult?.matchDuration}</h6>
                        <h6><b>Match ID:</b> {MatchResult?.gameID}</h6>
                        <hr />
                        <h5 className="font-weight-bold">Game details</h5>
                        <hr />
                        <h6><b>Total kills:</b> {totals?.killCount}</h6>
                        <h6><b>Total wards placed:</b> {totals?.wardsPlaced}</h6>
                        <h6 className="d-flex"> <b className="mr-1">First blood:</b> {totals?.firstBlood != null ? <Image loading={"eager"} layout="fixed" height={20} width={20} src={totals?.firstBlood?.godIcon} alt="FirstBloodGod" className="rounded" />: <> </> }<span className="ml-1">{totals?.firstBlood?.playername}</span></h6>
                        <h6 className="d-flex"> <b className="mr-1">MVP:</b> <Image loading={"eager"} layout="fixed" height={20} width={20} src={totals?.mvp?.godIcon != null ? totals?.mvp?.godIcon : "/images/empty_slot.png"} alt="MvpGod" className="GodImg rounded" /> <span className="ml-1">{totals?.mvp?.player?.playername}</span></h6>
                        {/* <p className="mb-0">A little text describing the game, possibly auto generated.</p> */}
                        <hr />
                        <h5 className="font-weight-bold">Map stats</h5>
                        <hr />
                        <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Phoenixes"} title="Phoenixes" src={require("public/images/Phoenixes.png")} className="" draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{MatchResult?.winners[0]?.firstBanSide ? totals?.phoenixesWinner : totals?.phoenixesLoser}</span> {RenderTeamImage(firstTeam)} <span className="ml-1 mr-1">{MatchResult?.losers[0]?.firstBanSide == false ? totals?.phoenixesLoser : totals?.phoenixesWinner}</span> {RenderTeamImage(secondTeam)}</h6>
                        <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Towers"} title="Towers" src={require("public/images/Towers.png")} className="" draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{MatchResult?.winners[0]?.firstBanSide ? totals?.towersWinner : totals?.towersLoser}</span> {RenderTeamImage(firstTeam)} <span className="ml-1 mr-1">{MatchResult?.losers[0]?.firstBanSide == false ? totals?.towersLoser : totals?.towersWinner}</span> {RenderTeamImage(secondTeam)}</h6>
                        <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Firegiants"} title="Firegiants" src={require("public/images/Firegiant2.png")} className="rounded"  draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{MatchResult?.winners[0]?.firstBanSide ? totals?.fireGiantsWinner : totals?.fireGiantsLoser}</span> {RenderTeamImage(firstTeam)} <span className="ml-1 mr-1">{MatchResult?.losers[0]?.firstBanSide == false ? totals?.fireGiantsLoser : totals?.fireGiantsWinner}</span> {RenderTeamImage(secondTeam)}</h6>
                        <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Goldfuries"} title="Goldfuries" src={require("public/images/Goldfury2.png")} className="rounded" draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{MatchResult?.winners[0]?.firstBanSide ? totals?.goldFuriesWinner : totals?.goldFuriesLoser}</span> {RenderTeamImage(firstTeam)} <span className="ml-1 mr-1">{MatchResult?.losers[0]?.firstBanSide == false ? totals?.goldFuriesLoser : totals?.goldFuriesWinner}</span> {RenderTeamImage(secondTeam)}</h6>
                    </Alert>
                </Col>
            </Row>
        </>
    );
}