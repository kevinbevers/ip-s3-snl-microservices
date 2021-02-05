//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit} from "react-icons/fa";
//custom imports
import ManageTeamListItem from "src/components/managepage/manageteamListItem";
//API
import teamservice from "services/teamservice";
import divisionservice from "services/divisionservice";

export default function ManageTeams({apiToken}) {

    const [modalListShow, setModalListShow] = useState(false);
    const closeListModal = () => {
        setModalListShow(false);
    };

    //Divisions for dropdown
    const [Divisions, setDivisions] = useState([]);
    //teams to show
    const [TeamsToShow, setTeamsToShow] = useState([]);

    //Select Division
    const [SelectedDivisionID, setSelectedDivisionID] = useState(0);
    const changeDivision = async(evt) => {
      setSelectedDivisionID(evt.target.value);
      //check if the no division is selected or one of the other divisions
      if(evt.target.value == 0)
      {
        //Get teams that are in no division
        await teamservice.GetListOfTeamsWithoutDivisions().then((res) => {setTeamsToShow(res.data);}).catch((error) => {setTeamsToShow(null)});
      }
      else 
      {         
        //Get teams from selected division
        await teamservice.GetListOfTeamsByDivisionID(evt.target.value).then((res) => {setTeamsToShow(res.data);}).catch((error) => {setTeamsToShow(null)});
      }

    };

    const openManageTeam = async() => {
        //Add the teams without division
        let listOfDivisions = null;
  
        await divisionservice.GetBasicListOfDivisions().then(res => {listOfDivisions = res.data; }).catch(err => {});
  
          if(listOfDivisions?.length > 0)
          {
              setDivisions(listOfDivisions.concat({divisionID: 0, divisionName: "Division-less Teams"}));
          }
  
          //check if there are divisions, if yes check if the first division has teams
          if (listOfDivisions?.length > 0) {
              setSelectedDivisionID(listOfDivisions[0]?.divisionID)
              //get division teams from api
              await teamservice.GetListOfTeamsByDivisionID(listOfDivisions[0]?.divisionID)
              .then((res) => {
                  setTeamsToShow(res.data);
              })
              .catch((error) => {
              });
          }
  
          setModalListShow(true);
      };

      function RemoveTeam(id){
        let teams = TeamsToShow;
        const arr = teams.filter((item) => item.teamID !== id);
        setTeamsToShow(arr);
      };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openManageTeam} className="btn-block">Manage existing teams</Button>
            <Modal
            size="lg"
            show={modalListShow}
            onHide={closeListModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Manage existing teams
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
                     {TeamsToShow != null ? <><ListGroup>
                            {TeamsToShow.map((t, index) => (
                                    <ManageTeamListItem key={index} apiToken={apiToken} Team={t} removeTeamFunc={RemoveTeam} />   
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