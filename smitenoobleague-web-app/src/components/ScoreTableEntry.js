//default react imports
import React, { useState } from "react";
import Link from "next/link";
//boostrap components
import { Table, Col, Row} from "react-bootstrap";
//icons
import { FaCheckCircle, FaTimesCircle, FaCircle } from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

const RenderTeamImage = (t) => {
    const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
    return (t?.teamLogoPath != null ? <Image height={20} width={20} alt={t?.teamName} title={t?.teamName} src={imagePath} className="LogoStanding" draggable={false}></Image> :
            <Img webp width={20} height={20} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="LogoStanding" draggable={false}></Img>);
};

const ReadableDate = (date) => {
const d = new Date(date);
return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

export default function ScoreTableEntry({s,index}) {

    return (
        <tr>
        {/* <td>1</td> */}
        <td className=""><span className="d-flex align-items-center">{index + 1}. <span className="mr-1 ml-1 d-flex align-items-center">{RenderTeamImage(s?.team)}</span> {s?.team?.teamName}</span></td>
        <td>{s?.standingWins + s?.standingLosses}</td>
        <td>{s?.standingWins}</td>
        <td>{s?.standingLosses}</td>
        <td>{s?.standingScore}</td>
        <td className="">
          {s.last5Results?.length > 0 ? s.last5Results.map((r, index) => (
            r.won != null ? r.won ? <Link key={index} href={"/matchhistory/" + r.matchupID}><a><FaCheckCircle title={ReadableDate(r?.datePlayed)} color="green" className="mr-1 Clickable"/></a></Link> : <Link key={index} href={"/matchhistory/" + r.matchupID}><a><FaTimesCircle title={ReadableDate(r?.datePlayed)} color="red" className="mr-1 Clickable"/></a></Link> : <FaCircle key={index} color="gray" className="mr-1"/>
          )) : 
          <>
            <FaCircle color="gray" className="mr-1"/>
            <FaCircle color="gray" className="mr-1"/>
            <FaCircle color="gray" className="mr-1"/>
            <FaCircle color="gray" className="mr-1"/>
            <FaCircle color="gray" className="mr-1"/> 
          </>}
          </td>
      </tr>  
    );
}