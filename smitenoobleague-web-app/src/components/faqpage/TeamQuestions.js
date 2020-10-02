import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export default function TeamQuestions() {
return (
    <>
        <h3 className="font-weight-bold">Team questions</h3>
        <hr />
        <Accordion>
        
        <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
            <h5 className="m-0">How many substitute players are allowed? (fills)</h5>
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
            <h5 className="m-0">How do i join a team?</h5>
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
            <h5 className="m-0">How many players are in a team?</h5>
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
