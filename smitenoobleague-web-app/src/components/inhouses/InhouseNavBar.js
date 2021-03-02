//import react-bootstrap navbar parts 
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import {Button} from "react-bootstrap";
//nextjs router hook
import { useRouter } from "next/router";
//optimized images
import Img from 'react-optimized-image';
import Logo from "public/images/SNL_Navbar_Logo.png";
//import Logo from "public/images/REVAMPCOLLAB.png";
//icon
import {FaDiscord} from "react-icons/fa";
//dynamic head
import Head from "next/head";
//custom imports
import InhouseNavBarSubmitButton from "src/components/inhouses/InhouseNavBarSubmitButton";

export default function InhouseNavBar({LoginSession, apiToken}) {
    
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
                <Navbar.Brand href="/inhouses" className={router?.pathname == "/inhouses" ? "p-0 d-flex active" : "p-0 d-flex"}>
                <Img src={Logo} webp sizes={[60, 120]} width="60" height="60" className="d-inline-block align-top" alt="SNL" draggable={false}/>
                <h3 className="font-weight-bold my-auto ml-2">Inhouses</h3>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/inhouses/matchhistory" className={router?.pathname.includes("/inhouses/matchhistory") ? "active" : ""}>Match history</Nav.Link>
                    <Nav.Link href="/inhouses/leaderboards" className={router?.pathname == "/inhouses/leaderboards" ? "active" : ""}>Leaderboards</Nav.Link>
                    {/* <Nav.Link href="https://discord.gg/ZZxqtaZvuj" className="" target="_blank">Join SNL <FaDiscord/></Nav.Link> */}
                    </Nav>
                    <Nav>
                    {LoginSession?.isMod || LoginSession?.isAdmin ?
                        <InhouseNavBarSubmitButton apiToken={apiToken} /> : <> </>}
                        {LoginSession?.user != null ? 
                        <> 
                        <Nav.Link href="/api/logout">
                            Logout
                        </Nav.Link> 
                        </> : <>                    
                        {/* <Nav.Link href="/api/login">
                            Login
                        </Nav.Link>  */}
                        </>}
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
        </>
    );
}