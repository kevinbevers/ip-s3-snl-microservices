//default react imports
import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
//bootstrap
import {Container, Row, Col, Card, Button, Modal, ListGroup, ListGroupItem, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit, FaUpload, FaEye} from "react-icons/fa";
//Custom component
import CaptainMatchSubmit from "src/components/captainpage/CaptainMatchSubmit";

export default function SubmitMatch({apiToken}) {

    //States
    const [ModalSubmitShow, setModalSubmitShow] = useState(false);

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={() => setModalSubmitShow(true)} className="btn-block">Submit matchID</Button>
            <Modal
            size={"xl"}
            show={ModalSubmitShow}
            onHide={() => setModalSubmitShow(false)}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header className="border-0" closeButton></Modal.Header>
            <Modal.Body>
            <Container>
              <CaptainMatchSubmit apiToken={apiToken} />
            </Container>
            </Modal.Body>
            </Modal>
        </>
    );
}