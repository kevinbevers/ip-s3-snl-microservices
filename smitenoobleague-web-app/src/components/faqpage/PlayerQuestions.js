import React, {useContext} from "react";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import Card from "react-bootstrap/Card";
import {FaAngleUp, FaAngleDown} from "react-icons/fa";

export default function PlayerQuestions() {

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
        <h3 className="font-weight-bold">Player questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <ContextAwareToggle eventKey="0">Can I substitute for a team I play against next week?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
            <p className="m-0"><b>No,</b> to keep the competitive spirit intact it is not allowed to fill for a team you play against the week after. 
            This ensures competitive integrity and prevents you from gaining an advantage.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
            <ContextAwareToggle eventKey="1">Can I leave a team as a player?</ContextAwareToggle>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
            <p className="m-0">When you want to leave a team you should inform your team captain, your team captain can then remove you from the team roster.
            It is currently not possible to do this yourself.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        </Accordion>
    </>
);
}
