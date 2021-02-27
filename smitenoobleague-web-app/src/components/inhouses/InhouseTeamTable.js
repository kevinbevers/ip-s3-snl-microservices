//default react imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
//boostrap components
import {Row, Col, Table} from "react-bootstrap";
//custom components
import InhouseTableRow from "src/components/inhouses/InhouseTableRow";
//icons
//import { } from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';

export default function InhouseTeamTable({playerdata, team}) {

    const [players, setPlayers] = useState([]);

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
                    {team == true ?
                    <><Img webp width={50} height={50} alt={"Order"} src={require("public/images/order.png")} className="TeamLogo" draggable={false}></Img> <h4 className="font-weight-bold my-auto ml-1">Order</h4></> : <><Img webp width={50} height={50} alt={"Chaos"} src={require("public/images/chaos.png")} className="TeamLogo" draggable={false}></Img><h4 className="font-weight-bold my-auto ml-1">Chaos</h4></>}
                      
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
                        <tbody>{players.map((player, index) => (<InhouseTableRow player={player} key={index} index={index} />))}</tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mb-5 d-block d-sm-none">
                <Col><h6 className="text-muted ExtraInfoText">Hold and swipe to scroll table</h6></Col>
            </Row>
        </>
    );
}