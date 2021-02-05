//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert, InputGroup, FormControl} from "react-bootstrap";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
//custom imports
//API
import divisionservice from "services/divisionservice"
import scheduleservice from "services/scheduleservice";

export default function CreateSchedule({apiToken}) {

    const [modalCreateShow, setModalCreateShow] = useState(false);

    const [ScheduleName, setScheduleName] = useState("");
    const [SelectedDate, setSelectedDate] = useState();
    //Divisions for dropdown
    const [Divisions, setDivisions] = useState([]);
    //Select Division
    const [SelectedDivisionID, setSelectedDivisionID] = useState(0);
    const changeDivision = async(evt) => {
      setSelectedDivisionID(evt.target.value);
    };

    const closeScheduleCreateModal = () => {
        setScheduleName("");
        setMsgScheduleInfo(""); 
        setSelectedDate(null);
        setShowScheduleInfoAlert(false);
        setModalCreateShow(false);
    };

    const createSchedule = async() => {
        const data = {
            divisionID: Number(SelectedDivisionID),
            scheduleName: ScheduleName,
            scheduleStartDate: SelectedDate?.format()
        };

        await scheduleservice.CreateSchedule(apiToken, data).then(res => {closeScheduleCreateModal();}).catch(err => {
            if(err?.response?.data?.ScheduleName != null)
            {
                setMsgScheduleInfo(err?.response?.data?.ScheduleName[0]); 
                setShowScheduleInfoAlert(true);
            }
            else if(err?.response?.data?.ScheduleStartDate != null)
            {
                setMsgScheduleInfo(err?.response?.data?.ScheduleStartDate[0]); 
                setShowScheduleInfoAlert(true);
            }
            else {
            setMsgScheduleInfo(err?.response?.data); 
            setShowScheduleInfoAlert(true);
            }
        });
    };

    const openCreateSchedule = async() => {
        //Add the teams without division
  
        await divisionservice.GetBasicListOfDivisions().then(res => {
            setDivisions(res.data);
            if(res.data?.length > 0)
            {
                setSelectedDivisionID(res.data[0].divisionID);
            }
            setModalCreateShow(true); 
        }).catch(err => {});
      };

    //disable all dates that are before today
    const valid = (current) =>{
        let d = new Date();
        d.setDate(d.getDate() - 1);
        return current.isAfter(d);
    };
    
            //#region errorMsg
            const [msgScheduleInfo, setMsgScheduleInfo] = useState("Error msg");
            const [showScheduleInfoAlert, setShowScheduleInfoAlert] = useState(false);
            function ScheduleInfoAlert() {
                if (showScheduleInfoAlert) {
                    return (
                        <Alert className="" variant="danger" onClose={() => setShowScheduleInfoAlert(false)} dismissible data-testid="captainPageTeamAlert">
                            <p className="my-auto" data-testid="captainPageTeamAlertText">
                                {msgScheduleInfo}
                            </p>
                        </Alert>
                    );
                }
                return <> </>;
            };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openCreateSchedule} className="btn-block">Create new schedule</Button>
            <Modal
            size="lg"
            show={modalCreateShow}
            onHide={closeScheduleCreateModal}
            aria-labelledby="create-division-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Create new schedule
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden defaultValue="stopstupidautocomplete"/>
                <Form.Group>
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                    Schedule division:
                    </Form.Label>
                    <Col>
                    <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                            {Divisions?.length > 0 ? Divisions.map((d, index) => (
                            <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                            )) : <option disabled value={0}>{ "No divisions"}</option>}
                        </Form.Control>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                    Schedule name:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter schedule name..." value={ScheduleName} onChange={(e) => setScheduleName(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                <Form.Label column lg={3} className="font-weight-bold">
                    Schedule start date:
                    </Form.Label>
                    <Col>
                        <Datetime utc isValidDate={valid} locale={"en"}  timeFormat={"HH:mm"} value={SelectedDate} onChange={(e) => setSelectedDate(e)}/>
                    </Col>
                </Form.Row>
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><ScheduleInfoAlert /></Col></Row>
            <Row>
                <Col><Button className="btn-block" onClick={createSchedule}>Create schedule</Button></Col>
            </Row>
            </Modal.Body>
            </Modal>
        </>
    );
}