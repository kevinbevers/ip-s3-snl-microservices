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
import teamservice from "services/teamservice";


export default function ManageDivisionListItem({apiToken, divisiondata, removeDivFunc}) {

    //States
    const [hovering, setHovering] = useState(false);
    const [ModalAreYouSure, setModalAreYouSure] = useState(false);
    const [ModalDivisionShow, setModalDivisionShow] = useState(false);
    const [DivisionName, setDivisionName] = useState(divisiondata?.divisionName);
    const [Teams, setTeams] = useState(null);
    const [SelectedTeams, setSelectedTeams] = useState([]);

    const handleTeamListChange = (evt) => {
       //evt.target.checked
       //evt.target.value
        if(SelectedTeams?.length > 7 && evt.target.checked)
        {
            //show that 8 teams are selected
            setMsgDivisionInfo("Only 8 teams can be in a division.");
            setShowDivisionInfoAlert(true);
            event.target.checked = false;
        }
        else 
        {
            if(evt.target.checked)
            {
                //add to selected teams
                const valueAsNumber = Number(evt.target.value);
                setSelectedTeams([...SelectedTeams, valueAsNumber]);
            }
            else 
            {
                //Remove from selected teams
                let sel = SelectedTeams;
                const arr = sel.filter(item => item != evt.target.value);
                setSelectedTeams(arr);
            }
        }
    };

    const closeDivisionModal = () => {
        setMsgDivisionInfo("Err Msg.");
        setShowDivisionInfoAlert(false);
        setModalDivisionShow(false);
    };

    const deleteDivision = async() => {
        await divisionservice.DeleteDivisionByID(apiToken,divisiondata.divisionID).then(res => {removeDivFunc(divisiondata.divisionID)}).catch(err => {});
    };

    const editDivision = async() => {
        await teamservice.GetAllTeams().then(res => {
            setTeams(res.data); 
            const selectedTeamIds = res.data?.filter(x => x.divisionID == divisiondata.divisionID).map(x => x.teamID);
        setSelectedTeams(selectedTeamIds); }).catch(err => {});
        setModalDivisionShow(true);
    };

    const handleEditDivision = async() => {

        const updateData = {
            divisionID: divisiondata?.divisionID,
            divisionName: DivisionName
        };

        await divisionservice.UpdateDivision(apiToken,updateData).then(res => {
            //update in parent
            divisiondata.divisionName = DivisionName;
            //Set division teams
            const data = {
                divisionID: divisiondata?.divisionID,
                teamIdList: SelectedTeams
              };
             teamservice.SetTeamsDivision(apiToken,data).then(res => {closeDivisionModal();}).catch(err => {
                setMsgDivisionInfo(err?.response?.data);
                setShowDivisionInfoAlert(true);
            });
        }).catch(err => {
            if(err?.response?.status == 400)
            {
              if(err?.response.data?.DivisionName != null)
              {
                setMsgDivisionInfo(err?.response?.data?.DivisionName[0]);
                setShowDivisionInfoAlert(true);
              }
              else {
                setMsgDivisionInfo(err?.response?.data);
                setShowDivisionInfoAlert(true);
              }
            }
            else {
              setMsgTeamInfo("Oh Oh, Something went wrong!!");
              setShowTeamInfoAlert(true);
            }
    });
};

            //#region errorMsg
            const [msgDivisionInfo, setMsgDivisionInfo] = useState("Error msg");
            const [showDivisionInfoAlert, setShowDivisionInfoAlert] = useState(false);
            function DivisionInfoAlert() {
                if (showDivisionInfoAlert) {
                    return (
                        <Alert className="" variant="danger" onClose={() => setShowDivisionInfoAlert(false)} dismissible data-testid="captainPageTeamAlert">
                            <p className="my-auto" data-testid="captainPageTeamAlertText">
                                {msgDivisionInfo}
                            </p>
                        </Alert>
                    );
                }
                return <> </>;
            };

    return (
        <>
            <Row className="mb-1" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <Col lg={11} xs={11} className="mb-0"><ListGroupItem onClick={editDivision} className="d-flex align-items-center Clickable adminTeamListItem">{divisiondata?.divisionName} {hovering ? <p className="text-muted ml-auto mb-0">Click to edit</p> : <> </>}</ListGroupItem></Col>
                <Col lg={1} xs={1} className="btn-group p-0">
                    {hovering ?
                    <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable" title="Delete division" onClick={() => setModalAreYouSure(true)} /> : <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable d-block d-sm-block d-lg-none" title="Delete division" onClick={() => setModalAreYouSure(true)} /> }
                </Col>
            </Row>
            <Modal
            size={"xl"}
            show={ModalDivisionShow}
            onHide={closeDivisionModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton >
                <Modal.Title className="font-weight-bold">
                Edit division info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden defaultValue="stopstupidautocomplete"/>
                <Form.Group>
                <Row><Col>
                <h5 className="font-weight-bold">Team captain</h5>
                <hr />
                </Col></Row>
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                    Division name:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter division name..." value={DivisionName} onChange={(e) => setDivisionName(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                <Form.Label column lg={3} className="font-weight-bold">
                    Division teams:
                    </Form.Label>
                    <Col className="teamList border border-dark">
                    {Teams != null ? <>
                        {Teams.map((t, index) => (
                                    <Form.Check key={index} label={`${t.teamName} ${t.divisionID != null ? "" : "(division-less)"}`} value={t.teamID} onChange={handleTeamListChange} defaultChecked={t.divisionID == divisiondata?.divisionID} type={"checkbox"} />
                        ))}
                        </> : 
                        <> 
                        <Row className="mt-5">
                            <Col md={3}></Col>
                            <Col md={6} className="d-inline-flex justify-content-center">
                            <Alert variant="warning" className="rounded">
                            <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No teams created yet.</h3>
                            </Alert>
                            </Col>
                            <Col md={3}></Col>
                        </Row> 
                        </>}
                    </Col>
                </Form.Row>
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><DivisionInfoAlert /></Col></Row>
            <Row>
            <Col md={2} xs={2}><Button variant="danger" className="btn-block" onClick={closeDivisionModal}>Cancel</Button></Col>
                <Col><Button className="btn-block" onClick={handleEditDivision}>Save changes</Button></Col>
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
                    <h6 className="font-weight-bold">Are you sure you want to delete: <br/><br/> {divisiondata?.divisionName}</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
              <Row>
                  <Col className="justify-content-end d-flex p-auto">
                      <Button variant="primary" className="mr-2 font-weight-bold" onClick={() => setModalAreYouSure(false)}>
                          Cancel
                      </Button>

                      <Button className="font-weight-bold" onClick={deleteDivision} variant="danger">
                          Delete division
                      </Button>
                  </Col>
              </Row>
              </Modal.Body>
            </Modal>
        </>
    );
}