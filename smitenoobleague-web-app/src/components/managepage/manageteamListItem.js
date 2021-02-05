//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Card, Button, Modal, ListGroup, ListGroupItem} from "react-bootstrap";
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
import teamservice from "services/teamservice";


export default function ManageTeamListItem({apiToken, Team, removeTeamFunc}) {

    const [hovering, setHovering] = useState(false);
    const [ModalAreYouSure, setModalAreYouSure] = useState(false);
    const closeTeamModal = () => {
        setModalTeamShow(false);
    };
    const[teamdata, setTeamData] = useState(null);

    const [modalTeamShow, setModalTeamShow] = useState(false);

    const editTeam = async() => {
        await teamservice.GetTeamByID(apiToken, Team?.teamID).then(res => {setTeamData(res.data); setModalTeamShow(true);}).catch(err => {});
    };

    const deleteTeam = async() => {
      await teamservice.DeleteTeamByID(apiToken, Team?.teamID).then(res => {removeTeamFunc(Team?.teamID)}).catch(err => {});
    };

    const renderTeamLogo = (t) => {
        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return (t?.teamLogoPath != null ?
            <span className="mr-2 align-content-center d-flex"><Image height={20} width={20} alt={t?.teamName} src={imagePath} className="rounded" draggable={false}></Image></span>
            : <span className="mr-2 my-auto"><Img height={20} width={20} webp src={require("public/images/teamBadge.png")} alt={t?.teamName} className="rounded" draggable={false}></Img></span>);
    };

    useEffect(() => {
      setTeamData(Team);
  }, [Team]);

    return (
        <>
            <Row className="mb-1" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <Col lg={11} xs={11} className="mb-0"><ListGroupItem onClick={editTeam} className="d-flex align-items-center Clickable adminTeamListItem">{renderTeamLogo(teamdata)}{teamdata?.teamName} {hovering ? <p className="text-muted ml-auto mb-0">Click to edit</p> : <> </>}</ListGroupItem></Col>
                <Col lg={1} xs={1} className="btn-group p-0">
                    {hovering ?
                    <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable" title="Delete team" onClick={() => setModalAreYouSure(true)} /> : <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable d-block d-sm-block d-lg-none" title="Delete team" onClick={() => setModalAreYouSure(true)} /> }
                </Col>
            </Row>
            <Modal
            size={"xl"}
            show={modalTeamShow}
            onHide={closeTeamModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton >
                <Modal.Title className="font-weight-bold">
                Edit team info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container fluid>
          <Row>
            <Col md={5} xl={5}>
              <Row className="mb-2">
                <Col>
                <CaptainTeamInfo apiToken={apiToken} apiResponse={teamdata} />
                </Col>
              </Row>
            </Col>
            <Col md={7} xl={7} className="mb-2">
              <CaptainTeamManagement apiToken={apiToken} apiResponse={teamdata} adminManage={true} />
            </Col>
          </Row>
        </Container>
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
                    <h6 className="font-weight-bold">Are you sure you want to delete: <br/><br/> {teamdata?.teamName}</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
              <Row>
                  <Col className="justify-content-end d-flex p-auto">
                      <Button variant="primary" className="mr-2 font-weight-bold" onClick={() => setModalAreYouSure(false)}>
                          Cancel
                      </Button>

                      <Button className="font-weight-bold" variant="danger" onClick={deleteTeam}>
                          Delete team
                      </Button>
                  </Col>
              </Row>
              </Modal.Body>
            </Modal>
        </>
    );
}