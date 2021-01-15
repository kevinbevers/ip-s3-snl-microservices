//default react imports
import React, { useState, useEffect } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Container, Form } from "react-bootstrap";
//custom components
import ScheduleItem from "src/components/ScheduleItem";
import ScheduleBlock from "src/components/ScheduleBlock";
//Auth
import helpers from "utils/helpers";
//service
import scheduleservice from "services/scheduleservice";

export default function schedules({ LoginSession, DivisionList, SchedulesForFirstDivision, CurrentScheduleDataForFirstDivision }) {
  //Divisions for dropdown
  const [Divisions, setDivisions] = useState(DivisionList);
  //Schedules in the dropdown
  const [Schedules, setSchedules] = useState(SchedulesForFirstDivision);
  //CurrentSchedule
  const [Schedule, setSchedule] = useState(CurrentScheduleDataForFirstDivision);

  //Select Division
  const [SelectedDivisionID, setSelectedDivisionID] = useState(Divisions[0]?.divisionID);
  const changeDivision = async(evt) => {
    setSelectedDivisionID(evt.target.value);

    const selectedDivision = Divisions.filter(d => d.divisionID == evt.target.value)[0];
    console.log(selectedDivision);
    //Get all schedules for the selected division
    await scheduleservice.GetListOfSchedulesByDivisionID(evt.target.value)
    .then(res => { setSchedules(res.data);}).catch(err => { setSchedules([{scheduleID: 0, scheduleName: "No schedules"}]);});
    //Get all the schedule divisions for the current schedule
    await scheduleservice.GetScheduleDetailsByScheduleID(selectedDivision.currentScheduleID)
    .then(res => {  setSchedule(res.data);}).catch(err => { setSchedule(null);});
 
  }
  //Select Schedule
  const [SelectedPeriod, setSelectedPeriod] = useState(DivisionList[0]?.currentScheduleID);
  const changePeriod = async(evt) => {
    setSelectedPeriod(evt.target.value);
    await scheduleservice.GetScheduleDetailsByScheduleID(evt.target.value).then(res => {  setSchedule(res.data);}).catch(err => {});
  }



  return (
    <>
      <NavBar LoginSession={LoginSession} />
      <Container fluid>
        <Row className="mt-4">
          <Col md={8} xl={4} className="mx-auto">
            <Row>
              <Col md={6} className="mx-auto">
                <Form>
                  <Form.Group controlId="selectDivision">
                    <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                      {Divisions.map((d, index) => (
                        <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6} className="mx-auto">
                <Form>
                  <Form.Group controlId="selectSplit">
                    <Form.Control as="select" custom onChange={changePeriod} value={SelectedPeriod}>
                      {Schedules.map((s, index) => (          
                        <option key={index} disabled={s.scheduleID == 0 && s.scheduleName == "No schedules"} value={s.scheduleID}>{s.scheduleName}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* The interactive current selected schedule */}
        {Schedule != null ? <ScheduleBlock Schedule={Schedule} /> : 
        <>        
          <Row className="mt-5">
            <Col md={3}></Col>
            <Col md={6} className="d-inline-flex justify-content-center">
              <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No active schedule found</h3>
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
  let listOfDivisions = null;
  let listOfSchedules = null;
  let ScheduleData = null;

  //Get division data from api
  await scheduleservice.GetBasicListOfDivisions().then(res => { listOfDivisions = res.data }).catch(err => {setSchedules([{divisionID: 0, divisionName: "No divisions"}]); });

  //check if there are divisions, if yes check if the first division has a schedule and get it
  if (listOfDivisions.length > 0) {
    //get schedule data from api
    await scheduleservice.GetListOfSchedulesByDivisionID(listOfDivisions[0]?.divisionID)
      .then((res) => {
        listOfSchedules = res.data;
      })
      .catch((error) => {
      });


    if (listOfDivisions[0]?.currentScheduleID != null) {
      //get schedule data from api
      await scheduleservice.GetScheduleDetailsByScheduleID(listOfDivisions[0]?.currentScheduleID)
        .then((res) => {
          ScheduleData = res.data;
        })
        .catch((error) => {
        });
    }
  }

  return {
    props: {
      LoginSession: loginSessionData,
      DivisionList: listOfDivisions,
      SchedulesForFirstDivision: listOfSchedules,
      CurrentScheduleDataForFirstDivision: ScheduleData
    },
  };
}