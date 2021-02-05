//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit} from "react-icons/fa";
//custom imports
import ManageScheduleListItem from "src/components/managepage/managescheduleListItem";
//API
import scheduleservice from "services/scheduleservice";
import divisionservice from "services/divisionservice";

export default function ManageSchedules({apiToken}) {

    const [modalListShow, setModalListShow] = useState(false);
    const closeListModal = () => {
        setModalListShow(false);
    };

    //Divisions for dropdown
    const [Divisions, setDivisions] = useState([]);
    //Schedules to show
    const [SchedulesToShow, setSchedulesToShow] = useState([]);

    //Select Division
    const [SelectedDivisionID, setSelectedDivisionID] = useState(0);
    const changeDivision = async(evt) => {
      setSelectedDivisionID(evt.target.value);
      //check if the no division is selected or one of the other divisions   
        //Get teams from selected division
        await scheduleservice.GetListOfSchedulesByDivisionID(evt.target.value).then((res) => {setSchedulesToShow(res.data);}).catch((error) => {setSchedulesToShow(null)});

    };

    const openManageSchedule = async() => {

        let listOfDivisions = null;

        await divisionservice.GetBasicListOfDivisions().then(res => {listOfDivisions = res.data; }).catch(err => {});
  
          setDivisions(listOfDivisions);
          //check if there are divisions, if yes check if the first division has teams
          if (listOfDivisions?.length > 0) {
              setSelectedDivisionID(listOfDivisions[0]?.divisionID)
              //get division teams from api
              await scheduleservice.GetListOfSchedulesByDivisionID(listOfDivisions[0]?.divisionID)
              .then((res) => {
                  setSchedulesToShow(res.data);
              })
              .catch((error) => {
              });
          }
  
          setModalListShow(true);
      };

      function RemoveSchedule(id){
        let sched = SchedulesToShow;
        const arr = sched.filter((item) => item.scheduleID !== id);
        setSchedulesToShow(arr);
      };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openManageSchedule} className="btn-block">Manage existing schedules</Button>
            <Modal
            size="lg"
            show={modalListShow}
            onHide={closeListModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Manage existing schedules
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Row className="mb-2">
                    <Col></Col>
                    <Col md={8} xl={6} className="d-flex justify-content-center">
                        <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                            {Divisions?.length > 0 ? Divisions.map((d, index) => (
                            <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                            )) : <option disabled value={0}>{ "No divisions"}</option>}
                        </Form.Control>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col lg={10} xs={12} className="mx-auto">    
                     {SchedulesToShow != null ? <><ListGroup>
                            {SchedulesToShow.map((s, index) => (
                                    <ManageScheduleListItem key={index} apiToken={apiToken} scheduledata={s} removeScheduleFunc={RemoveSchedule} /> 
                                    
                            ))}
                           </ListGroup></> : 
                            <> 
                            <Row className="mt-5">
                                <Col md={8} className="d-inline-flex justify-content-center mx-auto">
                                <Alert variant="warning" className="rounded">
                                <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No schedules found.</h3>
                                </Alert>
                                </Col>
                            </Row> 
                            </>}
                    </Col>
                </Row>
            </Container>
            </Modal.Body>
            </Modal>
        </>
    );
}