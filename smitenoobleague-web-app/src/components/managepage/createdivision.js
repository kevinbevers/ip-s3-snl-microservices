//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert, InputGroup, FormControl} from "react-bootstrap";
//custom imports
//API
import divisionservice from "services/divisionservice";

export default function CreateDivision({apiToken}) {

    const [modalCreateShow, setModalCreateShow] = useState(false);


    const [DivisionName, setDivisionName] = useState("");

    const closeDivisionCreateModal = () => {
        setDivisionName("");
        setModalCreateShow(false);
    };

    const createDivision = async() => {
        //call api to update team
        const formData = new FormData();
        formData.append("divisionName", DivisionName);

        await divisionservice.CreateDivision(apiToken, formData).then(res => {closeDivisionCreateModal();}).catch(err => {
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
            <Button variant={"primary"} size={"lg"} onClick={() => setModalCreateShow(true)} className="btn-block">Create new division</Button>
            <Modal
            size="lg"
            show={modalCreateShow}
            onHide={closeDivisionCreateModal}
            aria-labelledby="create-division-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Create new division
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden defaultValue="stopstupidautocomplete"/>
                <Form.Group>
                <Form.Row>
                    <Form.Label column lg={2} className="font-weight-bold">
                    Division name:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter divisionname..." value={DivisionName} onChange={(e) => setDivisionName(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><DivisionInfoAlert /></Col></Row>
            <Row>
                <Col><Button className="btn-block" onClick={createDivision}>Create division</Button></Col>
            </Row>
            </Modal.Body>
            </Modal>
        </>
    );
}