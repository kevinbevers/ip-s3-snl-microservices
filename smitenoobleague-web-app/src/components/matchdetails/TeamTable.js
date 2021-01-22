//boostrap components
import {Row, Col, Table} from "react-bootstrap";
//icons
import { FaBox } from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function TeamTable({playerdata, team}) {

    const RenderTeamImage = (t) => {

        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return (t?.teamLogoPath != null ? <Image height={50} width={50} alt={t?.teamName} src={imagePath} className="TeamLogo" draggable={false}></Image>  : 
        <Img width={50} height={50} alt={t?.teamName} src={require("public/images/teamBadge.png")} className="TeamLogo" draggable={false}></Img>);
      };

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
                            {RenderTeamImage(team)}
                    <h4 className="font-weight-bold my-auto">{team?.teamName}</h4>
                    </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table responsive variant="" className="rounded-bottom text-center" id="TeamTable">
                        <thead className="">
                            <tr className={playerdata[0]?.won ? "bg-success" : "bg-danger"}>
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
                            {playerdata.map((player, index) => ( 
                                <tr className={player?.won ? index%2 ? "table-success2" : "table-success" : index%2 ? "table-danger2" : "table-danger"} key={index}>
                                <td><Image width={30} height={30} src={player?.god?.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
                                    <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + player?.role.roleName + "_Logo.png")}  height={15} width={15} className="mr-1 my-auto"/> {player?.player?.playername}</div></td>
                                    <td>{player?.kills}/{player?.deaths}/{player?.assists}</td>
                                    <td>{player?.damageDealt}</td>
                                    <td>{player?.damageTaken}</td>
                                    <td>{player?.damageMitigated}</td>
                                    <td>{player?.goldEarned}</td>
                                    <td>{player?.gpm}</td>
                                    <td className="">
                                        <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.relic1Icon != null ? player?.relic1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.relic2Icon != null ? player?.relic2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        </div>
                                    </td>
                                    <td className="">
                                        <div className="d-flex align-items-center justify-content-center m-0 p-0">
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item1Icon != null ? player?.item1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item2Icon != null ? player?.item2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item3Icon != null ? player?.item3Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item4Icon != null ? player?.item4Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item5Icon != null ? player?.item5Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item6Icon != null ? player?.item6Icon : "/images/empty_slot.png"} draggable={false}/></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}