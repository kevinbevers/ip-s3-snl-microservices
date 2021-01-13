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

describe("Test gameID submission", () => {
  //Setup the mock
  beforeAll(async () => {
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
  });
  //Renderpage
  beforeEach(async() => {
    //use get serversideprops.
    const { props } = await CaptainPage.getServerSideProps("", "", "");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status} />);
  });

  test("Pressing submit where gameID is empty, should return a warning msg to the user", async () => {
    //number of expects that should be completed
    expect.assertions(4);
    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    expect(inputField).toBeInTheDocument();
    //user clicks on the submit button without entering data in the inputfield
    const submitButton = await screen.findByTestId("captainPageSubmitButton");
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

  test("Pressing submit where gameID is too short, should return a error msg to the user", async () => {
    //number of expects that should be completed
    expect.assertions(4);
    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 123 } });
    expect(inputField.value).toBe("123");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton = await screen.findByTestId("captainPageSubmitButton");
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

  test("Pressing submit where gameID is too long, should return a error msg to the user", async () => {
    //number of expects that should be completed
    expect.assertions(4);
    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 12345678901 } });
    expect(inputField.value).toBe("12345678901");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton = await screen.findByTestId("captainPageSubmitButton");
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

  test("Pressing submit where gameID is valid and api returns a 200, should return a success msg to user", async () => {
    //number of expects that should be completed
    expect.assertions(4);
    //Mock api SubmitMatchID
    captainservice.SubmitMatchID.mockResolvedValue({
      status: 200,
      data: "Match stats successfully saved"
    });
    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 1234567 } });
    expect(inputField.value).toBe("1234567");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton = await screen.findByTestId("captainPageSubmitButton");
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

  test("Pressing submit where gameID is invalid and api return a 404, should return a error msg to user", async () => {
    //number of expects that should be completed
    expect.assertions(4);
    //Mock api SubmitMatchID
    captainservice.SubmitMatchID.mockRejectedValue({
      response: {
        status: 404,
        data: "There was no scheduled matchup found between these teams."
      }
    });
    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 1234567 } });
    expect(inputField.value).toBe("1234567");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton = await screen.findByTestId("captainPageSubmitButton");
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

  test("Pressing submit where gameID is invalid and api returns a 400, should return a error msg to user", async () => {
    //number of expects that should be completed
    expect.assertions(4);
    //Mock api SubmitMatchID
    captainservice.SubmitMatchID.mockRejectedValue({
      response: {
        status: 400,
        data: "The submitted match is not a custom conquest match with drafts."
      }
    });
    //check if the captainPage match input is rendered
    const inputField = await screen.findByTestId("captainPageMatchIdInput");
    fireEvent.change(inputField, { target: { value: 1234567 } });
    expect(inputField.value).toBe("1234567");
    //user clicks on the submit button without entering data in the inputfield
    const submitButton = await screen.findByTestId("captainPageSubmitButton");
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

describe("Test page error capturing", () => {

  test("API returns that no team was found with the given account ID", async () => {
    //number of expects that should be completed
    expect.assertions(1);
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
      user: { sub: "captainuserid" },
      isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockRejectedValue({
      response: {
      status: 404,
      data: "No captain found with the given Account ID."
    }
    });
    //use get serversideprops.
    const { props } = await CaptainPage.getServerSideProps("", "", "");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status} />);
    //error page should show
    const errorText = await screen.findByText("404");
    expect(errorText).toBeInTheDocument();
  });

  test("API doesn't responsed which results in a response null and shows service unavailable to the user", async () => {
    //number of expects that should be completed
    expect.assertions(1);
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
      user: { sub: "captainuserid" },
      isCaptain: true
    });
    //Mock accessToken
    helpers.GetAccessTokenForClient.mockResolvedValue("hello");
    //Mock getting api data
    captainservice.GetTeamByCaptainID.mockRejectedValue({response: null});
    //use get serversideprops.
    const { props } = await CaptainPage.getServerSideProps("", "", "");
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status} />);
    //error page should show
    const errorText = await screen.findByText("503");
    expect(errorText).toBeInTheDocument();
  });

  test("navigate to captainpage without being logged in, redirect to login url", async () => {
    //number of expects that should be completed
    expect.assertions(1);
    //Mock login        
    helpers.GetLoginSession.mockResolvedValue({
      user: null,
      isCaptain: false
    });
    //mock res for usage in the ssr
    const res = {
      setHeader: jest.fn()
    };
    //use get serversideprops.
    const { props } = await CaptainPage.getServerSideProps({req: {}, params: "", res: res});
    //render the page with the given props
    render(<Captain LoginSession={props.LoginSession} apiResponse={props.apiResponse} apiToken={props.apiToken} errMsg={props.errMsg} status={props.status} />);
    //error page should show
    expect(res.setHeader).toHaveBeenLastCalledWith('Location', `/api/login`);
  });

});