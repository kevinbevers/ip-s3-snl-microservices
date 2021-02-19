//default react imports
import React, { useState, useEffect } from "react";
//boostrap components
import {Row, Col, Table} from "react-bootstrap";
//custom components
import TableRow from "src/components/matchdetails/TableRow";
//icons
//import { } from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function TeamTable({playerdata, team}) {

    const [players, setPlayers] = useState([]);

    const RenderTeamImage = (t) => {

        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return (t?.teamLogoPath != null ? <Image height={50} width={50} alt={t?.teamName} src={imagePath} className="TeamLogo" draggable={false}></Image>  : 
        <Img webp width={50} height={50} alt={t?.teamName} src={require("public/images/teamBadge.png")} className="TeamLogo" draggable={false}></Img>);
      };

    const CalculateTeamKills = (players) => {
        let killCount = 0;
    
        players.forEach(p => killCount += p.kills);
    
        return killCount;
      };

      useEffect(() => {
        if (playerdata != null) {
            setPlayers(playerdata);
        }
    }, []);

    return (
        <>
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                            {RenderTeamImage(team)}
                    <h4 className="font-weight-bold my-auto ml-1">{team?.teamName}</h4>
                    </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-lg-5 mb-md-5 mb-xl-5">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table responsive variant="" className="rounded-bottom text-center" id="TeamTable">
                        <thead className="">
                            <tr className={players[0]?.won ? "bg-success" : "bg-danger"}>
                                <th>God</th>
                                <th className="">Player</th>
                                <th className="KDAPadding">K/D/A</th>
                                <th>DMG</th>
                                <th>Taken</th>
                                <th>Mitigated</th>
                                <th>Gold</th>
                                <th>GPM</th>
                                <th>Relics</th>
                                <th>Build</th>
                            </tr>
                        </thead>
                        <tbody>{players.map((player, index) => (<TableRow player={player} key={index} index={index} />))}</tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mb-5 d-block d-sm-none">
                <Col><h6 className="text-muted ExtraInfoText">Hold and swipe to scroll table</h6></Col>
            </Row>
        </>
    );
}