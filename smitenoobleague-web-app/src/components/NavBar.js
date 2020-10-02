//import react-bootstrap navbar parts 
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function NavBar() {

    return (
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand href="/" className="p-0">
                <img src="/images/SNL_Navbar_Logo.png" width="60" height="60" className="d-inline-block align-top" alt="Smitenoobleague logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/captainpage">Captain page</Nav.Link>
                    <NavDropdown title="Stats" id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="/stats/team">Team stats</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/stats/player">Player stats</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/schedules">Schedules</Nav.Link>
                    <Nav.Link href="/matchhistory">Match history</Nav.Link>
                    <Nav.Link href="/standings">Standings</Nav.Link>
                    <Nav.Link href="/leaderboards">Leaderboards</Nav.Link>
                    <Nav.Link href="/news">News</Nav.Link>
                    <Nav.Link href="/rules">Rules</Nav.Link>
                    <Nav.Link href="/faq">FAQ</Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link href="#account">
                        Accountname
                    </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
    );
}