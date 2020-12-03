//boostrap components
import {Row, Col, Table, Image} from "react-bootstrap";
//icons
import { FaBox } from "react-icons/fa";

export default function WinnerTeamTable({playerdata}) {
    return (
        <>
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                    <Image src="https://web2.hirez.com/esports/teams/ghost-70x70.png" className="TeamLogo"/>
                    <h4 className="font-weight-bold my-auto">Ghost Gaming</h4>
                    </Col>
                        <Col md={4} className="TotalKillsTop"><h6 className="font-weight-bold ml-auto mr-3">TOTAL KILLS: 50</h6></Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table responsive variant="" className="rounded-bottom text-center" id="TeamTable">
                        <thead className="">
                            <tr className="bg-danger">
                            <th>God</th>
                                <th>Player</th>
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
                        <tbody>
                            <tr className="table-danger">
                            <td><Image src={playerdata[0].god.godIcon} alt="" className="GodImg" rounded/></td>
                                <td className="">{playerdata[0].player.playername}</td>
                                <td>{playerdata[0].kills}/{playerdata[0].deaths}/{playerdata[0].assists}</td>
                                <td>{playerdata[0].damageDealt}</td>
                                <td>{playerdata[0].damageTaken}</td>
                                <td>{playerdata[0].damageMitigated}</td>
                                <td>{playerdata[0].goldEarned}</td>
                                <td>{playerdata[0].gPM}</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <img src={playerdata[0].relic1Icon} className="mr-1 ItemImg" />
                                        <img src={playerdata[0].relic2Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                    <img src={playerdata[0].item1Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[0].item2Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[0].item3Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[0].item4Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[0].item5Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[0].item6Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-danger2">
                            <td><Image src={playerdata[1].god.godIcon} alt="" className="GodImg" rounded/></td>
                                <td className="">{playerdata[1].player.playername}</td>
                                <td>{playerdata[1].kills}/{playerdata[1].deaths}/{playerdata[1].assists}</td>
                                <td>{playerdata[1].damageDealt}</td>
                                <td>{playerdata[1].damageTaken}</td>
                                <td>{playerdata[1].damageMitigated}</td>
                                <td>{playerdata[1].goldEarned}</td>
                                <td>{playerdata[1].gPM}</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <img src={playerdata[1].relic1Icon} className="mr-1 ItemImg" />
                                        <img src={playerdata[1].relic2Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                    <img src={playerdata[1].item1Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[1].item2Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[1].item3Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[1].item4Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[1].item5Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[1].item6Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-danger">
                            <td><Image src={playerdata[2].god.godIcon} alt="" className="GodImg" rounded/></td>
                                <td className="">{playerdata[2].player.playername}</td>
                                <td>{playerdata[2].kills}/{playerdata[2].deaths}/{playerdata[2].assists}</td>
                                <td>{playerdata[2].damageDealt}</td>
                                <td>{playerdata[2].damageTaken}</td>
                                <td>{playerdata[2].damageMitigated}</td>
                                <td>{playerdata[2].goldEarned}</td>
                                <td>{playerdata[2].gPM}</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <img src={playerdata[2].relic1Icon} className="mr-1 ItemImg" />
                                        <img src={playerdata[2].relic2Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                    <img src={playerdata[2].item1Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[2].item2Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[2].item3Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[2].item4Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[2].item5Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[2].item6Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-danger2">
                            <td><Image src={playerdata[3].god.godIcon} alt="" className="GodImg" rounded/></td>
                                <td className="">{playerdata[3].player.playername}</td>
                                <td>{playerdata[3].kills}/{playerdata[3].deaths}/{playerdata[3].assists}</td>
                                <td>{playerdata[3].damageDealt}</td>
                                <td>{playerdata[3].damageTaken}</td>
                                <td>{playerdata[3].damageMitigated}</td>
                                <td>{playerdata[3].goldEarned}</td>
                                <td>{playerdata[3].gPM}</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <img src={playerdata[3].relic1Icon} className="mr-1 ItemImg" />
                                        <img src={playerdata[3].relic2Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                    <img src={playerdata[3].item1Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[3].item2Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[3].item3Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[3].item4Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[3].item5Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[3].item6Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-danger">
                            <td><Image src={playerdata[4].god.godIcon} alt="" className="GodImg" rounded/></td>
                                <td className="">{playerdata[4].player.playername}</td>
                                <td>{playerdata[4].kills}/{playerdata[4].deaths}/{playerdata[4].assists}</td>
                                <td>{playerdata[4].damageDealt}</td>
                                <td>{playerdata[4].damageTaken}</td>
                                <td>{playerdata[4].damageMitigated}</td>
                                <td>{playerdata[4].goldEarned}</td>
                                <td>{playerdata[4].gPM}</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <img src={playerdata[4].relic1Icon} className="mr-1 ItemImg" />
                                        <img src={playerdata[4].relic2Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                    <img src={playerdata[4].item1Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[4].item2Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[4].item3Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[4].item4Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[4].item5Icon} className="mr-1 ItemImg" />
                                    <img src={playerdata[4].item6Icon} className="mr-1 ItemImg" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                    <h6 className="font-weight-bold my-auto mr-2 ml-3">BANS:</h6>
                    <div className="d-inline-flex my-auto">
                    <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg mr-1" rounded/>
                        <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg mr-1" rounded/>
                        <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg mr-1" rounded/>
                        <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg mr-1" rounded/>
                        <Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg mr-1" rounded/>
                    </div>
                    </Col>
                    <Col md={4} className="TotalGoldBottom"><h6 className="font-weight-bold ml-3 mr-3">TOTAL GOLD: 89000</h6></Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}