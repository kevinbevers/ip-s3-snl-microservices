//default react imports
import React, { useState } from "react";
//boostrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
//icons
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ScoreTable(props) {
    return (
      <>
        <Row className="mt-4">
          <Col md={1} xl={2}></Col>
          <Col md={10} xl={8} className="">
    <h4 className="text-center font-weight-bold mb-0 p-2 rounded-top TableTitle">Current standing for {props.title}</h4>
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
                <tr>
                  {/* <td>1</td> */}
                  <td className="TeamStanding">1. <img src="https://web2.hirez.com/esports/teams/ssg-70x70.png" alt="SSG" className="LogoStanding" />Spacestation Gaming</td>
                  <td>5</td>
                  <td>5</td>
                  <td>0</td>
                  <td>20</td>
                  <td className="">
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>2</td> */}
                  <td className="TeamStanding">2. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>4</td>
                  <td>1</td>
                  <td>15</td>
                  <td className="">
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>3</td> */}
                  <td className="TeamStanding">3. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>3</td>
                  <td>2</td>
                  <td>12</td>
                  <td className="">
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>4</td> */}
                  <td className="TeamStanding">4. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>3</td>
                  <td>2</td>
                  <td>11</td>
                  <td className="">
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>5</td> */}
                  <td className="TeamStanding">5. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>2</td>
                  <td>3</td>
                  <td>10</td>
                  <td className="">
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>6</td> */}
                  <td className="TeamStanding">6. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>2</td>
                  <td>3</td>
                  <td>6</td>
                  <td className="">
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaCheckCircle color="green" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>7</td> */}
                  <td className="TeamStanding">7. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>1</td>
                  <td>4</td>
                  <td>3</td>
                  <td className="">
                    <FaCheckCircle color="green" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    </td>
                </tr>
                <tr>
                  {/* <td>8</td> */}
                  <td className="TeamStanding">8. <img src="http://via.placeholder.com/70x70" alt="TeamLogo" className="LogoStanding" /> Teamname</td>
                  <td>5</td>
                  <td>0</td>
                  <td>5</td>
                  <td>1</td>
                  <td className="">
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    <FaTimesCircle color="red" className="mr-1"/>
                    </td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
      </>
    );
  }