//default react imports
import React, { useState, useEffect } from "react";
//bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
//custom components
import ScheduleItem from "src/components/ScheduleItem";

export default function ScheduleBlock({Schedule}) {
  //First time render set the initial state values
  //CurrentWeekNumber
  const [weekNumber, setWeekNumber] = useState(Schedule?.currentWeek);
  //Max number of weeks
  const [maxWeeks, setMaxWeeks] = useState(Schedule.matchups[Schedule?.matchups.length - 1].weekNumber);
  //Matchups in the current selectedWeek
  const [shownMatchups, setShownMatchups] = useState(Schedule.matchups.filter(mu => mu.weekNumber == Schedule?.currentWeek));

  //If the Schedule gets updated / changed trigger this use effect
  useEffect(() => {
    setWeekNumber(Schedule?.currentWeek < 1 ? 1 : Schedule?.currentWeek);
    setMaxWeeks(Schedule.matchups[Schedule?.matchups.length - 1].weekNumber);
    setShownMatchups(Schedule.matchups.filter(mu => mu.weekNumber == (Schedule?.currentWeek < 1 ? 1 : Schedule?.currentWeek)));
  }, [Schedule]);

  const calculateWeekString = () => {
    let weekStartDate = new Date(Schedule.scheduleStartDate);
    weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7);
    let weekEndDate =  new Date(Schedule.scheduleStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + (weekNumber * 7) - 1);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const weekDateString = <><b> {weekStartDate.toLocaleDateString('en-EN', options)} </b> until <b>{weekEndDate.toLocaleDateString('en-EN', options)}</b></>;

    return weekDateString;
  };

  const IncrementWeekNumber = () => {
    setWeekNumber(weekNumber + 1);
    setShownMatchups(Schedule.matchups.filter(mu => mu.weekNumber == weekNumber + 1));
  };

  const DecrementWeekNumber = () => {
    setWeekNumber(weekNumber - 1);
    setShownMatchups(Schedule.matchups.filter(mu => mu.weekNumber == weekNumber - 1));
  };

  return (
    <>
        <Row>
          <Col md={3}></Col>
          <Col md={6} className="d-inline-flex justify-content-center">
            {/* show previous button if we are not on first element */}
            <Button variant="primary" disabled={weekNumber == 1} onClick={DecrementWeekNumber}>prev</Button>
            <h4 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">Schedule Week {weekNumber}</h4>
            {/* hide next button if we are at the last element */}
            <Button variant="primary" disabled={weekNumber >= maxWeeks} onClick={IncrementWeekNumber}>next</Button>
          </Col>
          <Col md={3}></Col>
        </Row>
        <Row className="mt-2">
          <Col md={1} xl={2}></Col>
          <Col md={10} xl={8} className="text-center">
              <p>{calculateWeekString()}</p>
              {shownMatchups.map((m, index) => (
                  <ScheduleItem key={index} homeTeam={m.homeTeam} awayTeam={m.awayTeam} matchupID={m.matchupID} byeWeek={m.byeWeek} score={m.score}/>     
              ))}
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
    </>
  );
}