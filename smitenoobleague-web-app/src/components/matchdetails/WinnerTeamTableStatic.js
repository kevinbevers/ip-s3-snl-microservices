//boostrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
//icons
import { FaBox } from 'react-icons/fa';

export default function WinnerTeamTable() {
    return (
        <>
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                    <Image src="https://web2.hirez.com/esports/teams/ssg-70x70.png" className="TeamLogo"/>
                    <h4 className="font-weight-bold my-auto">Spacestation Gaming</h4>
                    </Col>
                        <Col md={4} className="TotalKillsTop"><h6 className="font-weight-bold ml-auto mr-3">TOTAL KILLS: 50</h6></Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table responsive variant='' className='rounded-bottom text-center' id="TeamTable">
                        <thead className="">
                            <tr className="bg-success">
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
                            <tr className="table-success">
                            <td><Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg" rounded/></td>
                                <td className="">lolliepoep</td>
                                <td>10 / 2 / 3</td>
                                <td>23000</td>
                                <td>12000</td>
                                <td>8230</td>
                                <td>15000</td>
                                <td>670</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success2">
                            <td><Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg" rounded/></td>
                                <td className="">lolliepoep</td>
                                <td>10 / 2 / 3</td>
                                <td>23000</td>
                                <td>12000</td>
                                <td>8230</td>
                                <td>15000</td>
                                <td>670</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success">
                            <td><Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg" rounded/></td>
                                <td className="">lolliepoep</td>
                                <td>10 / 2 / 3</td>
                                <td>23000</td>
                                <td>12000</td>
                                <td>8230</td>
                                <td>15000</td>
                                <td>670</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success2">
                            <td><Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg" rounded/></td>
                                <td className="">lolliepoep</td>
                                <td>10 / 2 / 3</td>
                                <td>23000</td>
                                <td>12000</td>
                                <td>8230</td>
                                <td>15000</td>
                                <td>670</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success">
                            <td><Image src="https://static.smite.guru/i/champions/icons/ratatoskr.jpg" alt="" className="GodImg" rounded/></td>
                                <td className="">lolliepoep</td>
                                <td>10 / 2 / 3</td>
                                <td>23000</td>
                                <td>12000</td>
                                <td>8230</td>
                                <td>15000</td>
                                <td>670</td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-inline-flex">
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
                                        <FaBox className="mr-1" />
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