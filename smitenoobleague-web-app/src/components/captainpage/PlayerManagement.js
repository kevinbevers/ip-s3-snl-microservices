import React, { useState, useEffect } from "react";
import {Row, Col, Button, Badge, Modal, Container, Form, InputGroup, FormControl, Alert} from "react-bootstrap";
import {FaTimes, FaPlaystation, FaXbox, FaSteam} from "react-icons/fa";
import {RiSwitchFill} from "react-icons/ri";
import {GiPc} from "react-icons/gi";
import {SiEpicgames} from "react-icons/si";
import manageteamservice from "services/manageteamservice";
import teamservice from "services/teamservice";




export default function PlayerManagement({member, apiToken, teamID, adminManage}) {
    const [PlayerModal, setPlayerModal] = useState(false);
    const [FoundPlayers, setFoundPlayers] = useState([]);
    const [SelectedPlayer, setSelectedPlayer] = useState();
    const [SearchName, setSearchName] = useState("");
    //#region captain
    //captain modal
    const [ModalEditCaptain, setModalEditCaptain] = useState(false);
    const [CaptainSub, setCaptainSub] = useState("");
    const [CaptainMail, setCaptainMail] = useState("");

    const closeCaptainModal = () =>{ 
        setCaptainSub("");
        setCaptainMail("");
        setModalEditCaptain(false);
    };

    const handleEditCaptain = async() => {

        if(CaptainSub == "" || CaptainSub == null)
        {
            setMsgCaptainInfo("Captain auth0 sub is required");
            setShowcaptainInfoAlert(true);
        }
        else if(CaptainMail == "" || CaptainMail == null)
        {
            setMsgCaptainInfo("Captain auth0 email is required");
            setShowcaptainInfoAlert(true);
        }
        else {
        let teamData = null;
        //get most up to date team info
        await teamservice.GetTeamByID(apiToken, teamID).then(res => {teamData = res.data;
            const data = {
                teamID: teamID,
                teamName: teamData?.teamName,
                teamDivsion: teamData?.teamDivsion,
                captain: {
                  teamCaptainEmail: CaptainMail,
                  teamCaptainAccountID: CaptainSub,
                  teamCaptainPlayerID: member.playerID,
                  teamCaptainPlayerName: member.teamMemberName,
                  teamCaptainPlatformName: member.teamMemberPlatform,
                  teamCaptainRoleID: member.teamMemberRole.roleID
                }
              };
             teamservice.UpdateTeamAsAdmin(apiToken, data).then(res => { closeCaptainModal();}).catch(err => {
                setMsgCaptainInfo(err?.response?.data);
                setShowcaptainInfoAlert(true);
            });
        }).catch(err => {});
    }
    };

    const [msgCaptainInfo, setMsgCaptainInfo] = useState("Error msg");
const [showCaptainInfoAlert, setShowcaptainInfoAlert] = useState(false);
function CaptainInfoPlayer() {
  if (showCaptainInfoAlert) {
    return (
      <Alert className="" variant="danger" onClose={() => setShowcaptainInfoAlert(false)} dismissible>
        <p className="my-auto">
          {msgCaptainInfo}
        </p>
      </Alert>
    );
  }
  return <> </>;
};
    //#endregion

    const updateSearchName = (event) => {
        if(event.target.value != null)
        {
            if(event.target.value.length < 30)
            {
                setSearchName(event.target.value);
            }
        }
    };

    const handleClose = () => {
        setPlayerModal(false);
        setFoundPlayers([]);
        setSelectedPlayer(null);
        setSearchName("");
        setMsgPlayerInfo("");
        setShowPlayerInfoAlert(false);
    };
    const handleShow = () => {
        setPlayerModal(true);
    };

const handleSearchPlayer = async() => { 
    if(SearchName != null && SearchName != "")
    {
        const name = SearchName;
        manageteamservice.GetPlayersByName(apiToken, name)
        .then(res => {
            setFoundPlayers(res.data);
            setMsgPlayerInfo("");
            setShowPlayerInfoAlert(false);

            if(res.data.length > 0) 
            {
                setSelectedPlayer(res.data[0]);
            }
            else {
                setMsgPlayerInfo("No results found.");
                setShowPlayerInfoAlert(true);
            }
        })
        .catch(err => {
            if(err?.response?.status == 404)
            {
                setFoundPlayers(null);
                setSelectedPlayer(null);
                setMsgPlayerInfo("No results found.");
                setShowPlayerInfoAlert(true);
            }
            else {
            setMsgPlayerInfo(err?.response?.data);
            setShowPlayerInfoAlert(true);
            }
        });
    }
};
const handleSelectPlayer = (event) => {
    const playerSelected = FoundPlayers?.filter(member => member.playerID == event.target.value)[0];
    setSelectedPlayer(playerSelected);
 };


const handleAddPlayer = async() => {
    if(SelectedPlayer?.playerID != null)
    {
        const playerToAdd = {
            playerID: SelectedPlayer.playerID,
            platformName: SelectedPlayer.platform,
            teamID: teamID,
            playerName: SelectedPlayer.playername,
            roleID: member.teamMemberRole.roleID
        };

        manageteamservice.AddPlayerToTeam(apiToken, playerToAdd)
        .then(res => {
            member.teamMemberName = res.data.teamMemberName;
            member.teamMemberID = res.data.teamMemberID;
            member.teamMemberRole = res.data.teamMemberRole;
            member.teamMemberPlatform = res.data.teamMemberPlatform;
            member.playerID = res.data.playerID;
            //close modal
            handleClose();
        })
        .catch(err => {
            setMsgPlayerInfo(err?.response?.data);
            setShowPlayerInfoAlert(true);
        });
    }
};

const handleEditPlayer = async() => {
    if(SelectedPlayer?.playerID != null)
    {
        const playerToEdit = {
            teamMemberID: member.teamMemberID,
            playerID: SelectedPlayer.playerID,
            platformName: SelectedPlayer.platform,
            teamID: teamID,
            playerName: SelectedPlayer.playername,
            roleID: member.teamMemberRole.roleID
        };

        manageteamservice.UpdatePlayerToTeam(apiToken, playerToEdit)
        .then(res => {
            console.log(res);
            member.teamMemberName = res.data.teamMemberName;
            member.teamMemberID = res.data.teamMemberID;
            member.teamMemberRole = res.data.teamMemberRole;
            member.teamMemberPlatform = res.data.teamMemberPlatform;
            member.playerID = res.data.playerID;
            //close modal
            handleClose();
        })
        .catch(err => { 
            setMsgPlayerInfo(err?.response?.data);
            setShowPlayerInfoAlert(true);
           });
    }
};

const [msgPlayerInfo, setMsgPlayerInfo] = useState("Error msg");
const [showPlayerInfoAlert, setShowPlayerInfoAlert] = useState(false);
function PlayerInfoAlert() {
  if (showPlayerInfoAlert) {
    return (
      <Alert className="" variant="danger" onClose={() => setShowPlayerInfoAlert(false)} dismissible>
        <p className="my-auto">
          {msgPlayerInfo}
        </p>
      </Alert>
    );
  }
  return <> </>;
};

const handleRemovePlayer = () => {
    //remove player. member.teamMemberID
    manageteamservice.RemovePlayerFromTeam(apiToken,member.teamMemberID).then(res => {
        member.teamMemberName = null;
        member.teamMemberID = null;
        member.teamMemberPlatform = null;
        member.playerID = null;
        //close modal
        handleClose();
    }).catch(err => { 
        setMsgPlayerInfo(err?.response?.data);
        setShowPlayerInfoAlert(true);
       });
};

    return (
        <>
            <Row className="mb-2 rounded bg-white border border-silver PlayerBox">
                <Col md={10} xs={10} className="d-flex p-0">
                    <h4 className="my-auto font-weight-bold p-auto pl-2 PlayerText">{(member.teamMemberPlatform == "PS4" &&
                                                    <FaPlaystation />)
                                                || (member?.teamMemberPlatform == "Steam" &&
                                                    <FaSteam />)
                                                || (member.teamMemberPlatform == "Xbox" &&
                                                    <FaXbox />)
                                                || (member.teamMemberPlatform == "HiRez" &&
                                                    <GiPc />)
                                                || (member.teamMemberPlatform == "Switch" &&
                                                    <RiSwitchFill />)
                                                || (member.teamMemberPlatform == "Epic_Games" && 
                                                    <SiEpicgames />)
                                                ||
                                                
                                                member.teamMemberPlatform

                                                } {member?.teamMemberName != null ? member.teamMemberName + " " : "No player in this role yet. "} 
                                                 {member?.teamCaptain != null && member.teamCaptain == true ? <Badge variant="secondary">Captain</Badge> : <></>}</h4>
                </Col>
                <Col xs={2} className="my-auto p-0 pr-2">{member?.teamMemberID != null ? <Button onClick={handleShow} variant="primary" size="sm" className="PlayerEdit" block>Edit</Button> : <Button onClick={handleShow} variant="success" size="sm" className="PlayerEdit" block>Add</Button>}</Col>
            </Row>

            {/* Modal */}
            <Modal show={PlayerModal} onHide={handleClose}>
                {member?.teamMemberID == null ? <> 
                    <Container className="p-3">
                        {/* Header */}
                    <Row className="mb-2">
                        <Col md={10}><h5>Add player</h5></Col>  
                        <Col md={2} className="justify-content-end d-flex"><FaTimes className="Clickable" onClick={handleClose} /></Col>
                    </Row>
                    {/* Body */}
                    <Row className="mb-4">
                        <Col>
                        <Row>
                            <Col>
                            <Alert variant="secondary">
                                <Alert.Heading>How to's</Alert.Heading>
                                <p>
                                    <b>Step 1.</b> Fill in a playername and press search player.<br />
                                    <b>Step 2.</b> Choose a player from the dropdown results.<br />
                                    <b>Step 3.</b> Press add player to add the selected player.
                                </p>
                            </Alert>
                            </Col>
                        </Row>
                            <Row>
                            <Col>  
                                <InputGroup className="mb-3">
                                    <FormControl value={SearchName} onChange={updateSearchName}
                                    placeholder="Player ingame name..."
                                    aria-label="Player ingame name"
                                    />
                                    <InputGroup.Append>
                                    <Button variant="primary" onClick={handleSearchPlayer}>Search player</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            </Row>
                            {FoundPlayers?.length > 0 ? <>
                                <Row>
                                <Col>  
                                    <Form.Group controlId="SelectPlayer">
                                        <Form.Label>Players found by name: "{SearchName}"</Form.Label>
                                        <Form.Control as="select" onChange={handleSelectPlayer}>
                                        {FoundPlayers.map((player, index) => (
                                            <option key={index} value={player.playerID}>{player.playername} {player.platform}</option>
                                        ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            </> : <> </>}
                            <Row>
                                <Col><PlayerInfoAlert /></Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* Footer */}
                    <Row>
                        <Col className="justify-content-end d-flex">
                        <Button variant="danger" onClick={handleClose} className="mr-1">
                               Cancel
                            </Button>
                            <Button variant="success" onClick={handleAddPlayer}>
                               Add player
                            </Button>
                        </Col>
                    </Row>
                </Container>
                </> : <>
                <Container className="p-3">
                        {/* Header */}
                    <Row className="mb-2">
                        <Col md={10}><h5>Edit player</h5></Col>  
                        <Col md={2} className="justify-content-end d-flex"><FaTimes className="Clickable" onClick={handleClose} /></Col>
                    </Row>
                    {/* Body */}
                    <Row className="mb-4">
                        <Col>
                        <Row>
                            <Col>
                            <Alert variant="secondary">
                                <Alert.Heading>How to's</Alert.Heading>
                                <p>
                                    <b>Step 1.</b> Fill in a playername and press search player.<br />
                                    <b>Step 2.</b> Choose a player from the dropdown results.<br />
                                    <b>Step 3.</b> Press Replace player to replace the current player.
                                </p>
                            </Alert>
                            </Col>
                        </Row>
                            <Row>
                            <Col>  
                                <InputGroup className="mb-3">
                                    <FormControl value={SearchName} onChange={updateSearchName}
                                    placeholder="Player ingame name..."
                                    aria-label="Player ingame name"
                                    />
                                    <InputGroup.Append>
                                    <Button variant="primary" onClick={handleSearchPlayer}>Search player</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            </Row>
                            {FoundPlayers?.length > 0 ? <> 
                                <Row>
                                <Col>  
                                    <Form.Group controlId="SelectPlayer">
                                        <Form.Label>Players found by name: "{SearchName}"</Form.Label>
                                        <Form.Control as="select" onChange={handleSelectPlayer}>
                                        {FoundPlayers.map((player, index) => (
                                            <option key={index} value={player.playerID}>{player.playername} {player.platform}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            </> : <> </>}
                            <Row>
                                <Col><PlayerInfoAlert /></Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* Footer */}
                    <Row>
                        <Col className="justify-content-end d-flex">
                        {adminManage == true && member.teamCaptain == false ?
                        <Button variant="danger" onClick={handleRemovePlayer} className="mr-1">
                               Remove player
                            </Button>
                            : <> </>}
                        {adminManage == true && member.teamCaptain == true ?
                        <Button variant="warning" onClick={() => setModalEditCaptain(true)} className="mr-1">
                               Edit captain
                            </Button>
                            : <> </>}
                        <Button variant="danger" onClick={handleClose} className="mr-1">
                               Cancel
                            </Button>
                            <Button variant="primary" onClick={handleEditPlayer}>
                               Replace player
                            </Button>
                        </Col>
                    </Row>
                </Container>
                 </>}
               
        </Modal>
        <Modal
            show={ModalEditCaptain}
            onHide={closeCaptainModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h6 className="font-weight-bold">Edit captain</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
           <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden value="stopstupidautocomplete"/>
                <Form.Group>
                <Row><Col>
                <h5 className="font-weight-bold">Team captain</h5>
                <hr />
                </Col></Row>
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                    Auth0 Email:
                    </Form.Label>
                    <Col>
                    <Form.Control type="email" placeholder="Enter captain's auth0 Email" value={CaptainMail} onChange={(e) => setCaptainMail(e.target.value)}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
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
            <Row><Col><CaptainInfoPlayer /></Col></Row>
              <Row>
                  <Col className="justify-content-end d-flex p-auto">
                      <Button variant="primary" className="mr-2 font-weight-bold" onClick={closeCaptainModal}>
                          Cancel
                      </Button>

                      <Button className="font-weight-bold" variant="warning" onClick={handleEditCaptain}>
                          Update
                      </Button>
                  </Col>
              </Row>
              </Modal.Body>
            </Modal>
        </>
    );
}