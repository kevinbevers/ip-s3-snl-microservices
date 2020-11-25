using System;
using System.Collections.Generic;
using System.Linq;
using division_microservice.Models.Internal;

namespace division_microservice.Classes
{
    public static class Scheduling
    {
        public static IEnumerable<Matchup> Create(List<MatchupTeam> ListTeam)
        {
            List<Matchup> matchups = new List<Matchup>();
            //if teams are uneven
            if (ListTeam.Count % 2 != 0)
            {
                ListTeam.Add(new MatchupTeam { TeamName = "No match planned", TeamID = 999999 });
            }
            List<MatchupTeam> teams = new List<MatchupTeam>();

            teams.AddRange(ListTeam); // Copy all the elements.
            teams.RemoveAt(0); // To exclude the first team.

            matchups.AddRange(RoundRobin(ListTeam, teams));
            matchups.AddRange(RoundRobinInverted(ListTeam,teams));

            //return schedule
            return matchups;

        }

        private static IList<Matchup> RoundRobin(IList<MatchupTeam> ListTeam, IList<MatchupTeam> teams)
        {
            IList<Matchup> matchups = new List<Matchup>();
            int numTeams = ListTeam.Count();
            int numWeeks = (numTeams - 1);
            int numTeamsHalf = numTeams / 2;
            int teamsSize = teams.Count();
            //matchup id
            int matchID = 0;

            for (int week = 0; week < numWeeks; week++)
            {
                matchID++;

                int teamIdx = week % teamsSize;

                //add matchup for team 1 vs team 2
                matchups.Add(new Matchup
                {
                    MatchupID = matchID,
                    WeekNumber = week + 1,
                    HomeTeam = ListTeam[0],
                    AwayTeam = teams[teamIdx],
                    ByeWeek = teams[teamIdx].TeamID == 999999 || ListTeam[0].TeamID == 999999 ? true : false,
                });

                //add the rest of the match ups
                for (int index = 1; index < numTeamsHalf; index++)
                {
                    matchID++;
                    //team index
                    int firstTeam = (week + index) % teamsSize;
                    int secondTeam = (week + teamsSize - index) % teamsSize;

                    matchups.Add(new Matchup
                    {
                        MatchupID = matchID,
                        WeekNumber = week + 1,
                        HomeTeam = teams[firstTeam],
                        AwayTeam = teams[secondTeam],
                        ByeWeek = teams[firstTeam].TeamID == 999999 || teams[secondTeam].TeamID == 999999 ? true : false,
                    });
                }
            }
            return matchups;
        }
        private static IList<Matchup> RoundRobinInverted(IList<MatchupTeam> ListTeam, IList<MatchupTeam> teams)
        {
            IList <Matchup> matchups = new List<Matchup>();
            int numTeams = ListTeam.Count();
            int numWeeks = (numTeams - 1);
            int numTeamsHalf = numTeams / 2;
            int teamsSize = teams.Count();
            //matchup id
            int matchID = 0;

            for (int week = numWeeks; week < numWeeks * 2; week++)
            {
                matchID++;

                int teamIdx = week % teamsSize;

                //add matchup for team 1 vs team 2
                matchups.Add(new Matchup
                {
                    MatchupID = matchID,
                    WeekNumber = week + 1,
                    HomeTeam = teams[teamIdx],
                    AwayTeam = ListTeam[0],
                    ByeWeek = teams[teamIdx].TeamID == 999999 || ListTeam[0].TeamID == 999999 ? true : false,
                });

                //add the rest of the match ups
                for (int index = 1; index < numTeamsHalf; index++)
                {
                    matchID++;

                    int firstTeam = (week + index) % teamsSize;
                    int secondTeam = (week + teamsSize - index) % teamsSize;

                    matchups.Add(new Matchup
                    {
                        MatchupID = matchID,
                        WeekNumber = week + 1,
                        HomeTeam = teams[secondTeam],
                        AwayTeam = teams[firstTeam],
                        ByeWeek = teams[firstTeam].TeamID == 999999 || teams[secondTeam].TeamID == 999999 ? true : false,
                    });
                }
            }

            return matchups;
        }
    }

}
