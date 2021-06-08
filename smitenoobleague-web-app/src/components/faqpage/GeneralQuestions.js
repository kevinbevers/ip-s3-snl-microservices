import React, {useContext} from "react";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import Card from "react-bootstrap/Card";
import {FaAngleUp, FaAngleDown} from "react-icons/fa";

export default function GeneralQuestions() {


    function ContextAwareToggle({ children, eventKey, callback }) {
        const currentEventKey = useContext(AccordionContext);
      
        const isCurrentEventKey = currentEventKey === eventKey;
      
        return (
            <>
            <div className="d-flex">
          <h5 className="m-0">
            {children}
          </h5>
          {isCurrentEventKey ? <FaAngleUp className="ml-auto"/> : <FaAngleDown className="ml-auto"/>}
          </div>
          </>
        );
      }

return (
    <>
        <h3 className="font-weight-bold">General questions</h3>
        <hr />
        <Accordion>
        
        <Card className="Clickable">
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <ContextAwareToggle eventKey={"0"}>How long does it take for played games to show up?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
            <p className="m-0">Atm there is a delay in the Hi-rez api that prevents custom game data to be pulled right after playing, this delay is <b>7 days</b>. 
            If a captain submits a match-id it get's stored. When the match data becomes available it get's immediately processed.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
            <ContextAwareToggle eventKey="1">What is smitechampions.com?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
            <p className="m-0">Smite Champions is an amateur Smite Tournament and League organisation. the smitechampions.com website is used to host and manage the league and in the future Tournaments as well. 
            In the Smite Champions League (SCL in short) there are multiple divisions, each division contains a number of teams, 
            these teams compete agains eachother for several weeks. during this time team captains submit their played match IDs. 
            These match IDs get collected and processed, with the data the matches provide everything gets calculated.
            Essentially this means you will be able to view the final match results and statistics of every team that plays in the SCL</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
            <ContextAwareToggle eventKey="2">How do i sign up as a team?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
            <Card.Body>
            <span className="m-0">To check if sign up's are open join the discord too find out. In general all applications will require the following information:
            <ul>
                <li>Your Discordname with #</li>
                <li>Your Gamertag / IGN,</li>
                <li>Your Platform</li>
                <li>Your Region</li>
                <li>Your estimated skill level (Bronze/Silver/Gold/Platinum/Diamond/Masters)</li>
                <li>Skill level of the team you have in mind(Estimation of all members combined)</li>
            </ul>
            </span>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
            <ContextAwareToggle eventKey="3">How do the stats get collected?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
            <Card.Body>
            <p className="m-0">The stats get collected with the match IDs of each played match. 
            These match IDs get submitted by the team captains after each match, with this match ID a request gets made to the Hirez-api, 
            this returns all the data of the match.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="4">
            <ContextAwareToggle eventKey="4">How many games are played per matchup?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="4">
            <Card.Body>
            <p className="m-0">By default each matchup is a best of 3, so the max amount of games is 3, the minimum amount is 2.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="5">
            <ContextAwareToggle eventKey="5">Is there a discord where i can contact other players / captains?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="5">
            <Card.Body>
            <p className="m-0">Of course there is! <a href="https://discord.gg/PNAH9P9RJU" target="_blank">Click here to join</a></p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="6">
            <ContextAwareToggle eventKey="6">Is the Smite Champions League cross region?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="6">
            <Card.Body>
            <p className="m-0"><b>Not by default</b>, however there could be special divisions that allow for cross region play.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="7">
            <ContextAwareToggle eventKey="7">Is the Smite Champions League cross platform?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="7">
            <Card.Body>
            <p className="m-0"><b>By default divisions are cross platform</b>, there could however be divisions that are locked to 1 platform and /or input method</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        </Accordion>
    </>
);
}
