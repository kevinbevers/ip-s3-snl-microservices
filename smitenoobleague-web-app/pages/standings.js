//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//boostrap components
import {Form, Col, Row, Container, Alert} from "react-bootstrap";
//page imports
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ScoreTable from "src/components/ScoreTable";
//import background component
import FullBackground from "../src/components/FullBackground";
//Auth
import helpers from "utils/helpers";
//services
import standingservice from "services/standingservice";
import scheduleservice from "services/scheduleservice";
import divisionservice from "services/divisionservice";


export default function standings({LoginSession, DivisionList, SchedulesForFirstDivision, CurrentStandingData }) {

  //Divisions for dropdown
  const [Divisions, setDivisions] = useState(DivisionList);
  //Schedules in the dropdown
  const [Schedules, setSchedules] = useState(SchedulesForFirstDivision);
  //Standing
  const [Standing, setStanding] = useState(CurrentStandingData);
  //Select Division
  const [SelectedDivisionName, setSelectedDivisionName] = useState(DivisionList?.length > 0 ? DivisionList[0]?.divisionName : "");
  const [SelectedDivisionID, setSelectedDivisionID] = useState(DivisionList?.length > 0 ? DivisionList[0]?.divisionID : 0);
  const changeDivision = async(evt) => {
    //set the division id
    setSelectedDivisionID(evt.target.value);
    //get division object
    const selectedDivision = Divisions.filter(d => d.divisionID == evt.target.value)[0];
    //set the name
    setSelectedDivisionName(selectedDivision?.divisionName);
    //set currentSchedule
    setSelectedPeriod(selectedDivision?.currentScheduleID);
    //Get all schedules for the selected division
    await scheduleservice.GetListOfSchedulesByDivisionID(evt.target.value)
    .then(res => { setSchedules(res.data);}).catch(err => { setSchedules([{scheduleID: 0, scheduleName: "No schedules"}]);});
    //Get all the schedule divisions for the current schedule
    await standingservice.GetStandingsByScheduleID(selectedDivision.currentScheduleID)
    .then(res => {  setStanding(res.data);}).catch(err => {console.log("hello"); setStanding(null);});
 
  }
  //Select Standing
  const [SelectedPeriod, setSelectedPeriod] = useState(DivisionList?.length > 0 ? DivisionList[0]?.currentScheduleID : 0);
  const changePeriod = async(evt) => {
    setSelectedPeriod(evt.target.value);
    await standingservice.GetStandingsByScheduleID(evt.target.value).then(res => {setStanding(res.data);}).catch(err => {console.log(err); setStanding(null)});
  };

  return (
    <>
      <FullBackground src={"dark_bg"} />
      <NavBar LoginSession={LoginSession}/>
      <Container>
      <Row className="mt-4">
          <Col md={8} xl={6} className="mx-auto">
            <Row>
              <Col md={6} className="mx-auto">
                <Form>
                  <Form.Group controlId="selectDivision">
                    <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                      {Divisions?.length > 0 ? Divisions.map((d, index) => (
                        <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                      )) : <option disabled value={0}>{ "No divisions"}</option>}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6} className="mx-auto">
                <Form>
                  <Form.Group controlId="selectSplit">
                    <Form.Control as="select" custom onChange={changePeriod} value={SelectedPeriod}>
                      {Schedules?.length > 0 ? Schedules.map((s, index) => (          
                        <option key={index} disabled={s.scheduleID == 0 && s.scheduleName == "No schedules"} value={s.scheduleID}>{s.scheduleName}</option>
                      )) : <option disabled value={0}>{"No schedules"}</option>}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
        {Standing != null ? <ScoreTable Title={SelectedDivisionName} StandingData={Standing.standings}/> : <>        
          <Row className="mt-5">
            <Col md={3}></Col>
            <Col md={6} className="d-inline-flex justify-content-center">
              <Alert variant="warning" className="rounded">
              <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No standings found</h3>
              </Alert>
            </Col>
            <Col md={3}></Col>
          </Row>  
        </>}
      
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {

  const loginSessionData = await helpers.GetLoginSession(context.req);

  //Get division names and id and get the currentschedule for the first division in the list
  let listOfDivisions = [];
  let listOfSchedules = [];
  let StandingData = null;

  //Get division data from api
  await divisionservice.GetBasicListOfDivisions().then(res => { listOfDivisions = res.data }).catch(err => {});

  //check if there are divisions, if yes check if the first division has a schedule and get it
  if (listOfDivisions?.length > 0) {
    //get schedule data from api
    await scheduleservice.GetListOfSchedulesByDivisionID(listOfDivisions[0]?.divisionID)
      .then((res) => {
        listOfSchedules = res.data;
      })
      .catch((error) => {
      });


    if (listOfDivisions[0]?.currentScheduleID != null) {
      //get standing data from api
      await standingservice.GetStandingsByScheduleID(listOfDivisions[0]?.currentScheduleID)
        .then((res) => {
          StandingData = res.data;
        })
        .catch((error) => { 
        });
    }
  }

  return {
    props: {
      LoginSession: loginSessionData,
      DivisionList: listOfDivisions.filter(d => d.teamCount != null),
      SchedulesForFirstDivision: listOfSchedules,
      CurrentStandingData: StandingData
    },
  };
}