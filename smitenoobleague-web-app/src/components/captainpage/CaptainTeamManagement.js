//default react imports
import React, { useState, useEffect } from "react";
//bootstrap components
import { Container, Row, Col, Card, Toast } from "react-bootstrap";
//custom imports
import { FaEdit, FaCheck, FaBan } from "react-icons/fa";
import { ReactSortable} from "react-sortablejs";
import PlayerManagement from "src/components/captainpage/PlayerManagement";
//importing images
import Jungle from "public/images/roles/Jungle_Logo.png";
import Solo from "public/images/roles/Solo_Logo.png";
import Support from "public/images/roles/Support_Logo.png";
import Mid from "public/images/roles/Mid_Logo.png";
import Adc from "public/images/roles/Adc_Logo.png";
//API
import captainservice from "services/captainservice";
//image optimization
import Img from 'react-optimized-image';

export default function CaptainTeamManagement({apiResponse,apiToken,adminManage}) {
      //#region TeamMembers
  const [teamMembers, setTeamMembers] = useState([]);
  //const [test, setTest] = useState([{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }, { id: 3, name: "Player 3" }, { id: 4, name: "Player 4" }, { id: 5, name: "Player 5" }]);
  //Get every team member for each role. to make sure they are on the correct position if less then 5 members get returned
  useEffect(() => {
    const team = [];
    const solo = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 1)[0];
    team.push(solo != undefined ? solo : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 1, roleName: "Solo" } }); //SOLO
    const jungle = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 2)[0]
    team.push(jungle != undefined ? jungle : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 2, roleName: "Jungle" } }); //JUNGLE
    const mid = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 3)[0];
    team.push(mid != undefined ? mid : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 3, roleName: "Mid" } }); //MID
    const support = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 4)[0];
    team.push(support != undefined ? support : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 4, roleName: "Support" } }); //SUPPORT
    const adc = apiResponse?.teamMembers.filter(member => member.teamMemberRole.roleID == 5)[0];
    team.push(adc != undefined ? adc : { playerID: null, teamCaptain: null, teamMemberID: null, teamMemberName: null, teamMemberPlatform: null, teamMemberRole: { roleID: 5, roleName: "Adc" } }); //ADC

    setTeamMembers(team);

  }, []);

  const updateSwap = async (event) => {

    if (teamMembers[event.oldIndex]?.teamMemberID != null || teamMembers[event.newIndex]?.teamMemberID != null) {
      const Roles = ["Solo", "Jungle", "Mid", "Support", "Adc"];

      const items = Array.from(teamMembers);
      //Set correct roles. swapping them in the array doesn't change the object value. 
      items[event.oldIndex].teamMemberRole.roleID = event.newIndex + 1;
      items[event.newIndex].teamMemberRole.roleID = event.oldIndex + 1;
      items[event.oldIndex].teamMemberRole.roleName = Roles[event.newIndex];
      items[event.newIndex].teamMemberRole.roleName = Roles[event.oldIndex];
      //swap items at index
      items[event.newIndex] = teamMembers[event.oldIndex];
      items[event.oldIndex] = teamMembers[event.newIndex];

      if (event.oldIndex != event.newIndex) {
        if (items[event.newIndex].teamMemberID != null) {
          const data = {
            teamMemberID: items[event.newIndex].teamMemberID,
            roleID: items[event.newIndex].teamMemberRole.roleID
          };
          //api call to update role
          await captainservice.UpdatePlayerRole(apiToken, data).then(res => { }).catch(err => { SetNote({ msg: err?.response?.data, type: "bg-danger" }); SetNotify(true); });
        }
        else if (items[event.oldIndex].teamMemberID != null) {
          const data = {
            teamMemberID: items[event.oldIndex].teamMemberID,
            roleID: items[event.oldIndex].teamMemberRole.roleID
          };
          //api call to update role
          await captainservice.UpdatePlayerRole(apiToken, data).then(res => { }).catch(err => { SetNote({ msg: err?.response?.data, type: "bg-danger" }); SetNotify(true); });
        }
      }

      setTeamMembers(items);
    }
  };
  //#endregion

    //#region notify
    const [notify, SetNotify] = useState(false);
    const [note, SetNote] = useState({ msg: "", type: "", title: "" });
    const toggleNotify = () => SetNotify(!notify);
    //#endregion

    return (<>
<Card className="bg-light w-100 h-100">
                <Card.Body className="">
                  <Container>
                    <Row><Col><h2 className="font-weight-bold">MANAGE TEAM</h2></Col></Row>
                    <Row>
                      <Col md={1} xs={2}>
                        <Row className="mb-2">
                          <Img webp src={Solo} className="PlayerRole my-auto" draggable={false} alt="Solo"></Img>
                        </Row>
                        <Row className="mb-2">
                          <Img webp src={Jungle} className="PlayerRole my-auto" draggable={false} alt="Jungle"></Img>
                        </Row>
                        <Row className="mb-2">
                          <Img webp src={Mid} className="PlayerRole my-auto" draggable={false} alt="Mid"></Img>
                        </Row>
                        <Row className="mb-2">
                          <Img webp src={Support} className="PlayerRole my-auto" draggable={false} alt="Support"></Img>
                        </Row>
                        <Row className="mb-2">
                          <Img webp src={Adc} className="PlayerRole my-auto" draggable={false} alt="Adc"></Img>
                        </Row>
                      </Col>
                      <Col md={1} xs={0} className="d-none d-sm-none d-md-block"></Col>
                      <Col md={10} xs={10}>
                        <ReactSortable
                          group="TeamMembers" list={teamMembers}
                          setList={() => { }}
                          onUpdate={(ev) => updateSwap(ev)}
                          swap={true}
                          swapClass={"text-success"}
                          chosenClass={"PlayerBoxGrapped"}
                          dragClass={"PlayerBoxGrapped"}
                          delayOnTouchOnly={false}
                          delay={100}>

                          {teamMembers.map((member, index) => (
                            <PlayerManagement key={index} member={member} apiToken={apiToken} teamID={apiResponse?.teamID} adminManage={adminManage} />
                          ))}
                        </ReactSortable>
                        <Row><Col><h6 className="text-muted float-right ExtraInfoText d-none d-sm-block">Drag and drop players to swap their roles.</h6><h6 className="text-muted float-right ExtraInfoText d-block d-sm-none">Hold and drag players to swap their roles.</h6></Col></Row>
                      </Col>
                    </Row>

                    {/* Maybe have an info alert here. with info about the page */}
                  </Container>


                </Card.Body>
              </Card>
                      {/* Notification Toast */}

        <Toast show={notify} onClose={() => SetNotify(false)} delay={3000} autohide style={{ position: 'fixed', top: 5, right: 5, }}>
          <Toast.Header className={"text-white " + note?.type}>
            <img
              src="/images/SNL_Navbar_Logo.png"
              className={"rounded mr-2"}
              height={22}
              alt=""
            />
            <strong className="mr-auto pr-3">{note?.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="bg-white rounded">{note?.msg}</Toast.Body>
        </Toast>
              </>
    );
}