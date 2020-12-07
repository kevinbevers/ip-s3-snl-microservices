import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"

export default function PlayerQuestions() {
return (
    <>
        <h3 className="font-weight-bold">Player questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <h5 className="m-0">Can I substitute for a team I play against next week?</h5>
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
            <h5 className="m-0">Can I leave a team as a player?</h5>
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
