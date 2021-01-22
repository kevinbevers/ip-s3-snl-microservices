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
    //functions
    const CalculateTotals = (match) => {

        let totals = {firstBlood: {playername: null, godIcon: null}, killCount: 0, wardsPlaced: 0, phoenixesWinner: 0, phoenixesLoser: 0, towersWinner: 0, towersLosers: 0, fireGiantsWinner: 0, fireGiantsLoser: 0, goldFuriesWinner: 0, goldFuriesLoser: 0 }

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
        });
        match?.losers?.forEach(p => { 
            totals.killCount += p.kills; 
            totals.fireGiantsLoser += p.fireGiantsKilled; 
            totals.goldFuriesLoser += p.goldFuriesKilled; 
            totals.wardsPlaced += p.wardsPlaced; 
            totals.towersLosers += p.towersDestroyed;
            totals.phoenixesLoser += p.phoenixesDestroyed;
            //Set firstblood object if the player firstblooded
            if(p.firstBlood == true)
            {
                totals.firstBlood.playername = p.player.playername;
                totals.firstBlood.godIcon = p.god.godIcon;
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
        return (t?.teamLogoPath != null ? <Image layout="fixed" height={20} width={20} alt={t?.teamName} title={t?.teamName} src={imagePath} className="" draggable={false}></Image>  : 
        <Img webp width={20} height={20} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="" draggable={false}></Img>);
      };

      useEffect(() => {
        if(MatchResult != null)
        {
             
            setTotals(CalculateTotals(MatchResult));
        }
      }, []);


    return (
        <Row>
            <Col xl={2} md={0}></Col>
            <Col xl={8} lg={9} md={8} sm={8} xs={12}>
                {/* Team 1 */}
                <TeamTable playerdata={MatchResult?.winners} team={teamsInMatch?.filter(t => t.teamID == MatchResult.winningTeamID)[0]} />
                {/* Divider */}
                <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
                {/* Team 2 */}
                <TeamTable playerdata={MatchResult?.losers} team={teamsInMatch?.filter(t => t.teamID == MatchResult.losingTeamID)[0]} />
            </Col>
            <Col xl={2} lg={3} md={4} className="my-auto pl-0">
                <Alert variant="secondary" className="p-lg-2 p-md-2">
                    <h4 className="font-weight-bold">Extra info</h4>
                    <hr />
                    <h6><b>Date:</b> {ReadableDate(MatchResult?.entryDate)}</h6>
                    <h6><b>Duration:</b> {MatchResult?.matchDuration}</h6>
                    <hr />
                    <h5 className="font-weight-bold">Game details</h5>
                    <hr />
                    <h6><b>Total kills:</b> {totals?.killCount}</h6>
                    <h6><b>Total wards placed:</b> {totals?.wardsPlaced}</h6>
                    <h6 className="d-flex"> <b className="mr-1">First blood:</b> {totals?.firstBlood != null ? <Image layout="fixed" height={20} width={20} src={totals?.firstBlood?.godIcon} alt="FirstBloodGod" className="rounded" />: <> </> }<span className="ml-1">{totals?.firstBlood?.playername}</span></h6>
                    <h6 className="d-flex"> <b className="mr-1">MVP:</b> <Image layout="fixed" height={20} width={20} src={"https://static.smite.guru/i/champions/icons/ratatoskr.jpg"} alt="MvpGod" className="GodImg rounded" /> <span className="ml-1">lolliepoep</span></h6>
                    {/* <p className="mb-0">A little text describing the game, possibly auto generated.</p> */}
                    <hr />
                    <h5 className="font-weight-bold">Map stats</h5>
                    <hr />
                    <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Phoenixes"} title="Phoenixes" src={require("public/images/Phoenixes.png")} className="" draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{totals?.phoenixesWinner}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.winningTeamID)[0])} <span className="ml-1 mr-1">{totals?.phoenixesLoser}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.losingTeamID)[0])}</h6>
                    <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Towers"} title="Towers" src={require("public/images/Towers.png")} className="" draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{totals?.towersWinner}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.winningTeamID)[0])} <span className="ml-1 mr-1">{totals?.towersLosers}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.losingTeamID)[0])}</h6>
                    <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Firegiants"} title="Firegiants" src={require("public/images/Firegiant2.png")} className="rounded"  draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{totals?.fireGiantsWinner}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.winningTeamID)[0])} <span className="ml-1 mr-1">{totals?.fireGiantsLoser}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.losingTeamID)[0])}</h6>
                    <h6 className="d-flex align-items-center justify-content-left"><b><Img webp width={30} height={30} alt={"Goldfuries"} title="Goldfuries" src={require("public/images/Goldfury2.png")} className="rounded" draggable={false}></Img> taken:</b> <span className="mr-1 ml-1">{totals?.goldFuriesWinner}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID ==MatchResult?.winningTeamID)[0])} <span className="ml-1 mr-1">{totals?.goldFuriesLoser}</span> {RenderTeamImage(teamsInMatch?.filter(t => t.teamID == MatchResult?.losingTeamID)[0])}</h6>
                </Alert>
            </Col>
        </Row>
    );
}