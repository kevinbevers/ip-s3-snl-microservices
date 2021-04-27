//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit} from "react-icons/fa";
//custom imports
import ManageTeamListItem from "src/components/managepage/manageteamListItem";
import ManageForfeitScheduleBlock from "src/components/managepage/manageforfeitScheduleBlock";
//API
import teamservice from "services/teamservice";
import divisionservice from "services/divisionservice";
import scheduleservice from "services/scheduleservice";

export default function ManageForfeit({apiToken, adminManage}) {

    const [modalListShow, setModalListShow] = useState(false);
    const closeListModal = () => {
        setModalListShow(false);
    };

    //Divisions for dropdown
    const [Divisions, setDivisions] = useState([]);
    //Schedules in the dropdown
    const [Schedules, setSchedules] = useState([]);
    //CurrentSchedule
    const [Schedule, setSchedule] = useState([]);

    //Select Division
    const [SelectedDivisionID, setSelectedDivisionID] = useState(0);
    const changeDivision = async (evt) => {
      setSelectedDivisionID(evt.target.value);

      const selectedDivision = Divisions.filter(d => d.divisionID == evt.target.value)[0];
      //set currentSchedule
      setSelectedPeriod(selectedDivision?.currentScheduleID);
      //Get all schedules for the selected division
      await scheduleservice.GetListOfSchedulesByDivisionID(evt.target.value)
        .then(res => { setSchedules(res.data); }).catch(err => { setSchedules([{ scheduleID: 0, scheduleName: "No schedules" }]); });
      //Get all the schedule divisions for the current schedule
      await scheduleservice.GetScheduleDetailsByScheduleID(selectedDivision.currentScheduleID)
        .then(res => { setSchedule(res.data); }).catch(err => { setSchedule(null); });
    };

      //Select Schedule
  const [SelectedPeriod, setSelectedPeriod] = useState(0);
  const changePeriod = async (evt) => {
    setSelectedPeriod(evt.target.value);
    await scheduleservice.GetScheduleDetailsByScheduleID(evt.target.value).then(res => { setSchedule(res.data); }).catch(err => { setSchedule(null) });
  };

    const openManageTeam = async() => {
        //Add the teams without division
        let listOfDivisions = null;
  
        await divisionservice.GetBasicListOfDivisions().then(res => {listOfDivisions = res.data.filter(d => d.teamCount != null) }).catch(err => {});
  
          if(listOfDivisions?.length > 0)
          {
              setDivisions(listOfDivisions.concat({divisionID: 0, divisionName: "Division-less Teams"}));
          }
  
          //check if there are divisions, if yes check if the first division has teams
          if (listOfDivisions?.length > 0) {
              setSelectedDivisionID(listOfDivisions[0]?.divisionID);
                //get schedule data from api
                await scheduleservice.GetListOfSchedulesByDivisionID(listOfDivisions[0]?.divisionID)
                .then((res) => {
                  setSchedules(res.data);
                })
                .catch((err) => {});
                if (listOfDivisions[0]?.currentScheduleID != null) {
                //get schedule data from api
                await scheduleservice.GetScheduleDetailsByScheduleID(listOfDivisions[0]?.currentScheduleID)
                    .then((res) => {
                    setSchedule(res.data);
                    setModalListShow(true);
                    })
                    .catch((err) => {console.log(err);});
                }
          }
      };

    function updateMatchupScore(matchupID, score) {
      const indexOfMatchup = Schedule.matchups.findIndex(x => x.matchupID == matchupID);
      Schedule.matchups[indexOfMatchup].score = score;
    };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openManageTeam} className="btn-block">Enforce match forfeit</Button>
            <Modal
            size="xl"
            show={modalListShow}
            onHide={closeListModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Enforce match forfeit
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container fluid>
        <Row className="mt-0">
          <Col md={10} xl={10} className="mx-auto">
            <Row>
              <Col md={6} className="mx-auto">
                <Form>
                  <Form.Group controlId="selectDivision">
                    <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                      {Divisions?.length > 0 ? Divisions.map((d, index) => (
                        <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                      )) : <option disabled value={0}>{"No divisions"}</option>}
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
        {/* The interactive current selected schedule */}
        {Schedule != null ? <ManageForfeitScheduleBlock Schedule={Schedule} apiToken={apiToken} updateScore={updateMatchupScore} /> :
          <>
            <Row className="mt-5">
              <Col md={3}></Col>
              <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No active schedule found</h3>
                </Alert>
              </Col>
              <Col md={3}></Col>
            </Row>
          </>}

      </Container>
            </Modal.Body>
            </Modal>
        </>
    );
}