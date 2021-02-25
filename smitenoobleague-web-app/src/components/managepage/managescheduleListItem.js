//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Card, Button, Modal, ListGroup, ListGroupItem, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit} from "react-icons/fa";
//custom imports
import CaptainMatchSubmit from "src/components/captainpage/CaptainMatchSubmit";
import CaptainTeamInfo from "src/components/captainpage/CaptainTeamInfo";
import CaptainTeamManagement from "src/components/captainpage/CaptainTeamManagement";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";
//API
import divisionservice from "services/divisionservice";
import scheduleservice from "services/scheduleservice";


export default function ManageScheduleListItem({apiToken, scheduledata, removeScheduleFunc}) {

    //States
    const [hovering, setHovering] = useState(false);
    const [ModalAreYouSure, setModalAreYouSure] = useState(false);
    const [ModalScheduleShow, setModalScheduleShow] = useState(false);
    const [ScheduleName, setScheduleName] = useState(scheduledata?.scheduleName);
    const [Schedule, setSchedule] = useState(null);
    const [SelectedDate, setSelectedDate] = useState();

    const closeScheduleModal = () => {
        setMsgScheduleInfo("Err Msg.");
        setShowScheduleInfoAlert(false);
        setModalScheduleShow(false);
    };

    const deleteSchedule = async() => {
        await scheduleservice.DeleteScheduleByScheduleID(apiToken, scheduledata.scheduleID).then(res => {removeScheduleFunc(scheduledata.scheduleID); closeScheduleModal();}).catch(err => {console.log(err)});
    };

    const editSchedule = async() => {
        await scheduleservice.GetScheduleDetailsByScheduleID(scheduledata.scheduleID).then(res => { setSchedule(res.data); setModalScheduleShow(true); }).catch(err => {});
    };

    const handleEditSchedule = async() => {
        const updateData = {
            scheduleID: scheduledata?.scheduleID,
            scheduleName: ScheduleName,
            scheduleStartDate: SelectedDate?.format()
        };

        await scheduleservice.UpdateSchedule(apiToken,updateData).then(res => {
            //update in parent
            scheduledata.scheduleName = ScheduleName;
            closeScheduleModal();
        }).catch(err => {
            if(err?.response?.data?.ScheduleName != null)
            {
                setMsgScheduleInfo(err?.response?.data?.ScheduleName[0]);
                setShowScheduleInfoAlert(true);
            }
            else 
            {
                setMsgScheduleInfo(err?.response?.data);
                setShowScheduleInfoAlert(true);
            }
        });

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
            <Row className="mb-1" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <Col lg={11} xs={11} className="mb-0"><ListGroupItem onClick={editSchedule} className="d-flex align-items-center Clickable adminTeamListItem">{scheduledata?.scheduleName} {hovering ? <p className="text-muted ml-auto mb-0">Click to edit</p> : <> </>}</ListGroupItem></Col>
                <Col lg={1} xs={1} className="btn-group p-0">
                    {hovering && adminManage ?
                    <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable" title="Delete division" onClick={() => setModalAreYouSure(true)} /> : <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable d-block d-sm-block d-lg-none" title="Delete division" onClick={() => setModalAreYouSure(true)} /> }
                </Col>
            </Row>
            <Modal
            size={"xl"}
            show={ModalScheduleShow}
            onHide={closeScheduleModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton >
                <Modal.Title className="font-weight-bold">
                Edit schedule info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden defaultValue="stopstupidautocomplete"/>
                <Form.Group>
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                    Schedule name:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter schedule name..." value={ScheduleName} onChange={(e) => setScheduleName(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><ScheduleInfoAlert /></Col></Row>
            <Row>
            <Col md={2} xs={2}><Button variant="danger" className="btn-block" onClick={closeScheduleModal}>Cancel</Button></Col>
                <Col><Button className="btn-block" onClick={handleEditSchedule}>Save changes</Button></Col>
            </Row>
            </Modal.Body>
            </Modal>

            <Modal
            size={"sm"}
            show={ModalAreYouSure}
            onHide={() => setModalAreYouSure(false)}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h6 className="font-weight-bold">Are you sure you want to delete: <br/><br/> {scheduledata?.scheduleName}</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
              <Row>
                  <Col className="justify-content-end d-flex p-auto">
                      <Button variant="primary" className="mr-2 font-weight-bold" onClick={() => setModalAreYouSure(false)}>
                          Cancel
                      </Button>

                      <Button className="font-weight-bold" onClick={deleteSchedule} variant="danger">
                          Delete schedule
                      </Button>
                  </Col>
              </Row>
              </Modal.Body>
            </Modal>
        </>
    );
}