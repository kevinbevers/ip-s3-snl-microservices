//default react imports
import React, { useState, useEffect, useRef } from "react";
//bootstrap components
import { Container, Row, Col, Form, Card, Button, Badge, Toast, Alert } from "react-bootstrap";
//custom imports
import { FaEdit, FaCheck, FaBan, FaUpload } from "react-icons/fa";
//API
import captainservice from "services/captainservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function CaptainTeamInfo({ apiResponse, apiToken }) {

    //#region EditTeamName
    const [editing, setEditing] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [oldName, setOldName] = useState("");
    //handle change
    const handleEditTeamName = (event) => {
        setTeamName(event.target.value);
    };
    //Set initial states
    useEffect(() => {
        setTeamName(apiResponse != null ? apiResponse?.teamName : "Api Unavailable");
        setOldName(apiResponse != null ? apiResponse?.teamName : "Api Unavailable");
        setOldImage(apiResponse != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + apiResponse?.teamLogoPath : null);
    }, []);
    //Buttons
    const editTeamName = () => {
        setEditing(true);
    };
    const cancelNameEdit = () => {
        setEditing(false);
        setTeamName(oldName);
        setShowTeamInfoAlert(false);
    };
    const confirmNameEdit = async () => {
        if (teamName != apiResponse.teamName) {
        //call api to update team
        const formData = new FormData();
        formData.append("teamID", apiResponse?.teamID);
        formData.append("teamName", oldName);

            await captainservice.UpdateTeamInfo(apiToken, formData).then(res => { setOldName(teamName); setShowTeamInfoAlert(false); setEditing(false); })
                .catch(err => {
                    console.log(err);
                    if (err?.response?.status != 400) {
                        SetNote({ title: "Error", msg: "Oh oh something went wrong trying to update the teamname.", type: "bg-danger" });
                        SetNotify(true);
                    }
                    else {
                        setMsgTeamInfo(err.response.data.TeamName[0]);
                        setShowTeamInfoAlert(true);
                    }
                });
        }
        else {
            setEditing(false);
        }
    };
    //#endregion

    //#region EditTeamImage
    const [imagePath, setImagePath] = useState(process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + apiResponse?.teamLogoPath);
    const [imageFile, setImageFile] = useState(null);
    const fileUploader = useRef();
    const [editImage, setEditImage] = useState(false);
    const [oldImage, setOldImage] = useState(null);

    const editTeamImage = () => { setEditImage(true) };
    const cancelImageEdit = () => {
        setEditImage(false);
        setImagePath(oldImage != null ? oldImage : null);
        setShowTeamInfoAlert(false);
        setImageFile(null);
    };

    const setPreview = (evt) => {
        if (evt.target.files && evt.target.files[0]) {
            let imgFile = evt.target.files[0];
            const reader = new FileReader();
            reader.onload = (x) => {
                setImagePath(x.target.result);
                setImageFile(imgFile);
            };
            reader.readAsDataURL(imgFile);
            console.log(imageFile);
        }
    };

    const confirmLogoEdit = async () => {
        if(imageFile != null)
        {
        //call api to update team
        const formData = new FormData();
        formData.append("teamID", apiResponse?.teamID);
        formData.append("teamName", oldName);
        formData.append("teamLogo", imageFile);

        await captainservice.UpdateTeamInfo(apiToken, formData).then(res => {
            console.log(res.data);
            setShowTeamInfoAlert(false);
            setEditImage(false);
        })
            .catch(err => {
                console.log(err);
                if (err?.response?.status != 400) {
                    SetNote({ title: "Error", msg: "Oh oh something went wrong trying to update the team's logo, try another image.", type: "bg-danger" });
                    SetNotify(true);
                }
                else {
                    setMsgTeamInfo(err.response.data?.TeamLogo[0]);
                    setShowTeamInfoAlert(true);
                }
            });
        }
        else {
            setEditImage(false);
        }
    };

    const updateImage = (e) => {
        fileUploader.current.click();
    }
    //#endregion

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
    //#endregion
    //#region notify
    const [notify, SetNotify] = useState(false);
    const [note, SetNote] = useState({ msg: "", type: "", title: "" });
    const toggleNotify = () => SetNotify(!notify);
    //#endregion

    return (
        <>
            <Card className="bg-light">
                <Card.Body className="h-100">
                    <Container fluid>
                        <Row><Col className="pl-0"><h2 className="font-weight-bold">TEAM INFO</h2></Col></Row>
                        <Row className="mb-4">
                            <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Name:</h5></Col>
                            <Col md={7} xs={7} className="my-auto p-0">
                                <Form.Group className="my-auto" controlId="TeamNameInput">
                                    <Form.Control type="text" value={teamName} onChange={handleEditTeamName} placeholder={"Teamname..."} className="TeamInfoText" disabled={!editing} required />
                                </Form.Group>
                            </Col>
                            <Col className="my-auto p-0 ml-2">
                                <a className="TeamInfoIcon my-auto Clickable">{editing ? <FaCheck color={"green"} className="mr-1" onClick={confirmNameEdit} title="Confirm name change" /> : <FaEdit onClick={editTeamName} title="Change team name" />}</a>{editing ? <a onClick={cancelNameEdit} className="TeamInfoIcon my-auto Clickable"><FaBan color={"red"} title="Cancel name change" /></a> : <></>}
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} xs={3} className="my-auto p-0"><h5 className="font-weight-bold mb-0 TeamInfoTitle">Logo:</h5></Col>
                            <Col md={7} xs={7} className="my-auto p-0">
                                {apiResponse?.teamLogoPath != null ? <div className="MainTeamImage position-relative"><Image layout={"fill"} alt={apiResponse?.teamName} src={imagePath} draggable={false}></Image></div> :
                                    <Img alt={apiResponse?.teamName} src={require("public/images/teamBadge.png")} className="MainTeamImage" draggable={false}></Img>
                                }
                            </Col>
                            <Col className="my-auto p-0 ml-2">
                                <a className="TeamInfoIcon my-auto Clickable">{editImage ? <FaCheck color={"green"} className="mr-1" onClick={confirmLogoEdit} title="Confirm logo change" /> : <FaEdit onClick={editTeamImage} title="change team logo" />}</a>{editImage ? <a onClick={cancelImageEdit} className="TeamInfoIcon my-auto Clickable"><FaBan color={"red"} title="Cancel logo change" /></a> : <></>}
                            </Col>
                        </Row>
                        <Row className="mt-2"><Col>{editImage ? <Button className="btn-block" onClick={updateImage}>Upload image <FaUpload className="my-auto" /></Button> : <></>}</Col></Row>
                        <Form>
                            <Form.Group>
                                <Form.File id="TeamImageFile" hidden ref={fileUploader} onChange={setPreview} />
                            </Form.Group>
                        </Form>
                        <Row><Col><TeamInfoAlert /></Col></Row>
                    </Container>
                </Card.Body>
            </Card>
            {/* Notification Toast */}

            <Toast show={notify} onClose={() => SetNotify(false)} delay={3000} autohide style={{ position: 'fixed', top: 5, right: 5, }}>
                <Toast.Header className={"text-white " + note?.type}>
                    <img
                        src="/images/SNL_Navbar_Logo.png"
                        className={"rounded mr-2"}
                        height={22}
                        alt=""
                    />
                    <strong className="mr-auto pr-3">{note?.title}</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body className="bg-white rounded">{note?.msg}</Toast.Body>
            </Toast>
        </>
    );
}

