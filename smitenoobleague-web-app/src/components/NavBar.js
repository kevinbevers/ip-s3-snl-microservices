//import react-bootstrap navbar parts 
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

//nextjs router hook
import { useRouter } from "next/router";
export default function NavBar() {

    const router = useRouter();

    return (
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Brand href="/" className="p-0" className={router.pathname == "/" ? "active" : ""}>
                <img src="/images/SNL_Navbar_Logo.png" width="60" height="60" className="d-inline-block align-top" alt="Smitenoobleague logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/captainpage" className={router.pathname == "/captainpage" ? "active" : ""}>Captain page</Nav.Link>
                    <NavDropdown title="Stats" id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="/stats/team" className={router.pathname == "/stats/team" ? "active" : ""}>Team stats</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/stats/player" className={router.pathname == "/stats/player" ? "active" : ""}>Player stats</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/schedules" className={router.pathname == "/schedules" ? "active" : ""}>Schedules</Nav.Link>
                    <Nav.Link href="/matchhistory" className={router.pathname == "/matchhistory" ? "active" : ""}>Match history</Nav.Link>
                    <Nav.Link href="/standings" className={router.pathname == "/standings" ? "active" : ""}>Standings</Nav.Link>
                    <Nav.Link href="/leaderboards" className={router.pathname == "/leaderboards" ? "active" : ""}>Leaderboards</Nav.Link>
                    <Nav.Link href="/news" className={router.pathname == "/news" ? "active" : ""}>News</Nav.Link>
                    <Nav.Link href="/rules" className={router.pathname == "/rules" ? "active" : ""}>Rules</Nav.Link>
                    <Nav.Link href="/faq" className={router.pathname == "/faq" ? "active" : ""}>FAQ</Nav.Link>
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