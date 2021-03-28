//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//boostrap components
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
//import background component
import FullBackground from "../src/components/FullBackground";
//Auth
import auth0 from "utils/auth0";

export default function rules({LoginSession}) {
  return (
    <>
        <FullBackground src={"rules_bg"} />
      <NavBar LoginSession={LoginSession}/>
      <Container className="mt-4">
        <Row>
          <Col md={2} xl={3}></Col>
          <Col md={8} xl={6}>
            <Alert variant="dark">
              <Alert.Heading className="text-center"><b>Table of contents</b></Alert.Heading>
              <h5 className="text-center">Smitenoobleague rules</h5>
              <hr />
              <Row>
                <Col md={7} className="mx-auto">
              <div id="content-table" className="ml-3">
              <a href="#rule1"><b>1. Match rules</b></a><br />
              <a href="#rule1.1" className="subrule">1.1. Be there or be square</a><br />
              <a href="#rule1.2" className="subrule">1.2. Substitute player</a><br />
              <a href="#rule1.3" className="subrule">1.3. Home team & Away team</a><br />
              <a href="#rule1.4" className="subrule">1.4. Match settings</a><br />
              <a href="#rule1.5" className="subrule">1.5. Gods available for play</a><br />
              <a href="#rule1.6" className="subrule">1.6. Ending of a match</a><br />
              <a href="#rule1.7" className="subrule">1.7. Submitting the match id’s</a><br />

              <a href="#rule2"><b>2. Scheduling rules</b></a><br />
              <a href="#rule2.1" className="subrule">2.1. Planning the match</a><br />
              <a href="#rule2.2" className="subrule">2.2. Unavailability</a><br />
              <a href="#rule2.3" className="subrule">2.3. Catch-up match</a><br />
              <a href="#rule2.4" className="subrule">2.4. Not playing on purpose.</a><br />

              <a href="#rule3"><b>3. Team / roster rules</b></a><br />
              <a href="#rule3.1" className="subrule">3.1. Trading players</a><br />
              <a href="#rule3.2" className="subrule">3.2. Free agents</a><br />
              <a href="#rule3.3" className="subrule">3.3. Player availability</a><br />
              <a href="#rule3.4" className="subrule">3.4. Teamname and logo</a><br />

              <a href="#rule4"><b>4. General league rules</b></a><br />
              <a href="#rule4.1" className="subrule">4.1. Match format</a><br />
              <a href="#rule4.2" className="subrule">4.2. Player investment</a><br />
              <a href="#rule4.3" className="subrule">4.3. Clear communication</a><br />
              <a href="#rule4.4" className="subrule">4.4. Input devices</a><br />
              <a href="#rule4.5" className="subrule">4.5. Penalty points</a><br />

              <a href="#rule5"><b>5. In-game rules</b></a><br />
              <a href="#rule5.1" className="subrule">5.1. Pausing</a><br />
              <a href="#rule5.2" className="subrule">5.2. Inappropriate player name</a><br />
              <a href="#rule5.3" className="subrule">5.3. Intentional feeding</a><br />
              <a href="#rule5.4" className="subrule">5.4. Banned skins</a><br />
              <a href="#rule5.5" className="subrule">5.5. In-Game behaviour</a><br />
              </div>
              </Col>
              </Row>
            </Alert>
          </Col>
          <Col md={2} xl={3}></Col>
        </Row>
        <Row>
        <Col md={1} xl={2}></Col>
          <Col md={10} xl={8} className="bg-light rounded p-4 mb-4">
            {/* Rules Section 1 */}
          <h4 id="rule1" className="font-weight-bold">1. Match rules</h4>
          <p>In this section the rules for setting up the match and what should be done before and after a match will be described.</p>
          <h5 id="rule1.1" className="font-weight-bold">1.1. Be there or be square</h5>
          <p>To ensure no one’s time is wasted each player in the matchup should be ready to play at least 10 minutes before the agreed start time between the 2 team captains.
          <br /><br />
          If a player is 15 minutes late the violating player will receive 1 penalty point. Upon reaching 5 penalty points a player is suspended from the league for 4 weeks.
          <br /><br />
          If a player is 30 minutes late the violating team will forfeit 1 game and the player’s team will be starting the matchup with a deficit.
          <br /><br />
          After waiting a total of 35 minutes the waiting team automatically wins the matchup with a 2 – 0 victory.
          <br /><br />
          If a player or team doesn’t show up for a matchup without notifying both the league admin and the opposing captain. They will forfeit the matchup and lose a 2 – 0. And the whole team will receive 1 penalty point.
          <br /> Upon receiving 5 penalty points the team will be suspended from the league up to 1 full split.
          </p>
          <h5 id="rule1.2" className="font-weight-bold">1.2. Substitute player</h5>
          <p>If one of the players in a matchup is not available for play the captain of the team in need of a substitute, should arrange for one at least 1 hour before the matchup starts and communicate the substitute to the opposing captain. 
          <br /><br />
          Only 1 substitute player is allowed per team per matchup. If one of the teams is using more than 1 fill the games will be invalided by the system.
          A substitute player cannot be from the opposing team from next week’s matchup, to keep the competitive integrity intact.
          <br /><br />
          Substitute players should not be put on the roster in the captain dashboard. And should just join the match instead of the player that needs to be substituted.
          </p>
          <h5 id="rule1.3" className="font-weight-bold">1.3. Home team & Away team</h5>
          <p>By nature of the schedule system each team is divided into a home and away team. Each team plays every opponent twice. 1 time as the home team and 1 time as the away team.
          <br /><br />
          The captain of the home team is responsible for submitting the game ID after each game is played. See <a href="#rule1.7">rule 1.7</a>.
          The home team in a matchup can choose on which side they start the first game in the matchup, they can choose between: 
          first ban, first pick(order) or second ban, second pick(chaos).
          <br /><br />
          After that initial game the losing team can choose sides.
          </p>
          <h5 id="rule1.4" className="font-weight-bold">1.4. Match settings</h5>
          <p>The in-game match settings should be the following:</p>
            <ul>
              <li>Match type: Conquest</li>
              <li>Starting level: 1</li>
              <li>Team size: 5 v 5</li>
              <li>Player pick: Draft-Conquest</li>
              <li>Staring level: Level 1</li>
              <li>Starting gold: 1500</li>
              <li>Pause type: free</li>
              <li>Bonus time: 90</li>
              <li>Region: Region of the team's division</li>
              <li>Allow Spectators/Record Demo: On</li>
              <li>Password: SNL(MatchupWeek) e.g., SNLWeek1</li>
              <li>Spectator password: [Leave this blank]</li>
            </ul>
          <h5 id="rule1.5" className="font-weight-bold">1.5. Gods available for play</h5>
          <p>All gods are allowed to be played in a SNL game, with exceptions to break cases. If a God is not available for comp play because of a game breaking bug the god is also not allowed to be played in a SNL game until fixed. Team’s still picking these gods will be penalized with at least 1 penalty point.</p>
          <h5 id="rule1.6" className="font-weight-bold">1.6. Ending of a match</h5>
          <p>At the end of a game the home team captain submits the game ID on his captain dashboard. 
          <br /><br />
            After that the home team captain sets up a new lobby. The losing team has the choice of sides (order, chaos).
            <br /><br />
            This repeats itself until the Best of 3 is played out. The best of 3 is completed if one of the 2 teams has reached 2 wins.
          </p>
          <h5 id="rule1.7" className="font-weight-bold">1.7. Submitting the match id’s</h5>
          <p>
          The captain of the home team is responsible for submitting the match ID after each game is played. On the first instance, failing to do so will result in a forfeit of that game as no proof is provided. <br />
          There will not be opportunity to replay the game as this could be exploited to change the outcome of the set overall.
          <br /><br />
          Upon repeatedly neglecting to submit the match ID a 5-point deduction of current split standings for the violating team will be implemented.
          </p>
          {/* Rules Section 2 */}
          <h4 id="rule2" className="font-weight-bold">2. Scheduling rules</h4>
          <p>In this section the rules for Scheduling a match are described and what happens when you can"t or don"t show up.</p>
          <h5 id="rule2.1" className="font-weight-bold">2.1. Planning the match</h5>
          <p>Each team is put into a division based on skill, at the start of a division split a schedule is automatically generated. This schedule is based upon a weekly basis and requires teams to play 1 best of 3 matchup per week. The schedule is available at all times and can be viewed on <a href="/schedules">https://smitenoobleague.com/schedules</a> choose your division and the schedule from the current week will automatically show.
          <br /><br /> 
          It’s expected that captains contact each other and plan a day and time in the week where both teams can play a maximum 3 games of smite. Including picks and bans this will around 3 hours. Alternatively, both captains can agree to play the games spread out over the week. It is how ever preferred that teams when possible play the 3 games at once to keep the competitive spirit intact.
          </p>
          <h5 id="rule2.2" className="font-weight-bold">2.2. Unavailability</h5>
          <p>If one of player’s in a team isn’t available for play the captain should look for a substitute player (see <a href="#rule1.2">rule 1.2</a>). If no substitute player could be found. The captains should plan a catchup for the matchup in one of the 2 upcoming weeks. Not being able to catchup on the matchup will result in <a href="#rule2.3">rule 2.3</a>.<br /> The opposing captain should be notified at least 4 hours before the supposed matchup was planned.</p>
          <h5 id="rule2.3" className="font-weight-bold">2.3. Catch-up match</h5>
          <p>If one of the teams can’t play for the week, the captains should contact the admin and plan a catchup day and time in one of the 2 upcoming weeks. If the matchup isn’t caught up after 2 weeks when it was initially planned the team that couldn’t play initially will forfeit the matchup.</p>
          <h5 id="rule2.4" className="font-weight-bold">2.4. Not playing on purpose.</h5>
          <p>Following <a href="#rule2.3">rule 2.3</a> a team could maybe think they will purposely not play the matchup to receive a free win. Doing this will result in 5 penalty points immediately meaning the team can’t play for at least 4 weeks.
            <br /><br />
          Teams might also not want to play against a certain Team in their division for whatever reason. Not playing the matchup against this team will result in 4 penalty points and forfeit of the match. Doing this 2 times in a split will cause the violating team to be suspended for the next split.
          </p>
          {/* Rules Section 3 */}
          <h4 id="rule3" className="font-weight-bold">3. Team / roster rules</h4>
          <p>In this section the rules for teams and rosters get described, what is allowed as a team and what is not.</p>
          <h5 id="rule3.1" className="font-weight-bold">3.1. Trading players</h5>
          <p>Teams are allowed to trade players between them. This however may only happen within the same division. additionally, 3 out of the 5 players on the roster are locked and cannot be changed during a split.
            <br /> <br />
            Trading with other divisions may only occur between splits or when the admin has been notified of a trade request and approves of it.
          </p>
          <h5 id="rule3.2" className="font-weight-bold">3.2. Free agents</h5>
          <p>A team can pick up a free agent at any time. The team that started the split should always stay in the majority, meaning that 3 out of the 5 players on the roster are locked and cannot be changed during a split. Once a free agent is picked up and played for more than 2 weeks the player cannot be kicked of the team until the end of the season. Unless an agreement with the admin is reached.
          <br /> <br />
          Free agents can be used as substitutes. And should not be put in the roster when used a substitute.
          <br /> <br />
          Exceptions to picking up Free agents are specified in <a href="#rule3.3">rule 3.3</a>
          </p>
          <h5 id="rule3.3" className="font-weight-bold">3.3. Player availability</h5>
          <p>Each player in the league should at least be available for 3 hours each week to participate in a best of 3 matchup. If a player is not able to play for multiple times during split, they can be replaced by the team captain after the admin was notified. When multiple players in a team don’t have enough availability, the captain can request an exception on <a href="#rule3.2">rule 3.2</a> and pick up the required number of new players for the team.</p>
          <h5 id="rule3.4" className="font-weight-bold">3.4. Teamname and logo</h5>
          <p>The name and logo of a team are displayed on multiple occasions. A team’s name should be appropriate as should the team’s logo. Violating this rule will cause the team to receive penalty points depending on the severity. If the team offense was severe the team and its player are banned from the Smitenoobleague. If it’s a mild offense the team could be placed under a restriction not being able to edit their name or logo for the remainder of the split.
            <br /> <br />
          appropriate is a matter of opinion however things that are definitely out of line include but not limited to the following: Hate speech, Racism, Discrimination, Mocking persons, Pornography.
          </p>
          {/* Rules Section 4 */}
          <h4 id="rule4" className="font-weight-bold">4. General league rules</h4>
          <p>In this section the general rules for the league get layed-out.</p>
          <h5 id="rule4.1" className="font-weight-bold">4.1. Match format</h5>
          <p>The Smitenoobleague matchups are best of 3’s meaning that one of the teams should win 2 times in order to secure the matchup. Each week 1 matchup is played this matchup is conceived of a home and away team. All captains and players are expected to follow this match format. A split’s length is depended on the number of teams in division. The length of a split is number of (teams – 1) * 2. E.g. For 8 teams the split takes 14 weeks. </p>
          <h5 id="rule4.2" className="font-weight-bold">4.2. Player investment</h5>
          <p>All players should have enough availability to compete in the league. See <a href="#rule3.3">rule 3.3.</a>
          In order for the Smitenoobleague to succeed player should be invested in playing the game at their highest level and not to treat the matchups as glorified casual games.
          When a player isn’t invested in the league and throws games and does not show up regularly, they are prone to be kicked from the league for a set amount of time.
          </p>
          <h5 id="rule4.3" className="font-weight-bold">4.3. Clear communication</h5>
          <p>It’s expected from all captains to clearly communicate to each other about when to play the planned matchup as is it expected that communication to the admin is direct and precise. Not communicating clearly could cause the captain to be set out of position and one of the players on the team is asked to step up to the captain role.
            <br /> <br />
          It’s also expected from players that they communicate their availability to their captain so that the captain is informed when planning the weekly matchup. Not complying with this rule will result in 2 penalty points for the player, if this is a reoccurring situation the player could be kicked from the league.
          </p>
          <h5 id="rule4.4" className="font-weight-bold">4.4. Input devices</h5>
          <p>For the Smitenoobleague all devices are equal. However, there may be a division’s that are restricted on input device or platform to keep the competition as close as possible in these division. If a player or team is caught not following this rule, they are prone to being kicked from the Smitenoobleague.</p>
          <h5 id="rule4.5" className="font-weight-bold">4.5. Penalty points</h5>
          <p>If a player or team breaks a rule, they are given penalty points. After 5 penalty points actions are taken against the team or player. The actions that are taken range from being suspended to being permanently removed from competing in the Smitenoobleague.
            <br /> <br />
          The least number of weeks a player can be suspended is 2 weeks. The highest number of weeks a player can be suspended for is 20 weeks. There may be exceptions to this rule based on the severity of the rule breaking.
          <br /> <br />
          The longest period a team can be suspended for is 1 full split.
          <br /> <br />
          Suspended teams and players are not allowed to compete in the Smitenoobleague during the suspension. This includes substituting for other teams.
          </p>
          {/* Rules Section 5 */}
          <h4 id="rule5" className="font-weight-bold">5. In-Game rules</h4>
          <p>In this section the in-game rules for players get described.</p>
          <h5 id="rule5.1" className="font-weight-bold">5.1. Pausing</h5>
          <p>Each team may pause a maximum of 10 minutes per match.
            <br /> <br />
          During a matchup the maximum time the pauses combined can last is 20 minutes. A team may only pause with valid reason. If the reason is deemed invalid the team may need to forfeit the match to the opposing team for false pausing trying to gain a competitive advantage.
          <br /> <br />
          If a match needs to be paused for exceptions the captain of the pausing team should contact the admin. 
          <br />
          Pauses are not meant to go for a quick walk with the dog or to pee quickly. Or to have a quick tactical talk with the team. Teams using the pause for these reasons may receive point deduction penalty for the current split standings.<br />
          Pauses can be used for players that need to reconnect, emergencies or responsibilities out side of smite that need immediate attention.
          </p>
          <h5 id="rule5.2" className="font-weight-bold">5.2. Inappropriate player name</h5>
          <p>When a Player name is deemed inappropriate, they are not allowed to compete in the Smitenoobleague until their name is changed.</p>
          <h5 id="rule5.3" className="font-weight-bold">5.3. Intentional feeding</h5>
          <p>If a player or team is intentionally feeding in one of the matchups, they are prone to an immediate suspension of the whole split. If this is a reoccurring issue the player or team in question are banned from the Smitenoobleague and are not allowed to compete in the Smitenoobleague anymore.</p>
          <h5 id="rule5.4" className="font-weight-bold">5.4. Banned skins</h5>
          <p>All skins that are banned in the SPL because they give a competitive advantage are banned from usage in the Smitenoobleague. If a player gets reported using a banned skin the players team will receive a 5-point score deduction for their current split standings.
          <br /> <br />
          A list of banned skins in the SPL can be found here: <br /> <a href="https://www.smiteproleague.com/news/smite-pro-league-list-of-banned-skins">Click to view list of banned skins.</a>
          <br /> one Extra skin that is banned is 'Ma Chérie Arachne'
          </p>
          <h5 id="rule5.5" className="font-weight-bold">5.5. In-Game behaviour</h5>
          <p>
            To keep the league in a healthy environment excessive spam taunting, laughing or otherwise spamming opponents / teammates is not condoned. <br />
            Not complying with this rule will result in 1 to 5 penalty points for the offending player(s) and can result in a ban from the league.
            <br />
            <br />
            If someone is harrassing or being toxic in your game send a short clip or screenshot of chat to one of the admins so they can review it. <br />
            Of course spam taunting one or twice can be fun, but excessive use or going out of your way to do so will not be condoned.
          </p>
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  //get session
  const session = await auth0.getSession(context.req);
  //Check if logged in user is captain to show captainpage in navbar
  let Captain = false;

  if(session?.user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes("Captain"))
  {
    Captain = true;
  }
  else {
    Captain = false;
  }

  return {
      props: {
          LoginSession: {
          user: session?.user || null,
          isCaptain: Captain
          }
      },
  };
}


