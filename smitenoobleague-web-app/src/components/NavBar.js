//import react-bootstrap navbar parts 
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
//nextjs router hook
import { useRouter } from "next/router";
//optimized images
import Img from 'react-optimized-image';
import Logo from "public/images/SNL_Navbar_Logo.png";

export default function NavBar({LoginSession}) {
    
    const router = useRouter();

    return (
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="darktext">
                <Navbar.Brand href="/" className="p-0" className={router?.pathname == "/" ? "active" : ""}>
                <Img src={Logo} webp sizes={[60, 120]} width="60" height="60" className="d-inline-block align-top" alt="Smitenoobleague logo" draggable={false}/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    {LoginSession?.isCaptain ? <><Nav.Link href="/captainpage" className={router?.pathname == "/captainpage" ? "active darktext" : "darktext"}>Captain page</Nav.Link></> : <> </>}
                    <NavDropdown title="Stats" id={"collapsible-nav-dropdown"} className={router?.pathname.includes("/stats")  ? "active" : ""}>
                        <NavDropdown.Item href="/stats/team" className={router?.pathname.includes("/stats/team") ? "active darktext" : "darktext"}>Team stats</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/stats/player" className={router?.pathname.includes("/stats/player")  ? "active darktext" : "darktext"}>Player stats</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/schedules" className={router?.pathname == "/schedules" ? "active darktext" : "darktext"}>Schedules</Nav.Link>
                    <Nav.Link href="/matchhistory" className={router?.pathname == "/matchhistory" ? "active darktext" : "darktext"}>Match history</Nav.Link>
                    <Nav.Link href="/standings" className={router?.pathname == "/standings" ? "active darktext" : "darktext"}>Standings</Nav.Link>
                    <Nav.Link href="/leaderboards" className={router?.pathname == "/leaderboards" ? "active darktext" : "darktext"}>Leaderboards</Nav.Link>
                    <Nav.Link href="/news" className={router?.pathname == "/news" ? "active darktext" : "darktext"}>News</Nav.Link>
                    <Nav.Link href="/rules" className={router?.pathname == "/rules" ? "active darktext" : "darktext"}>Rules</Nav.Link>
                    <Nav.Link href="/faq" className={router?.pathname == "/faq" ? "active darktext" : "darktext"}>FAQ</Nav.Link>
                    </Nav>
                    <Nav>
                        {LoginSession?.user != null ? 
                        <> 
                        <Nav.Link href="/api/logout">
                            Logout
                        </Nav.Link> 
                        </> : <>                    
                        <Nav.Link href="/api/login">
                            Login
                        </Nav.Link> 
                        </>}
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
    );
}