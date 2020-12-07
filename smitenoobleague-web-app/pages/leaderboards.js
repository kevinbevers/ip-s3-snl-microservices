//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//boostrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
//custom imports
import LeaderBoardStatCard from "src/components/LeaderboardStatCard";
//chart
import {Pie, Bar} from "react-chartjs-2";

export default function leaderboards() {

  const [Top10Array, setTop10Array] = useState([
    {standing: 1,player: "playername", statvalue: "9999999999"},
    {standing: 2,player: "playername", statvalue: "9999999999"},
    {standing: 3,player: "playername", statvalue: "9999999999"},
    {standing: 4,player: "playername", statvalue: "9999999999"},
    {standing: 5,player: "playername", statvalue: "9999999999"},
    {standing: 6,player: "playername", statvalue: "9999999999"},
    {standing: 7,player: "playername", statvalue: "9999999999"},
    {standing: 8,player: "playername", statvalue: "9999999999"},
    {standing: 9,player: "playername", statvalue: "9999999999"},
    {standing: 10,player: "playername", statvalue: "9999999999"},
  ]); //Init top10array value

  const BarData = {
    labels: ["Playername", "Playername", "Playername", "Playername", "Playername", "Playername", "Playername"],
    datasets: [
      {
        label: "Player KDA",
        backgroundColor: "#EB2602",
        borderColor: "#EB2602",
        borderWidth: 1,
        hoverBackgroundColor: "#EB2602",
        hoverBorderColor: "#EB2602",
        data: [3.5, 4.5, 9.1, 2.7, 6.3, 4, 1.9]
      }
    ]
  };

  const BarOptions = {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                beginAtZero: true,   // minimum value will be 0.
                stepSize: 2
            }
        }]
    }
};

  const data = {
    labels: [
        "Playername",
        "Playername",
        "Playername",
        "Playername",
        "Playername"
    ],
    datasets: [{
        data: [20,20, 20, 10, 40],
        backgroundColor: [
            "#6925E8",
            "#27DBF2",
            "#57DB2D",
            "#F2C027",
            "#EB2602"
        ],
        hoverBackgroundColor: [
            "#6925E8",
            "#27DBF2",
            "#57DB2D",
            "#F2C027",
            "#EB2602"
        ]
    }]
};
// percentage option in tooltip
const options = {
    legend: {
        display: false,
        labels: {
            fontSize: 10,
            fontStyle: "bold",
            fontFamily: "Roboto",
        },
     },
    tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            try {
              let label = " " + data.labels[tooltipItem.index] || "";
    
              if (label) {
                label += ": ";
              }
    
              const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
                return accumulator + curValue;
              });
              const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
    
              label += Number((value / sum) * 100).toFixed(0) + "%";
              return label;
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
  };

  // question#1 should all the data be pulled on page load and drippled down to the components or should each component make it"s own call.
  return (
    <>
      <NavBar />
      <Container fluid className="mt-4">
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
                <LeaderBoardStatCard title={"Kill"} val={Top10Array}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard title={"Assists"} val={Top10Array}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard title={"Damage dealt"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Damage Mitigated"} val={Top10Array}/>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Pie chart of total damage dealt */}
            <Row>
              <Col md={12} className="text-center"><h3>Pie chart of damage</h3></Col>
            </Row>
           <Row className="mb-2">
             <Col>
             <Pie data={data} height={200} options={options}/>
             </Col>
           </Row>

          </Col>
        </Row>

        {/* Second row of stats */}
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
              <LeaderBoardStatCard title={"Kill participation"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Deaths"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Damage taken"} val={Top10Array}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard title={"Healing"} val={Top10Array}/>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Line Chart of stats */}
            <Row>
              <Col md={12} className="text-center"><h3>Chart of stats</h3></Col>
            </Row>
            <Row className="mb-2">
              <Col><Bar data={BarData} height={230} options={BarOptions} /></Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}