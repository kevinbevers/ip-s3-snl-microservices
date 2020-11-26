//Test imports
const { interopDefault } = require("next/dist/next-server/server/load-components");
import { getByTestId, render, screen, waitFor, fireEvent } from '@testing-library/react';
//mock canvas for the Charts
import 'jest-canvas-mock';

//Page imports
import Captain from '../pages/captainpage';

describe("Test userinput on the captainpage", () => {
    it("Pressing submit without filling in a gameID should return a message / warning to the user", () => {
       expect(true);
    });
});