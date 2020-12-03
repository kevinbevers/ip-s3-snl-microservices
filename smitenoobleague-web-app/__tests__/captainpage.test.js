//Test imports
const { interopDefault } = require("next/dist/next-server/server/load-components");
import { getByTestId, render, screen, waitFor, fireEvent } from "@testing-library/react";
//mock canvas for the Charts
import "jest-canvas-mock";

//Page imports
import Captain from "../pages/captainpage";

describe("Test userinput on the captainpage", () => {
    it.skip("Pressing submit without filling in a gameID should return a message / warning to the user", async () => {
       render(<Captain />);
       await waitFor(() => { //user waits for the form to have rendered
            expect(screen.findByTestId("formSubmitGameIdCaptainPage")).toBeInTheDocument();
       });
       //user clicks on the submit button without entering data in the inputfield
       fireEvent.click(screen.findByTestId("buttonSubmitGameIdCaptainPage"));
       //user expects error message to show
       expect((await screen.findByTestId("formSubmitMessageCaptainPage")));
    });
});