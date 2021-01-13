//Test imports
const { interopDefault } = require("next/dist/next-server/server/load-components");
import { getByTestId, render, screen, waitFor, fireEvent, toBeInTheDocument } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
//mock canvas for the Charts
import "jest-canvas-mock";

//Page imports
import Captain from "pages/captainpage";
const CaptainPage = require("pages/captainpage");
import captainservice from "services/captainservice";
import helpers from "utils/helpers"
//mock captain service
jest.mock("services/captainservice");
jest.mock("utils/helpers");

describe("Test userinput on the captainpage", () => {

  it("Pressing submit where gameID is empty, should return a warning msg to the user", async () => {
    expect.assertions(4);
    //#region Setup the mocks
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
        user: { sub: "captainuserid" },
        isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockResolvedValue({
        status: 200,
        data: {
          teamID: 1,
          teamName: "teamname",
          divisionID: 1,
          teamLogoPath: "imagelocation",
          teamMembers: [
            {
              teamMemberID: 1,
              teamMemberName: "captainname",
              teamMemberRole: {
                roleID: 1,
                roleName: "Solo"
              },
              teamCaptain: true,
              teamMemberPlatform: "PS4",
              playerID: 1234
            }
          ]
        },
    });
    //#endregion

    //use get serversideprops.
    const {props} = await CaptainPage.getServerSideProps("","","");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status}/>);

    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    expect(inputField).toBeInTheDocument();
    //user clicks on the submit button without entering data in the inputfield
    const submitButton =  await screen.findByTestId("captainPageSubmitButton");
    fireEvent.click(submitButton);
    //user expects error message to show
    const alertBox = await screen.findByTestId("captainPageMatchAlert");
    expect(alertBox).toBeInTheDocument();
    //expect red background for error
    expect(alertBox.className).toContain("alert-warning");   
    //user expects error message to show
    const alertBoxText = await screen.findByTestId("captainPageMatchAlertText");
    //textContext to select the text within the <p>
    expect(alertBoxText.textContent).toBe("gameID not filled in.");
  });

  it("Pressing submit where gameID is too short, should return a error msg to the user", async () => {
    expect.assertions(4);
    //#region Setup the mocks
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
        user: { sub: "captainuserid" },
        isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockResolvedValue({
      response: {
        status: 200,
        data: {
          teamID: 1,
          teamName: "teamname",
          divisionID: 1,
          teamLogoPath: "imagelocation",
          teamMembers: [
            {
              teamMemberID: 1,
              teamMemberName: "captainname",
              teamMemberRole: {
                roleID: 1,
                roleName: "Solo"
              },
              teamCaptain: true,
              teamMemberPlatform: "PS4",
              playerID: 1234
            }
          ]
        },
      }
    });
    //#endregion

    //use get serversideprops.
    const {props} = await CaptainPage.getServerSideProps("","","");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status}/>);

    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 123 } });
    expect(inputField.value).toBe("123");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton =  await screen.findByTestId("captainPageSubmitButton");
    fireEvent.click(submitButton);
    //user expects error message to show
    const alertBox = await screen.findByTestId("captainPageMatchAlert");
    expect(alertBox).toBeInTheDocument();
    //expect red background for error
    expect(alertBox.className).toContain("alert-danger");   
    //user expects error message to show
    const alertBoxText = await screen.findByTestId("captainPageMatchAlertText");
    //textContext to select the text within the <p>
    expect(alertBoxText.textContent).toBe("gameID too short to be valid. a minimum of 5 characters is required");
  });

  it("Pressing submit where gameID is too long, should return a error msg to the user", async () => {
    expect.assertions(4);
    //#region Setup the mocks
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
        user: { sub: "captainuserid" },
        isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockResolvedValue({
        status: 200,
        data: {
          teamID: 1,
          teamName: "teamname",
          divisionID: 1,
          teamLogoPath: "imagelocation",
          teamMembers: [
            {
              teamMemberID: 1,
              teamMemberName: "captainname",
              teamMemberRole: {
                roleID: 1,
                roleName: "Solo"
              },
              teamCaptain: true,
              teamMemberPlatform: "PS4",
              playerID: 1234
            }
          ]
        }
    });
    //#endregion

    //use get serversideprops.
    const {props} = await CaptainPage.getServerSideProps("","","");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status}/>);

    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 12345678901 } });
    expect(inputField.value).toBe("12345678901");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton =  await screen.findByTestId("captainPageSubmitButton");
    fireEvent.click(submitButton);
    //user expects error message to show
    const alertBox = await screen.findByTestId("captainPageMatchAlert");
    expect(alertBox).toBeInTheDocument();
    //expect red background for error
    expect(alertBox.className).toContain("alert-danger");   
    //user expects error message to show
    const alertBoxText = await screen.findByTestId("captainPageMatchAlertText");
    //textContext to select the text within the <p>
    expect(alertBoxText.textContent).toBe("gameID too long to be valid. a maximum of 10 characters is allowed");
  });

  it("Pressing submit where gameID is valid and api returns a 200, should return a success msg to user", async () => {
    expect.assertions(4);
    //#region Setup the mocks
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
        user: { sub: "captainuserid" },
        isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockResolvedValue({
        status: 200,
        data: {
          teamID: 1,
          teamName: "teamname",
          divisionID: 1,
          teamLogoPath: "imagelocation",
          teamMembers: [
            {
              teamMemberID: 1,
              teamMemberName: "captainname",
              teamMemberRole: {
                roleID: 1,
                roleName: "Solo"
              },
              teamCaptain: true,
              teamMemberPlatform: "PS4",
              playerID: 1234
            }
          ]
        }
    });
    //Mock api SubmitMatchID
    captainservice.SubmitMatchID.mockResolvedValue({
        status: 200,
        data: "Match stats successfully saved"
    });
    //#endregion

    //use get serversideprops.
    const {props} = await CaptainPage.getServerSideProps("","","");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status}/>);

    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 1234567 } });
    expect(inputField.value).toBe("1234567");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton =  await screen.findByTestId("captainPageSubmitButton");
    fireEvent.click(submitButton);
    //user expects error message to show
    const alertBox = await screen.findByTestId("captainPageMatchAlert");
    expect(alertBox).toBeInTheDocument();
    //expect red background for error
    expect(alertBox.className).toContain("alert-success");    
    //user expects error message to show
    const alertBoxText = await screen.findByTestId("captainPageMatchAlertText");
    //textContext to select the text within the <p>
    expect(alertBoxText.textContent).toBe("Match stats successfully saved");
  });

  it("Pressing submit where gameID is invalid and api return a 404, should return a error msg to user", async () => {
    expect.assertions(4);
    //#region Setup the mocks
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
        user: { sub: "captainuserid" },
        isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockResolvedValue({
        status: 200,
        data: {
          teamID: 1,
          teamName: "teamname",
          divisionID: 1,
          teamLogoPath: "imagelocation",
          teamMembers: [
            {
              teamMemberID: 1,
              teamMemberName: "captainname",
              teamMemberRole: {
                roleID: 1,
                roleName: "Solo"
              },
              teamCaptain: true,
              teamMemberPlatform: "PS4",
              playerID: 1234
            }
          ]
        }
    });
    //Mock api SubmitMatchID
    captainservice.SubmitMatchID.mockRejectedValue({
      response: {
        status: 404,
        data: "There was no scheduled matchup found between these teams."
      }
    });
    //#endregion

    //use get serversideprops.
    const {props} = await CaptainPage.getServerSideProps("","","");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status}/>);

    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 1234567 } });
    expect(inputField.value).toBe("1234567");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton =  await screen.findByTestId("captainPageSubmitButton");
    fireEvent.click(submitButton);
    //user expects error message to show
    const alertBox = await screen.findByTestId("captainPageMatchAlert");
    expect(alertBox).toBeInTheDocument();
    //expect red background for error
    expect(alertBox.className).toContain("alert-danger");
    //user expects error message to show
    const alertBoxText = await screen.findByTestId("captainPageMatchAlertText");
    //textContext to select the text within the <p>
    expect(alertBoxText.textContent).toBe("There was no scheduled matchup found between these teams.");
  });

  it("Pressing submit where gameID is invalid and api returns a 400, should return a error msg to user", async () => {
    expect.assertions(4);
    //#region Setup the mocks
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
        user: { sub: "captainuserid" },
        isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockResolvedValue({
        status: 200,
        data: {
          teamID: 1,
          teamName: "teamname",
          divisionID: 1,
          teamLogoPath: "imagelocation",
          teamMembers: [
            {
              teamMemberID: 1,
              teamMemberName: "captainname",
              teamMemberRole: {
                roleID: 1,
                roleName: "Solo"
              },
              teamCaptain: true,
              teamMemberPlatform: "PS4",
              playerID: 1234
            }
          ]
        }
    });
    //Mock api SubmitMatchID
    captainservice.SubmitMatchID.mockRejectedValue({
      response: {
        status: 400,
        data: "The submitted match is not a custom conquest match with drafts."
      }
    });
    //#endregion

    //use get serversideprops.
    const {props} = await CaptainPage.getServerSideProps("","","");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status}/>);

    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 1234567 } });
    expect(inputField.value).toBe("1234567");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton =  await screen.findByTestId("captainPageSubmitButton");
    fireEvent.click(submitButton);
    //user expects error message to show
    const alertBox = await screen.findByTestId("captainPageMatchAlert");
    expect(alertBox).toBeInTheDocument();
    //expect red background for error
    expect(alertBox.className).toContain("alert-danger");
    //user expects error message to show
    const alertBoxText = await screen.findByTestId("captainPageMatchAlertText");
    //textContext to select the text within the <p>
    expect(alertBoxText.textContent).toBe("The submitted match is not a custom conquest match with drafts.");
  });

});