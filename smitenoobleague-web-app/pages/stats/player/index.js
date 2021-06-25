//default react imports
import React, { useState, useEffect } from "react";
import nookies from "nookies";
import { parseCookies, setCookie, destroyCookie } from "nookies";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap components
import { Container, FormControl, Form, Row, Col, Alert } from "react-bootstrap";
//component
import PlayerCard from "src/components/PlayerCard";
//Auth
import helpers from "utils/helpers";
//services
import divisionservice from "services/divisionservice";
import playerservice from "services/playerservice";

export default function player({LoginSession, DivisionList, PlayerList, selectedDiv}) {
      //Divisions for dropdown
      const [Divisions, setDivisions] = useState(DivisionList);
      //Players to show
      const [PlayersToShow, setPlayersToShow] = useState(PlayerList);
      //For searching
      const [PlayersMatched, setPlayersMatched] = useState(PlayerList);
      const [SearchValue, setSearchValue] = useState("");

      const searchChange = (evt) => {
        setSearchValue(evt.target.value);

        if(evt.target.value?.length > 0)
        {
          setPlayersMatched(PlayersToShow?.filter(p => 
            p.player?.teamMemberName.toLowerCase().includes(evt.target.value.toLowerCase()) ||
            p.player?.teamMemberRole.roleName.toLowerCase().includes(evt.target.value.toLowerCase()) ||
            p.team?.teamName.toLowerCase().includes(evt.target.value.toLowerCase()) ||
            p.player?.teamMemberPlatform.toLowerCase().includes(evt.target.value.toLowerCase())
          ));
        }
        else 
        {
          setPlayersMatched(PlayersToShow);
        }
      };
  
      //Select Division
      const [SelectedDivisionID, setSelectedDivisionID] = useState(selectedDiv);
      const changeDivision = async(evt) => {
        setSelectedDivisionID(evt.target.value);
        setCookie(null, 'selected_division', evt.target.value, {path: "/"});
        setSearchValue("");
        //check if the no division is selected or one of the other divisions
        if(evt.target.value == 0)
        {
          //Get teams that are in no division
          await playerservice.GetListOfPlayersByDivisionID(null).then((res) => {setPlayersToShow(res.data); setPlayersMatched(res.data); setSearchValue("");}).catch((error) => {setPlayersToShow(null)});
        }
        else 
        {         
          //Get teams from selected division
          await playerservice.GetListOfPlayersByDivisionID(evt.target.value).then((res) => {setPlayersToShow(res.data); setPlayersMatched(res.data); setSearchValue("");}).catch((error) => {setPlayersToShow(null); setPlayersMatched([]);});
        }
  
      };
  
      useEffect(() => {
        if(Divisions?.length > 0)
        {
          //Add the players without division
          if(!Divisions.includes(x => x.divisionID == 0))
          {
          setDivisions(Divisions.concat({divisionID: 0, divisionName: "Division-less Players"}));
          }
        }
      }, []);

    return (
      <>      
        <NavBar LoginSession={LoginSession}/>
        <Container className="mt-4">
        <Row className="">
          <Col md={12} xl={8} className="mx-auto">
            <Row>
              <Col md={6} className="mx-auto">
                <Form>
                  <Form.Group controlId="selectDivision">
                    <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivisionID}>
                      {Divisions?.length > 0 ? Divisions.map((d, index) => (
                        <option key={index} disabled={d.divisionID == 0 && d.divisionName == "No divisions"} value={d.divisionID}>{d.divisionName}</option>
                      )): <option disabled value={0}>{ "No divisions"}</option>}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6} className="mx-auto">
            <FormControl
              value={SearchValue}
              onChange={searchChange}
              className="searchinput"
              placeholder="Filter by name, role, platform in division..."
              aria-label="Filter and Search players"
              aria-describedby="Search and Filter"
            />
          </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12} xl={8} className="mx-auto">
            {/*Player cards */}
            {PlayersToShow != null ? <>
              {PlayersMatched?.length > 0 ? PlayersMatched.map((p, index) => (
                <PlayerCard key={index} Player={p.player} Team={p.team}/>
              )): 
              <Row className="mt-5">
              <Col md={3}></Col>
              <Col md={6} className="d-inline-flex justify-content-center">
                <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No players found</h3>
              </Col>
              <Col md={3}></Col>
            </Row> }
             </> : 
             <> 
              <Row className="mt-5">
                <Col md={3}></Col>
                <Col md={6} className="d-inline-flex justify-content-center">
                <Alert variant="warning" className="rounded">
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No players found</h3>
                </Alert>
                </Col>
                <Col md={3}></Col>
              </Row> 
            </>}
          </Col>
        </Row>
      </Container>
        <Footer />
      </>
    );
}

export async function getServerSideProps(context) {
  //parse cookies
  const cookies = nookies.get(context);

  const loginSessionData = await helpers.GetLoginSession(context.req);
    //Get division names and id and get the list of teams for the first division in the list
    let listOfDivisions = [];
    let listOfPlayers = null;
    //Get division data from api
    await divisionservice.GetBasicListOfDivisions().then(res => { listOfDivisions = res.data.filter(d => d.teamCount != null) }).catch(err => {});
    
    //check if there are divisions, if yes check if the first division has teams
if (listOfDivisions?.length > 0) {

  if(cookies['selected_division'] == 0)
  {
      //get division-less players from api
      await playerservice.GetListOfPlayersByDivisionID(null)
      .then((res) => {
        listOfPlayers = res.data;
      })
      .catch((error) => {
      });
  }
  else {

  if (cookies != null && cookies['selected_division'] != undefined && listOfDivisions.filter(x => x.divisionID == cookies['selected_division']).length != 0) {
      //get division players from api
      await playerservice.GetListOfPlayersByDivisionID(cookies['selected_division'])
      .then((res) => {
        listOfPlayers = res.data;
      })
      .catch((error) => {
      });
    }
    else {
      nookies.set(context, 'selected_division', listOfDivisions[0]?.divisionID, {path: "/"});
      //get division players from api
      await playerservice.GetListOfPlayersByDivisionID(listOfDivisions[0]?.divisionID)
      .then((res) => {
        listOfPlayers = res.data;
      })
      .catch((error) => {
      });
    }
  }
}

  return {
      props: {
          LoginSession: loginSessionData,
          DivisionList: listOfDivisions != [] ? listOfDivisions : [{divisionID: 0, divisionName: "Division-less Players"}],
          PlayerList: listOfPlayers,
          selectedDiv: cookies['selected_division'] != undefined ? cookies['selected_division'] : listOfDivisions.filter(d => d.teamCount != null || d.currentScheduleID != null)?.length > 0 ? listOfDivisions.filter(d => d.teamCount != null || d.currentScheduleID != null)[0]?.divisionID : 0
      },
  };
}