//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert, ListGroupItem} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit} from "react-icons/fa";
//custom imports
import ManageDivisionListItem from "src/components/managepage/managedivisionListItem";
//API
import divisionservice from "services/divisionservice";

export default function ManageDivisions({apiToken, adminManage}) {

    const [modalListShow, setModalListShow] = useState(false);
    const closeListModal = () => {
        setModalListShow(false);
    };

    //Divisions for dropdown
    const [Divisions, setDivisions] = useState([]);

    const openManageDivisions = async() => {
        await divisionservice.GetBasicListOfDivisions().then(res => {setDivisions(res.data); }).catch(err => {});
        setModalListShow(true);
      };

      function RemoveDiv(id){
        let div = Divisions;
        const arr = div.filter((item) => item.divisionID !== id);
        setDivisions(arr);
      };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openManageDivisions} className="btn-block">Manage existing divisions</Button>
            <Modal
            size="lg"
            show={modalListShow}
            onHide={closeListModal}
            aria-labelledby="manage-division-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Manage existing divisions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Row>
                    <Col lg={10} xs={12} className="mx-auto">    
                     {Divisions != null ? <><ListGroup>
                            {Divisions.map((d, index) => (
                                    <ManageDivisionListItem key={index} apiToken={apiToken} divisiondata={d} removeDivFunc={RemoveDiv} adminManage={adminManage} />
                            ))}
                           </ListGroup></> : 
                            <> 
                            <Row className="mt-5">
                                <Col md={3}></Col>
                                <Col md={6} className="d-inline-flex justify-content-center">
                                <Alert variant="warning" className="rounded">
                                <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No teams found.</h3>
                                </Alert>
                                </Col>
                                <Col md={3}></Col>
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