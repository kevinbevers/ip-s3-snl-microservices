
//default react imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
//boostrap components
import { OverlayTrigger, Tooltip, Row, Col, Table, Button, Badge} from "react-bootstrap";
//icons
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function TableRow({player, index}) {

    const [showExtraStats, setShowExtraStats] = useState(false);
    const toggleExtraStats = () => {setShowExtraStats(!showExtraStats)};

    return ( <>
        <tr className={player?.won ? index%2 ? "table-success2" : "table-success" : index%2 ? "table-danger2" : "table-danger"}>
        <td className="d-flex align-items-center justify-content-center">{showExtraStats ? <FaAngleUp className="mr-1 Clickable"onClick={toggleExtraStats}/> : <FaAngleDown  className="mr-1 Clickable"onClick={toggleExtraStats}/> } <Image priority={true} width={30} height={30} src={player?.god?.godIcon} alt={player?.god?.godName} title={player?.god?.godName} className="GodImg rounded" draggable={false}/></td>
            <td className=""><div className="d-flex align-items-center text-left"><Img webp src={require("public/images/roles/" + player?.role?.roleName + "_Logo.png")} title={player?.role?.roleName} alt={player?.role?.roleName}  height={15} width={15} className="mr-1 my-auto" draggable={false}/> 
            {player?.playerIsFill == false ? <Link href={`/stats/player/${player?.player?.playerID}`}><span className="Clickable Hoverable" title={"click to see player stats"}>{player?.player?.playername}</span></Link> : <span>{player?.player?.playername}</span>} {player?.playerIsFill ? <Badge variant="secondary" className="my-auto ml-1">Sub</Badge> : <></>}</div></td>
            <td>{player?.kills}/{player?.deaths}/{player?.assists}</td>
            <td>{player?.damageDealt}</td>
            <td>{player?.damageTaken}</td>
            <td>{player?.damageMitigated}</td>
            <td>{player?.goldEarned}</td>
            <td>{player?.gpm}</td>
            <td className="">
                <div className="d-flex align-items-center justify-content-center m-0 p-0">
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.relic1Name} title={player?.relic1Name} src={player?.relic1Icon != null ? player?.relic1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"}  alt={player?.relic2Name} title={player?.relic2Name} src={player?.relic2Icon != null ? player?.relic2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                </div>
            </td>
            <td className="">
                <div className="d-flex align-items-center justify-content-center m-0 p-0">
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.item1Name} title={player?.item1Name} src={player?.item1Icon != null ? player?.item1Icon : "/images/empty_slot.png"} draggable={false}/></div>
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.item2Name} title={player?.item2Name} src={player?.item2Icon != null ? player?.item2Icon : "/images/empty_slot.png"} draggable={false}/></div>
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.item3Name} title={player?.item3Name} src={player?.item3Icon != null ? player?.item3Icon : "/images/empty_slot.png"} draggable={false}/></div>
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.item4Name} title={player?.item4Name} src={player?.item4Icon != null ? player?.item4Icon : "/images/empty_slot.png"} draggable={false}/></div>
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.item5Name} title={player?.item5Name} src={player?.item5Icon != null ? player?.item5Icon : "/images/empty_slot.png"} draggable={false}/></div>
                    <div className="ItemImg mr-1 position-relative"><Image loading={"eager"} layout={"fill"} alt={player?.item6Name} title={player?.item6Name} src={player?.item6Icon != null ? player?.item6Icon : "/images/empty_slot.png"} draggable={false}/></div>
                </div>
            </td>  
        </tr>
        {showExtraStats ?<tr className={player?.won ? index%2 ? "table-success2" : "table-success" : index%2 ? "table-danger2" : "table-danger"}>
            <td colSpan="10" className="text-left"><b className="ml-1">Level: </b>{player?.level} <b className="ml-1">Wards placed: </b>{player?.wardsPlaced} <b className="ml-1">Structure dmg: </b>{player?.structureDamage} <b className="ml-1">Healing: </b>{player?.healing} <b className="ml-1">Time spent death: </b>{Math.floor(player?.timeSpentDeathInSeconds / 60)}m {player?.timeSpentDeathInSeconds % 60}s <b className="ml-1">Highest spree: </b>{player?.killingSpree} kills</td>
        </tr> : <></>}
    </>
    );
}