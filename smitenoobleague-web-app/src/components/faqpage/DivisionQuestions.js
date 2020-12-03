import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"

export default function DivisionQuestions() {
return (
    <>
        <h3 className="font-weight-bold">Division questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <h5 className="m-0">How many teams are in a division?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
            <Card.Body>
            <p className="m-0">there are <b>4 to 8 teams</b> in a division.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
            <h5 className="m-0">How do points get calculated for the division standings?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
            <p className="m-0">Each match that gets played is a best of 3. If a team wins with 2-0 they get awarded 3 points. 
            If a team wins with 2-1 they get awarded 2 points and the opossing team with 1 point. If a team loses with 0-2 they get awarded 0 points</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
            <h5 className="m-0">How many games do you play per week?</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
            <Card.Body>
            <p className="m-0">You play <b>1</b> game per week. 
            If your team can"t play a week then you it"s expected that you play that game the week after and play the regular game of that week.</p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
            <h5 className="m-0">How many weeks do you play per split</h5>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
            <Card.Body>
            <p className="m-0">You play against every team 2 times, 1 Home game and 1 Away game. 
            If there are 4 teams in your division that would mean you play a 6 week split. <br /><b># of weeks is # of opponents * 2</b></p>
            </Card.Body>
        </Accordion.Collapse>
        </Card>

        </Accordion>
    </>
);
}
