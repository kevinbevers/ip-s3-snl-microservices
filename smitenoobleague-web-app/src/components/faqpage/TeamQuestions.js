import React, {useContext} from "react";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import Card from "react-bootstrap/Card";
import {FaAngleUp, FaAngleDown} from "react-icons/fa";

export default function TeamQuestions() {

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
        <h3 className="font-weight-bold">Team questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <ContextAwareToggle eventKey="0">How many substitute players are allowed? (fills)</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
            <p className="m-0">When a player in your team can't play, you can result to a substitute player.
            There is only <b>1 substitute</b> allowed per team ensuring the original team is mostly intact.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
            <ContextAwareToggle  eventKey="1">How do i join a team?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
            <p className="m-0">When you want to join a team you should contact one of the team captains and ask if they are looking for a team member. 
            Secondly you could contact the league admin and sign up as a team captain and form a team yourself.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
            <ContextAwareToggle eventKey="2">How many players are in a team?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
            <Card.Body>
            <p className="m-0">Each team consists out of <b>5 players</b> each player plays one of the Conquest roles: Solo, Jungle, Mid, Support, ADC.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        </Accordion>
    </>
);
}
