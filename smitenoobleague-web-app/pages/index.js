//import react-bootstrap navbar parts 
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import FullBackground from '../src/components/FullBackground'

export default function Home() {
  return (
    <>
    <FullBackground src='/images/dark_bg.png' />
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand href="#home" className="p-0">
      <img src="/images/SNL_Navbar_Logo.png" width="60" height="60" className="d-inline-block align-top" alt="Smitenoobleague logo"/>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#Captainpage">Captain page</Nav.Link>
          <NavDropdown title="Stats" id="collapsible-nav-dropdown">
            <NavDropdown.Item href="#stats/team">Team stats</NavDropdown.Item>
            <NavDropdown.Item href="#stats/player">Player stats</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#stats/seperatedlink">Separated link</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#Schedules">Schedules</Nav.Link>
          <Nav.Link href="#Matchhistory">Match history</Nav.Link>
          <Nav.Link href="#Standings">Standings</Nav.Link>
          <Nav.Link href="#Leaderboards">Leaderboards</Nav.Link>
          <Nav.Link href="#News">News</Nav.Link>
          <Nav.Link href="#Rules">Rules</Nav.Link>
          <Nav.Link href="#FAQ">FAQ</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href="#account">
            Accountname
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  <div className="jumbotron-fluid">
    {/* render body here */}
    <div className=" container halfTransparent mb-2 mt-5 rounded p-3" id="welcomeScreen">
        <h1 className="display-5">Hello, welcome to the Smite Noob League website!</h1>
        <p className="lead">On this site you can view information about the league, including stats and game results.</p>
        <hr className="my-4" />
        <p>If you want more information about the league click the button below to check out our FAQ page</p>
        <p className="lead">
            <a className="btn btn-primary btn-lg mb-4 btn-block" href="#" role="button">I want Info</a>
        </p>
    </div>
  </div>
  <wrapper className="d-flex flex-column">
      <footer className="border-top footer text-muted bg-white">
          <div className="ml-2 mr-2 text-center">
              <div className="float-left footertext m-0">&copy; 2020 - Smite Noob League Website made by Kevin Bevers</div>
              <div className="float-right footertext m-0">Social links?!</div>
          </div>
      </footer>
      </wrapper>
    </>
  )
}
