//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert, InputGroup, FormControl} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit, FaTimes} from "react-icons/fa";
//custom imports
import SearchPlayer from "src/components/managepage/searchplayer";
//API
import teamservice from "services/teamservice";
import divisionservice from "services/divisionservice";

export default function CreateTeam({apiToken}) {

    const [modalCreateShow, setModalCreateShow] = useState(false);

    //Divisions for dropdown
    const [Divisions, setDivisions] = useState([]);
    //Values
    const [TeamName, setTeamName] = useState("");
    const [CaptainMail, setCaptainMail] = useState("");
    const [CaptainSub, setCaptainSub] = useState("");
    const [CaptainPlayer, setCaptainPlayer] = useState(null);

    //Select Division
    const [SelectedDivisionID, setSelectedDivisionID] = useState(0);
    const changeDivision = async(evt) => {
      setSelectedDivisionID(evt.target.value);
    };

    const openCreateTeam = async() => {
        //Add the teams without division
        let listOfDivisions = null;
  
        await divisionservice.GetBasicListOfDivisions().then(res => {listOfDivisions = res.data; }).catch(err => {});
  
          if(listOfDivisions?.length > 0)
          {
              setDivisions(listOfDivisions.concat({divisionID: 0, divisionName: "No division"}));
          }
  
          setModalCreateShow(true);
      };
    
    const closeCreateTeam = () => {
        setTeamName("");
        setCaptainMail("");
        setCaptainSub("");
        setCaptainPlayer(null);
        setModalCreateShow(false);
    };

    const CreateTeam = async() => {

        if(CaptainPlayer == null)
        {
            setMsgTeamInfo("Ingame player for captain is required");
            setShowTeamInfoAlert(true);
        }
        else if(CaptainMail == null || CaptainMail == "")
        {
            setMsgTeamInfo("Auth0 Email for captain is required");
            setShowTeamInfoAlert(true);
        }
        else if(CaptainSub == null || CaptainSub == "")
        {
            setMsgTeamInfo("Auth0 sub for captain is required");
            setShowTeamInfoAlert(true);
        }
        else {
        const data = {
            teamName: TeamName,
            teamDivisionID: SelectedDivisionID == 0 ? null : SelectedDivisionID,
            captain: {
              teamCaptainEmail: CaptainMail,
              teamCaptainAccountID: CaptainSub,
              teamCaptainPlayerID: CaptainPlayer.playerID,
              teamCaptainPlayerName: CaptainPlayer.playername,
              teamCaptainPlatformName: CaptainPlayer.platform,
            }
          }
          await teamservice.AddNewTeam(apiToken, data).then(res => {closeCreateTeam();}).catch(err => {
              console.log(err?.response);
              if(err?.response?.status == 400)
              {
                if(err?.response.data?.TeamName != null)
                {
                    setMsgTeamInfo(err?.response?.data?.TeamName[0]);
                    setShowTeamInfoAlert(true);
                }
                else {
                    setMsgTeamInfo(err?.response?.data);
                    setShowTeamInfoAlert(true);
                }
              }
              else {
                setMsgTeamInfo("Oh Oh, Something went wrong!!");
                setShowTeamInfoAlert(true);
              }
          });

        }
    };

    function setCaptainP(c){
        setCaptainPlayer(c);
    };

        //#region errorMsg
        const [msgTeamInfo, setMsgTeamInfo] = useState("Error msg");
        const [showTeamInfoAlert, setShowTeamInfoAlert] = useState(false);
        function TeamInfoAlert() {
            if (showTeamInfoAlert) {
                return (
                    <Alert className="" variant="danger" onClose={() => setShowTeamInfoAlert(false)} dismissible data-testid="captainPageTeamAlert">
                        <p className="my-auto" data-testid="captainPageTeamAlertText">
                            {msgTeamInfo}
                        </p>
                    </Alert>
                );
            }
            return <> </>;
        };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openCreateTeam} className="btn-block">Create new team</Button>
            <Modal
            size="lg"
            show={modalCreateShow}
            onHide={closeCreateTeam}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Create new team
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden value="stopstupidautocomplete"/>
                <Row><Col>
                <h5 className="font-weight-bold">Basic info</h5>
                <hr />
                </Col></Row>
                <Form.Group>
                <Form.Row>
                    <Form.Label column lg={2} className="font-weight-bold">
                    Team division:
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
                    <Form.Label column lg={2} className="font-weight-bold">
                    Team name:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter teamname..." value={TeamName} onChange={(e) => setTeamName(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                <Row><Col>
                <h5 className="font-weight-bold">Team captain</h5>
                <hr />
                </Col></Row>
                <Form.Row>
                    <Form.Label column lg={2} className="font-weight-bold">
                    Ingame player:
                    </Form.Label>
                    <Col className="my-auto">
                        <SearchPlayer apiToken={apiToken} setCaptainFunc={setCaptainP}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={2} className="font-weight-bold">
                    Auth0 Email:
                    </Form.Label>
                    <Col>
                    <Form.Control type="email" placeholder="Enter captain's auth0 Email" value={CaptainMail} onChange={(e) => setCaptainMail(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={2} className="font-weight-bold">
                    Auth0 sub:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter captain's auth0 sub" value={CaptainSub} onChange={(e) => setCaptainSub(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><TeamInfoAlert /></Col></Row>
            <Row>
                <Col><Button className="btn-block" onClick={CreateTeam}>Create team</Button></Col>
            </Row>
            </Modal.Body>
            </Modal>
        </>
    );
}