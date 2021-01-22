//boostrap components
import {Row, Col, Table} from "react-bootstrap";
//icons
import { FaBox } from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function WinnerTeamTable({playerdata, team}) {

    const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + team?.teamLogoPath;

    const CalculateTeamKills = (players) => {
        let killCount = 0;
    
        players.forEach(p => killCount += p.kills);
    
        return killCount;
      };


    return (
        <>
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                        {team?.teamLogoPath != null ? <Image height={50} width={50} alt={team?.teamName} src={imagePath} className="TeamLogo" draggable={false}></Image>  : 
                        <Img width={50} height={50} alt={team?.teamName} src={require("public/images/teamBadge.png")} className="TeamLogo" draggable={false}></Img>
                      }
                    <h4 className="font-weight-bold my-auto">{team?.teamName}</h4>
                    </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table responsive variant="" className="rounded-bottom text-center" id="TeamTable">
                        <thead className="">
                            <tr className="bg-success">
                                <th>God</th>
                                <th className="KDAPadding">Player</th>
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
                            <td><Image width={30} height={30} src={playerdata[0]?.god?.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
                                <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + playerdata[0]?.role.roleName + "_Logo.png")}  height={15} width={15} className="mr-1 my-auto"/> {playerdata[0]?.player?.playername}</div></td>
                                <td>{playerdata[0]?.kills}/{playerdata[0]?.deaths}/{playerdata[0]?.assists}</td>
                                <td>{playerdata[0]?.damageDealt}</td>
                                <td>{playerdata[0]?.damageTaken}</td>
                                <td>{playerdata[0]?.damageMitigated}</td>
                                <td>{playerdata[0]?.goldEarned}</td>
                                <td>{playerdata[0]?.gpm}</td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.relic1Icon != null ? playerdata[0]?.relic1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.relic2Icon != null ? playerdata[0]?.relic2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.item1Icon != null ? playerdata[0]?.item1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.item2Icon != null ? playerdata[0]?.item2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.item3Icon != null ? playerdata[0]?.item3Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.item4Icon != null ? playerdata[0]?.item4Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.item5Icon != null ? playerdata[0]?.item5Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[0]?.item6Icon != null ? playerdata[0]?.item6Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success2">
                            <td><Image width={30} height={30} src={playerdata[1]?.god?.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
                            <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + playerdata[1]?.role.roleName + "_Logo.png")}  height={15} width={15} className="mr-1 my-auto"/> {playerdata[1]?.player?.playername}</div></td>
                                <td>{playerdata[1]?.kills}/{playerdata[1]?.deaths}/{playerdata[1]?.assists}</td>
                                <td>{playerdata[1]?.damageDealt}</td>
                                <td>{playerdata[1]?.damageTaken}</td>
                                <td>{playerdata[1]?.damageMitigated}</td>
                                <td>{playerdata[1]?.goldEarned}</td>
                                <td>{playerdata[1]?.gpm}</td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <img src={playerdata[1]?.relic1Icon} className="mr-1 ItemImg" draggable={false}/>
                                        <img src={playerdata[1]?.relic2Icon} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                                <td className="text-left">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[1]?.item1Icon != null ? playerdata[1]?.item1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[1]?.item2Icon != null ? playerdata[1]?.item2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[1]?.item3Icon != null ? playerdata[1]?.item3Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[1]?.item4Icon != null ? playerdata[1]?.item4Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[1]?.item5Icon != null ? playerdata[1]?.item5Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={playerdata[1]?.item6Icon != null ? playerdata[1]?.item6Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success">
                            <td><Image width={30} height={30} src={playerdata[2]?.god?.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
                            <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + playerdata[2]?.role.roleName + "_Logo.png")}  height={15} width={15} className="mr-1 my-auto"/> {playerdata[2]?.player?.playername}</div></td>
                                <td>{playerdata[2]?.kills}/{playerdata[2]?.deaths}/{playerdata[2]?.assists}</td>
                                <td>{playerdata[2]?.damageDealt}</td>
                                <td>{playerdata[2]?.damageTaken}</td>
                                <td>{playerdata[2]?.damageMitigated}</td>
                                <td>{playerdata[2]?.goldEarned}</td>
                                <td>{playerdata[2]?.gpm}</td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <img src={playerdata[2]?.relic1Icon} className="mr-1 ItemImg" draggable={false}/>
                                        <img src={playerdata[2]?.relic2Icon} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                    <img src={playerdata[2]?.item1Icon != null ? playerdata[2]?.item1Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[2]?.item2Icon != null ? playerdata[2]?.item2Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[2]?.item3Icon != null ? playerdata[2]?.item3Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[2]?.item4Icon != null ? playerdata[2]?.item4Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[2]?.item5Icon != null ? playerdata[2]?.item5Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[2]?.item6Icon != null ? playerdata[2]?.item6Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success2">
                            <td><Image width={30} height={30} src={playerdata[3]?.god.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
                            <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + playerdata[3]?.role.roleName + "_Logo.png")}  height={15} width={15} className="mr-1 my-auto"/> {playerdata[3]?.player?.playername}</div></td>
                                <td>{playerdata[3]?.kills}/{playerdata[3]?.deaths}/{playerdata[3]?.assists}</td>
                                <td>{playerdata[3]?.damageDealt}</td>
                                <td>{playerdata[3]?.damageTaken}</td>
                                <td>{playerdata[3]?.damageMitigated}</td>
                                <td>{playerdata[3]?.goldEarned}</td>
                                <td>{playerdata[3]?.gpm}</td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <img src={playerdata[3]?.relic1Icon} className="mr-1 ItemImg" draggable={false}/>
                                        <img src={playerdata[3]?.relic2Icon} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                    <img src={playerdata[3]?.item1Icon != null ? playerdata[3]?.item1Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[3]?.item2Icon != null ? playerdata[3]?.item2Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[3]?.item3Icon != null ? playerdata[3]?.item3Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[3]?.item4Icon != null ? playerdata[3]?.item4Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[3]?.item5Icon != null ? playerdata[3]?.item5Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[3]?.item6Icon != null ? playerdata[3]?.item6Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-success">
                            <td><Image width={30} height={30} src={playerdata[4]?.god?.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
                            <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + playerdata[4]?.role.roleName + "_Logo.png")} height={15} width={15} className="mr-1 my-auto"/> {playerdata[4]?.player?.playername}</div></td>
                                <td>{playerdata[4]?.kills}/{playerdata[4]?.deaths}/{playerdata[4].assists}</td>
                                <td>{playerdata[4]?.damageDealt}</td>
                                <td>{playerdata[4]?.damageTaken}</td>
                                <td>{playerdata[4]?.damageMitigated}</td>
                                <td>{playerdata[4]?.goldEarned}</td>
                                <td>{playerdata[4]?.gpm}</td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                        <img src={playerdata[4]?.relic1Icon} className="mr-1 ItemImg" draggable={false}/>
                                        <img src={playerdata[4]?.relic2Icon} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                    <img src={playerdata[4]?.item1Icon != null ? playerdata[4]?.item1Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[4]?.item2Icon != null ? playerdata[4]?.item2Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[4]?.item3Icon != null ? playerdata[4]?.item3Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[4]?.item4Icon != null ? playerdata[4]?.item4Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[4]?.item5Icon != null ? playerdata[4]?.item5Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    <img src={playerdata[4]?.item6Icon != null ? playerdata[4]?.item6Icon : "/images/empty_slot.png"} className="mr-1 ItemImg" draggable={false}/>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}