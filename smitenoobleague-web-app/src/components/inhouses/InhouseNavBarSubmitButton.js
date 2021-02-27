//default react imports
import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
//bootstrap
import {Container, Row, Col, Card, Button, Modal, ListGroup, ListGroupItem, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit, FaUpload, FaEye} from "react-icons/fa";
//Custom component
import InhouseMatchSubmit from "src/components/inhouses/InhouseMatchSubmit";

export default function InhouseNavBarSubmitbutton({apiToken}) {

    //States
    const [ModalSubmitShow, setModalSubmitShow] = useState(false);

    return (
        <>
            <Button variant={"primary"}onClick={() => setModalSubmitShow(true)} className="mr-5">Submit MatchID</Button>
            <Modal
            size={"xl"}
            show={ModalSubmitShow}
            onHide={() => setModalSubmitShow(false)}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header className="border-0" closeButton></Modal.Header>
            <Modal.Body>
            <Container>
              <InhouseMatchSubmit apiToken={apiToken} />
            </Container>
            </Modal.Body>
            </Modal>
        </>
    );
}