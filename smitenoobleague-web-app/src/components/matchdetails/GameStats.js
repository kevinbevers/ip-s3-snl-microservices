

export default function GameData(MatchResult, teamsInMatch) {

    const [totals, setTotals] = useState();
    const CalculateTotals = (winner, loser) => {

        let totals = { killCount: 0, fireGiantsWinner: 0, fireGiantsLoser: 0, goldFuriesWinner: 0, goldFuriesLoser: 0 }

        winner.forEach(p => { totals.killCount += p.kills; totals.fireGiantsWinner += p.fireGiantsKilled; totals.goldFuriesWinner += p.goldFuriesKilled; });
        loser.forEach(p => { totals.killCount += p.kills; totals.fireGiantsLoser += p.fireGiantsKilled; totals.goldFuriesLoser += p.goldFuriesKilled; });

        return totals;
    };

    useEffect(() => {
        if (MatchResult != null) {
            setTotals(CalculateTotals(MatchResult?.winners, MatchResult?.losers));
        }
    }, []);

    return (
        <Row>
            <Col xl={2} md={0}></Col>
            <Col xl={8} md={9} xs={12}>
                {/* Team 1 */}
                <TeamTable playerdata={MatchResult.winners} team={teamsInMatch.filter(t => t.teamID == MatchResult.winningTeamID)[0]} />
                {/* Divider */}
                <Row><Col className="my-auto text-center"><h5 className="mb-0 font-weight-bolder">VS</h5></Col></Row>
                {/* Team 2 */}
                <TeamTable playerdata={MatchResult.losers} team={teamsInMatch.filter(t => t.teamID == MatchResult.losingTeamID)[0]} />
            </Col>
            <Col xl={2} md={3} className="my-auto">
                <Alert variant="secondary">
                    <h5 className="font-weight-bold">Game stats</h5>
                    <hr />
                    <h6><b>Game length:</b> {MatchResult?.matchDuration}</h6>
                    <h6><b>Total kills:</b> {totals?.killCount}</h6>
                    <h6 className="d-flex"><b>FG's 🔥taken:</b> <span className="mr-1 ml-1">{totals?.fireGiantsWinner}</span> {RenderTeamImage(teamsInMatch.filter(t => t.teamID == MatchResult?.winningTeamID)[0])} <span className="ml-1 mr-1">{totals?.fireGiantsLoser}</span> {RenderTeamImage(eamsInMatch.filter(t => t.teamID == MatchResult?.losingTeamID)[0])}</h6>
                    <h6 className="d-flex"><b>GF's 🔱taken:</b> <span className="mr-1 ml-1">{totals?.goldFuriesWinner}</span> {RenderTeamImage(teamsInMatch.filter(t => t.teamID ==MatchResult?.winningTeamID)[0])} <span className="ml-1 mr-1">{totals?.goldFuriesLoser}</span> {RenderTeamImage(teamsInMatch.filter(t => t.teamID == MatchResult?.losingTeamID)[0])}</h6>
                    <h6 className="d-flex"> <b className="mr-1">MVP:</b> <Image height={20} width={20} src={"https://static.smite.guru/i/champions/icons/ratatoskr.jpg"} alt="MvpGod" className="GodImg rounded" /> <span className="ml-1">lolliepoep</span></h6>
                    <p className="mb-0">A little text describing the game, possibly auto generated.</p>
                </Alert>
            </Col>
        </Row>
    );
}