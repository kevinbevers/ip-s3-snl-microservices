//Test imports
const { interopDefault } = require("next/dist/next-server/server/load-components");
import { getByTestId, render, screen, waitFor, fireEvent } from "@testing-library/react";
//mock canvas for the Charts
import "jest-canvas-mock";

//Page imports
import Home from "../pages/index";
import Captain from "../pages/captainpage";
import Faq from "../pages/faq";
import Leaderboard from "../pages/leaderboards";
import Matchhistory from "../pages/matchhistory";
import News from "../pages/news";
import Rules from "../pages/rules";
import Schedules from "../pages/schedules";
import Standings from "../pages/standings";
import TeamList from "../pages/stats/team";
import PlayerList from "../pages/stats/player";

describe("Render all pages", () => {
    it("Landing page - index.js", () => {
        render(<Home />);
    });
    it("Captain page - captainpage.js", () => {
        render(<Captain />);
    });
    it("FAQ page - faq.js", () => {
        render(<Faq />);
    });
    it("Leaderboard page - leaderboards.js", () => {
        render(<Leaderboard />);
    });
    it("Matchhistory page - matchhistory.js", () => {
        render(<Matchhistory />);
    });
    it("News page - news.js", () => {
        render(<News />);
    });
    it("Rules page - rules.js", () => {
        render(<Rules />);
    });
    it("Schedules page - schedules.js", () => {
        render(<Schedules />);
    });
    it("Standing page - standings.js", () => {
        render(<Standings />);
    });
    it("Standing page - standings.js", () => {
        render(<TeamList />);
    });
    it("Standing page - standings.js", () => {
        render(<PlayerList />);
    });
});