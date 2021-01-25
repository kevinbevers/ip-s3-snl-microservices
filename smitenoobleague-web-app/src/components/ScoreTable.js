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

export default function ScoreTable({Title, StandingData}) {

        const RenderTeamImage = (t) => {
                const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
                return (t?.teamLogoPath != null ? <Image height={20} width={20} alt={t?.teamName} title={t?.teamName} src={imagePath} className="LogoStanding" draggable={false}></Image> :
                        <Img webp width={20} height={20} alt={t?.teamName} title={t?.teamName} src={require("public/images/teamBadge.png")} className="LogoStanding" draggable={false}></Img>);
        };

        const ReadableDate = (date) => {
          const d = new Date(date);
          return d.toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        };


    return (
      <>
        <Row className="mt-4">
          <Col md={1} xl={2}></Col>
          <Col md={10} xl={8} xs={12} className="p-1">
    <h4 className="text-center font-weight-bold mb-0 p-2 rounded-top TableTitle">Current standing for {Title}</h4>
            <Table responsive  variant="light" className="rounded-bottom text-center" id="StandingTable">
              <thead className="thead-light TableHeaders">
                <tr>
                  {/* <th></th> */}
                  <th>Team</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Lost</th>
                  <th>Points</th>
                  <th>Recent</th>
                </tr>
              </thead>
              <tbody>
              {StandingData.map((s, index) => (
                  <tr key={index}>
                  {/* <td>1</td> */}
                  <td className=""><span className="d-flex align-items-center">{index + 1}. <span className="mr-1 ml-1 d-flex align-items-center">{RenderTeamImage(s?.team)}</span> {s?.team?.teamName}</span></td>
                  <td>{s?.standingWins + s?.standingLosses}</td>
                  <td>{s?.standingWins}</td>
                  <td>{s?.standingLosses}</td>
                  <td>{s?.standingScore}</td>
                  <td className="">
                    {s.last5Results?.length > 0 ? s.last5Results.map((r, index) => (
                      r.won != null ? r.won ? <Link href={"matchhistory/" + r.matchupID}><FaCheckCircle key={index} title={ReadableDate(r?.datePlayed)} color="green" className="mr-1 Clickable"/></Link> : <Link href={"matchhistory/" + r.matchupID}><FaTimesCircle key={index} title={ReadableDate(r?.datePlayed)} color="red" className="mr-1 Clickable"/></Link> : <FaCircle key={index} color="gray" className="mr-1"/>
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
              ))}

              </tbody>
            </Table>
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
      </>
    );
  }