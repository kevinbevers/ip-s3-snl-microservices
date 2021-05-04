//import react-bootstrap navbar parts 
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
//nextjs router hook
import { useRouter } from "next/router";
//optimized images
import Img from 'react-optimized-image';
import Logo from "public/images/SNL_Navbar_Logo.png";
//icon
import {FaDiscord} from "react-icons/fa";
//dynamic head
import Head from "next/head";

export default function NavBar({LoginSession}) {
    
    const router = useRouter();

    return (
        <>
        <Head>
        <meta name="twitter:card" key={"twitter:card"} content="summary_large_image" />
        <meta name="twitter:site" key="twitter:site" content="@Smitenoobleague" />
        <meta name="twitter:title" key="twitter:title" content="Schedules, Stats, Leaderboards and more" />
        <meta name="twitter:description" key="twitter:description" content="Smitenoobleague is a website for a fully automated smite amateur league where teams can sign up, compete, see their stats and captains can manage their teams." />
        <meta name="twitter:image" key="twitter:image" content="https://smitenoobleague.com/images/twitterbanner.jpg" />
        </Head>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="darktext font-weight-bold">
                <Navbar.Brand href="/" className={router?.pathname == "/" ? "p-0 active" : "p-0"}>
                <Img src={Logo} webp sizes={[60, 120]} width="60" height="60" className="d-inline-block align-top" alt="SNL" draggable={false}/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    {LoginSession?.isCaptain ? <><Nav.Link href="/captainpage" className={router?.pathname == "/captainpage" ? "active" : ""}>Captain page</Nav.Link></> : <> </>}
                    <NavDropdown title="Stats" id={"collapsible-nav-dropdown"} className={router?.pathname.includes("/stats")  ? "active" : ""}>
                        <NavDropdown.Item href="/stats/team" className={router?.pathname.includes("/stats/team") ? "active font-weight-bold" : "font-weight-bold"}>Team stats</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/stats/player" className={router?.pathname.includes("/stats/player")  ? "active font-weight-bold" : "font-weight-bold"}>Player stats</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/schedules" className={router?.pathname == "/schedules" ? "active" : ""}>Schedules</Nav.Link>
                    <Nav.Link href="/matchhistory" className={router?.pathname.includes("/matchhistory") ? "active" : ""}>Match history</Nav.Link>
                    <Nav.Link href="/standings" className={router?.pathname == "/standings" ? "active" : ""}>Standings</Nav.Link>
                    <Nav.Link href="/leaderboards" className={router?.pathname == "/leaderboards" ? "active" : ""}>Leaderboards</Nav.Link>
                    <Nav.Link href="/news" className={router?.pathname == "/news" ? "active" : ""}>News</Nav.Link>
                    <Nav.Link href="/rules" className={router?.pathname == "/rules" ? "active" : ""}>Rules</Nav.Link>
                    <Nav.Link href="/faq" className={router?.pathname == "/faq" ? "active" : ""}>FAQ</Nav.Link>
                    <Nav.Link href="https://discord.gg/PNAH9P9RJU" className="" target="_blank">Join <FaDiscord/></Nav.Link>{/*https://discord.gg/ZZxqtaZvuj*/}
                    {/* {LoginSession?.isMod ? <><Nav.Link href="/moderate" className={router?.pathname == "/moderate" ? "active" : ""}>Moderate dashboard</Nav.Link></> : <> </>}
                    {LoginSession?.isAdmin ? <><Nav.Link href="/manage" className={router?.pathname == "/manage" ? "active" : ""}>Manage dashboard</Nav.Link></> : <> </>} */}
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
        </>
    );
}