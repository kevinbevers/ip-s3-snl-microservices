//default react imports
import React, { useState, useEffect } from "react";
//bootstrap components
import {Row, Col, Form, Card, Button, Alert } from "react-bootstrap";
//API
import inhouseservice from "services/inhouseservice";

export default function InhouseMatchSubmit({apiToken}) {

      //#region SubmitMatch
  const [matchID, setMatchID] = useState(0);
  const [submissionMsg, setSubmissionMsg] = useState({ text: "Submission msg here...", color: "danger" });
  const [showSubmissionAlert, setShowSubmissionAlert] = useState(false);
  function SubmissionAlert() {
    if (showSubmissionAlert) {
      return (
        <Alert className="" variant={submissionMsg?.color} onClose={() => setShowSubmissionAlert(false)} dismissible data-testid="captainPageMatchAlert">
          <p className="my-auto" data-testid="captainPageMatchAlertText">
            {submissionMsg?.text}
          </p>
        </Alert>
      );
    }
    return <> </>;
  };

  const handleChange = (event) => {
    if (event.target?.value != null) {
      //update matchID
      setMatchID(event.target.value);
      //show messag during typing
      if (event.target.value.length <= 10) {
        setShowSubmissionAlert(false);
      }

      if (event.target.value.length > 10) {
        setSubmissionMsg({ text: "gameID too long to be valid. a maximum of 10 characters is allowed", color: "danger" })
        setShowSubmissionAlert(true);
      }
    }
    else {
      setShowSubmissionAlert(false);
      setMatchID(0);
    }
  };
  const handleSubmit = async (event) => {

    if (matchID != null && matchID != "" && matchID?.length >= 5 && matchID?.length <= 10) {
      setShowSubmissionAlert(false);
      const id = Number(matchID);
      await inhouseservice.SubmitInhouseGameID(apiToken, id)
        .then(res => {
          setSubmissionMsg({ text: res.data, color: "success" });
          setShowSubmissionAlert(true);
        })
        .catch(err => {
          setSubmissionMsg({ text: err.response?.data, color: "danger" })
          setShowSubmissionAlert(true);
        });
    }
    else if(matchID?.length == 0 || matchID == "" || matchID == null){
      setSubmissionMsg({ text: "gameID not filled in.", color: "warning" })
      setShowSubmissionAlert(true);
    }
    else if (matchID?.length < 5) {
      setSubmissionMsg({ text: "gameID too short to be valid. a minimum of 5 characters is required", color: "danger" })
      setShowSubmissionAlert(true);
    }
    else if (matchID?.length > 10) {
      setSubmissionMsg({ text: "gameID too long to be valid. a maximum of 10 characters is allowed", color: "danger" })
      setShowSubmissionAlert(true);
    }
  };
  //#endregion

    return (
          <Card className="bg-light">
            <Card.Body className="">
              <h2 className="font-weight-bold">SUBMIT MATCH</h2>
              <Form.Group className="">
                <Form.Control type="number" placeholder="Match ID..." className="mb-2" onChange={handleChange} maxLength={10} data-testid="captainPageMatchIdInput"/>
                <Button variant="primary" size="lg" block onClick={handleSubmit} data-testid="captainPageSubmitButton">Submit</Button>
              </Form.Group>
              <Row><Col><SubmissionAlert /></Col></Row>
            </Card.Body>
          </Card>
    );
}