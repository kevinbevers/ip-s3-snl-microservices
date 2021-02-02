//default react imports
import React, { useState } from "react";
import Link from "next/link";
//boostrap components
import { Table, Col, Row} from "react-bootstrap";
//custom imports
import ScoreTableEntry from "src/components/ScoreTableEntry";

export default function ScoreTable({Title, StandingData}) {

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
                <ScoreTableEntry key={index} s={s} index={index} />   
              ))}

              </tbody>
            </Table>
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
      </>
    );
  }