//default react imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DefaultErrorPage from "next/error";
import nookies from "nookies";
import { parseCookies, setCookie, destroyCookie } from "nookies";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//boostrap components
import {Container, Row, Col, Alert, Form, FormControl} from "react-bootstrap";
//custom imports
import LeaderBoardStatCard from "src/components/LeaderboardStatCard";
//chart
import {Pie, Bar} from "react-chartjs-2";
//Auth
import helpers from "utils/helpers";
//services
import leaderboardservice from "services/leaderboardservice";
import divisionservice from "services/divisionservice";
import { RiNurseFill } from "react-icons/ri";


export default function leaderboards({LoginSession, Data, status, errMsg, DivisionList, selectedDiv }) {
        //Divisions for dropdown
        const [Divisions, setDivisions] = useState(DivisionList);
        const [LeaderboardData, setLeaderboardData] = useState(Data);
        const [TopDamageLabels, setTopDamageLabels] = useState([]);
        const [TopDamageData, setTopDamageData] = useState([]);
        const [Top5KdaLabels, setTop5KdaLabels] = useState([]);
        const [Top5KdaData, setTop5KdaData] = useState([]);
        //Select Division
        const [SelectedDivisionID, setSelectedDivisionID] = useState(selectedDiv);
        const changeDivision = async(evt) => {
          setSelectedDivisionID(evt.target.value);
          setCookie(null, 'selected_division', evt.target.value, {path: "/"});
          //check if the no division is selected or one of the other divisions
          if(evt.target.value == 0)
          {
            await leaderboardservice.GetLeaderboardData(null).then(res => { setLeaderboardData(res.data); updateGraphs(res.data); }).catch(err => { setLeaderboardData(null); });
          }
          else 
          {         
            //Get teams from selected division
            await leaderboardservice.GetLeaderboardData(evt.target.value).then(res => { if(res.data?.kills?.length == 0) {setLeaderboardData(null);} else {setLeaderboardData(res.data); updateGraphs(res.data);}  }).catch(err => { setLeaderboardData(null); });
          }
    
        };


        const updateGraphs = async(data) => {

                    //local temp variables
                    let tdmgl = [];
                    let tdmgd = [];
                    let t5kl = [];
                    let t5kd = [];
                    //get the data and labels for the graphs and push them into the local variables
                    data?.top10DamageAndRemainingInPercentage?.forEach(x => {
                      tdmgl.push(x?.player?.playername);
                      tdmgd.push(x?.score);
                      console.log(x?.score);
                    });
                    data?.top5KdaPlayers?.forEach(x => {
                      t5kl.push(x?.player?.playername);
                      t5kd.push(x?.score);
                    });
                    //update the states with the local variables
                    setTopDamageLabels(tdmgl);
                    setTopDamageData(tdmgd);
                    setTop5KdaLabels(t5kl);
                    setTop5KdaData(t5kd);
        };

        useEffect(() => {  
          if(Divisions?.length > 0)
          {
            if(!Divisions.includes(x => x.divisionID == 0))
            {
              setDivisions(Divisions.concat({divisionID: 0, divisionName: "All divisions"}));
            }
          }
          updateGraphs(LeaderboardData);
      }, []);

  let BarData = {
    labels: Top5KdaLabels,
    datasets: [
      {
        label: "Player KDA",
        backgroundColor: "#EB2602",
        borderColor: "#EB2602",
        borderWidth: 1,
        hoverBackgroundColor: "#EB2602",
        hoverBorderColor: "#EB2602",
        data: Top5KdaData
      }
    ]
  };

  let BarOptions = {
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
    labels: TopDamageLabels,
    datasets: [{
        data: TopDamageData,
        backgroundColor: [
            "#6925E8",
            "#27DBF2",
            "#57DB2D",
            "#F2C027",
            "#EB2602",
            "#ff9a00",
            "#052F5F",
            "#005377",
            "#06A77D",
            "#F1A208",
            "#9B287B",
            "#BB342F",
        ],
        hoverBackgroundColor: [
          "#6925E8",
          "#27DBF2",
          "#57DB2D",
          "#F2C027",
          "#EB2602",
          "#ff9a00",
          "#052F5F",
          "#005377",
          "#06A77D",
          "#F1A208",
          "#9B287B",
          "#BB342F",
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
    
              label += Number((value).toFixed(2)) + "%";
              return label;
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
  };
  if (status != null && status != 404) {
    return (<><DefaultErrorPage statusCode={status} title={errMsg} data-testid="playerpageErrorPage" /></>);
  }
  else {
  return (
    <>
      <NavBar LoginSession={LoginSession}/>
      <Container fluid className="mt-2">
        {status == 404 ? <><Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">Not enough data available for leaderboards</h3>
                </Alert> 
                </Col>
                <Col md={3}></Col>
              </Row> </> : <>
              <Row>
          <Col></Col>
          <Col md={4} xl={3} className="d-flex justify-content-center">
              <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                {Divisions?.length > 0 ? Divisions.map((d, index) => (
                  <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                )) : <option disabled value={0}>{ "No divisions"}</option>}
              </Form.Control>
          </Col>
          <Col></Col>
        </Row>
        {LeaderboardData != null ? <>
        <Row>
          <Col md={9}>
            <Row>
              <Col md={3}>
                <LeaderBoardStatCard Title={"Kills"} Stat={LeaderboardData?.kills}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard Title={"Assists"} Stat={LeaderboardData?.assists}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard Title={"Damage Dealt per minute"} Stat={LeaderboardData?.damageDealt}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard Title={"Damage Mitigated per minute"} Stat={LeaderboardData?.damageMitigated}/>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Pie chart of total damage dealt */}
            <Row>
              <Col md={12} className="text-center"><h6 className="font-weight-bold mt-2 p-3">Top 10 Damage dealers, compared to the rest</h6></Col>
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
                <LeaderBoardStatCard Title={"Kill participation"} Stat={LeaderboardData?.killParticipation} Percentage={"%"}/>
              </Col>

              <Col md={3}>
               <LeaderBoardStatCard Title={"Deaths"} Stat={LeaderboardData?.deaths}/>
              </Col>

              <Col md={3}>
              <LeaderBoardStatCard Title={"Damage taken per minute"} Stat={LeaderboardData?.damageTaken}/>
              </Col>

              <Col md={3}>
                <LeaderBoardStatCard Title={"Healing per minute"} Stat={LeaderboardData?.healing}/>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            {/* Line Chart of stats */}
            <Row>
              <Col md={12} className="text-center"><h6 className="font-weight-bold">Top 5 highest KDA players</h6></Col>
            </Row>
            <Row className="mb-2">
              <Col><Bar data={BarData} height={230} options={BarOptions} /></Col>
            </Row>
          </Col>
        </Row> 
        </> : 
        <Row className="mt-5">
        <Col md={3}></Col>
        <Col md={6} className="d-inline-flex justify-content-center">
        <Alert variant="warning" className="rounded">
          <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">Not enough data available for leaderboards</h3>
        </Alert> 
        </Col>
        <Col md={3}></Col>
      </Row>
      }
        </>}
      </Container>
      <Footer />
    </>
  );
  }
}

export async function getServerSideProps(context) {
  //parse cookies
  const cookies = nookies.get(context);

  const loginSessionData = await helpers.GetLoginSession(context.req);

  //object to fill
  let response = { data: null, statusCode: null, errMsg: null };

    //Get division names and id and get the list of teams for the first division in the list
    let listOfDivisions = [];
    //Get division data from api
    await divisionservice.GetBasicListOfDivisions().then(res => { listOfDivisions = res.data.filter(d => d.teamCount != null) }).catch(err => {});
    
    //check if there are divisions, if yes check if the first division has teams
    if (listOfDivisions?.length > 0) {

      if(cookies['selected_division'] == 0)
      {
        nookies.set(context, 'selected_division', 0, {path: "/"});
          //call api for the data
          await leaderboardservice.GetLeaderboardData(null)
            .then(res => { response.data = res.data;})
            .catch(err => {
              if (err.response == null) {
                response.statusCode = 503;
                response.errMsg = "SNL API unavailable";
              }
              else {
                response.statusCode = JSON.stringify(err?.response?.status);
                response.errMsg = err?.response?.data;
              }
            });
      }
      else {

      if (cookies != null && cookies['selected_division'] != undefined && listOfDivisions.filter(x => x.divisionID == cookies['selected_division']).length != 0) {
          //call api for the data
          await leaderboardservice.GetLeaderboardData(cookies['selected_division'])
            .then(res => { if(res.data?.kills?.length == 0) {response.data = null} else { response.data = res.data;} })
            .catch(err => {
              if (err.response == null) {
                response.statusCode = 503;
                response.errMsg = "SNL API unavailable";
              }
              else {
                response.statusCode = JSON.stringify(err?.response?.status);
                response.errMsg = err?.response?.data;
              }
            });
        }
        else {
          nookies.set(context, 'selected_division', 0, {path: "/"});
          //call api for the data
          await leaderboardservice.GetLeaderboardData(null)
            .then(res => { if(res.data?.kills?.length == 0) {response.data = null} else { response.data = res.data;} })
            .catch(err => {
              if (err.response == null) {
                response.statusCode = 503;
                response.errMsg = "SNL API unavailable";
              }
              else {
                response.statusCode = JSON.stringify(err?.response?.status);
                response.errMsg = err?.response?.data;
              }
            });
        }
      }
    }

  return {
    props: {
      LoginSession: loginSessionData,
      Data: response.data,
      status: response.statusCode,
      errMsg: response.errMsg,
      DivisionList: listOfDivisions != [] ? listOfDivisions : [{divisionID: 0, divisionName: "All divisions"}],
      selectedDiv: cookies['selected_division'] != undefined ? cookies['selected_division'] : 0
    },
  };
}