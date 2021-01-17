//default react imports
import React, { useState, useEffect } from "react";
//default page stuff
import NavBar from "src/components/NavBar";
import Footer from "src/components/Footer";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, FormControl, Form } from "react-bootstrap";
//component
import PlayerCard from "src/components/PlayerCard";
//Auth
import helpers from "utils/helpers";
//services
import divisionservice from "services/divisionservice";
import playerservice from "services/playerservice";

export default function player({LoginSession, DivisionList, PlayerList}) {
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
          setPlayersMatched(PlayersToShow.filter(p => 
            p.teamMember.teamMemberName.toLowerCase().includes(evt.target.value.toLowerCase()) ||
            p.teamMember.teamMemberRole.roleName.toLowerCase().includes(evt.target.value.toLowerCase()) ||
            p.team.teamName.toLowerCase().includes(evt.target.value.toLowerCase()) ||
            p.teamMember.teamMemberPlatform.toLowerCase().includes(evt.target.value.toLowerCase())
          ));
        }
        else 
        {
          setPlayersMatched(PlayersToShow);
        }
      };
  
      //Select Division
      const [SelectedDivisionID, setSelectedDivisionID] = useState(DivisionList?.length > 0 ? DivisionList[0]?.divisionID: 0);
      const changeDivision = async(evt) => {
        setSelectedDivisionID(evt.target.value);
        setSearchValue("");
        //check if the no division is selected or one of the other divisions
        if(evt.target.value == 0)
        {
          //Get teams that are in no division
          await playerservice.GetListOfPlayersByDivisionID(null).then((res) => {setPlayersToShow(res.data);}).catch((error) => {setPlayersToShow(null)});
        }
        else 
        {         
          //Get teams from selected division
          await playerservice.GetListOfPlayersByDivisionID(evt.target.value).then((res) => {setPlayersToShow(res.data); setPlayersMatched(res.data);}).catch((error) => {setPlayersToShow(null); setPlayersMatched([]);});
        }
  
      };
  
      useEffect(() => {
        if(Divisions?.length > 0)
        {
          //Add the teams without division
          setDivisions(Divisions.concat({divisionID: 0, divisionName: "Division-less Players"}));
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
                <PlayerCard key={index} Player={p.teamMember} Team={p.team}/>
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
                  <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No players found</h3>
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
  
  const loginSessionData = await helpers.GetLoginSession(context.req);
    //Get division names and id and get the list of teams for the first division in the list
    let listOfDivisions = [];
    let listOfPlayers = null;
    //Get division data from api
    await divisionservice.GetBasicListOfDivisions().then(res => { listOfDivisions = res.data }).catch(err => { });
    
      //check if there are divisions, if yes check if the first division has teams
  if (listOfDivisions?.length > 0) {
    //get division teams from api
    await playerservice.GetListOfPlayersByDivisionID(listOfDivisions[0]?.divisionID)
      .then((res) => {
        listOfPlayers = res.data;
      })
      .catch((error) => {
      });
  }

  return {
      props: {
          LoginSession: loginSessionData,
          DivisionList: listOfDivisions,
          PlayerList: listOfPlayers
      },
  };
}