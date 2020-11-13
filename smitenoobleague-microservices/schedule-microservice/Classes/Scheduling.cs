using System;
using System.Collections.Generic;
using System.Linq;
using division_microservice.Internal_Models;
using static division_microservice.Internal_Models.Schedule;

namespace division_microservice.Classes
{
    public static class Scheduling
    {

        public static void Generate(List<Team> ListTeam)
        {
            //if teams are uneven
            if (ListTeam.Count % 2 != 0)
            {
                ListTeam.Add(new Team { TeamName = "No match planned", TeamID = 999999 });
            }

            int numTeams = ListTeam.Count();

            int numWeeks = (numTeams - 1);
            int halfSize = numTeams / 2;

            List<Team> teams = new List<Team>();

            teams.AddRange(ListTeam); // Copy all the elements.
            teams.RemoveAt(0); // To exclude the first team.

            int teamsSize = teams.Count;

            //Round Robin
            for (int week = 0; week < numWeeks; week++)
            {
                Console.WriteLine("Week {0}", (week + 1));

                //week - (week / teamsize) * teamsize
                // 1 - (1 / 7) * 7
                int teamIdx = week % teamsSize;

                if (teams[teamIdx].TeamID == 999999) //bye week
                {
                    Console.WriteLine("{1} has {0}", teams[teamIdx].TeamName, ListTeam[0].TeamName);
                }
                else if (ListTeam[0].TeamID == 999999)
                {
                    Console.WriteLine("{0} has {1}", teams[teamIdx].TeamName, ListTeam[0].TeamName);
                }
                else
                {
                    Console.WriteLine("{0} vs {1}", teams[teamIdx].TeamName, ListTeam[0].TeamName);
                }

                for (int idx = 1; idx < halfSize; idx++)
                {
                    int firstTeam = (week + idx) % teamsSize;
                    int secondTeam = (week + teamsSize - idx) % teamsSize;

                    if (teams[firstTeam].TeamID == 999999) //bye week
                    {
                        Console.WriteLine("{1} has {0}", teams[firstTeam].TeamName, teams[secondTeam].TeamName);
                    }
                    else if (teams[secondTeam].TeamID == 999999)
                    {
                        Console.WriteLine("{0} has {1}", teams[firstTeam].TeamName, teams[secondTeam].TeamName);
                    }
                    else
                    {
                        Console.WriteLine("{0} vs {1}", teams[firstTeam].TeamName, teams[secondTeam].TeamName);
                    }
                }
            }
            //Double Round Robin //swap teams around to play away instead of home against the same team
            for (int week = numWeeks; week < numWeeks * 2; week++)
            {
                Console.WriteLine("Week {0}", (week + 1));

                int teamIdx = week % teamsSize;

                if (teams[teamIdx].TeamID == 999999) //bye week
                {
                    Console.WriteLine("{1} has {0}", teams[teamIdx].TeamName, ListTeam[0].TeamName);
                }
                else if (ListTeam[0].TeamID == 999999)
                {
                    Console.WriteLine("{0} has {1}", teams[teamIdx].TeamName, ListTeam[0].TeamName);
                }
                else
                {
                    Console.WriteLine("{0} vs {1}", teams[teamIdx].TeamName, ListTeam[0].TeamName);
                }

                for (int idx = 1; idx < halfSize; idx++)
                {
                    int firstTeam = (week + idx) % teamsSize;
                    int secondTeam = (week + teamsSize - idx) % teamsSize;

                    if (teams[firstTeam].TeamID == 999999) //bye week
                    {
                        Console.WriteLine("{1} has {0}", teams[firstTeam].TeamName, teams[secondTeam].TeamName);
                    }
                    else if (teams[secondTeam].TeamID == 999999)
                    {
                        Console.WriteLine("{0} has {1}", teams[firstTeam].TeamName, teams[secondTeam].TeamName);
                    }
                    else
                    {
                        Console.WriteLine("{0} vs {1}", teams[secondTeam].TeamName, teams[firstTeam].TeamName);
                    }
                }
            }
        }


        public static List<Matchup> Create(List<Team> ListTeam)
        {
            List<Matchup> matchups = new List<Matchup>();
            //if teams are uneven
            if (ListTeam.Count % 2 != 0)
            {
                ListTeam.Add(new Team { TeamName = "No match planned", TeamID = 999999 });
            }
            List<Team> teams = new List<Team>();

            teams.AddRange(ListTeam); // Copy all the elements.
            teams.RemoveAt(0); // To exclude the first team.


            RoundRobin(ListTeam, matchups,teams);
            RoundRobinInverted(ListTeam, matchups,teams);

            //return schedule
            return matchups;

        }

        private static void RoundRobin(List<Team> ListTeam, List<Matchup> matchups, List<Team> teams)
        {
            int numTeams = ListTeam.Count();
            int numWeeks = (numTeams - 1);
            int numTeamsHalf = numTeams / 2;
            int teamsSize = teams.Count();
            //matchup id
            int matchID = 0;

            for (int week = 0; week < numWeeks; week++)
            {
                matchID++;

                //add matchup for team 1 vs team 2
                matchups.Add(new Matchup
                {
                    MatchupID = matchID,
                    WeekNumber = week + 1,
                    HomeTeam = ListTeam[0],
                    AwayTeam = teams[0],
                    ByeWeek = teams[0].TeamID == 999999 || ListTeam[0].TeamID == 999999 ? true : false,
                });

                //add the rest of the match ups
                for (int index = 0; index < numTeamsHalf; index++)
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
        }
        private static void RoundRobinInverted(List<Team> ListTeam, List<Matchup> matchups, List<Team> teams)
        {
            int numTeams = ListTeam.Count();
            int numWeeks = (numTeams - 1);
            int numTeamsHalf = numTeams / 2;
            int teamsSize = teams.Count();
            //matchup id
            int matchID = 0;

            for (int week = numWeeks; week < numWeeks * 2; week++)
            {
                matchID++;

                //add matchup for team 1 vs team 2
                matchups.Add(new Matchup
                {
                    MatchupID = matchID,
                    WeekNumber = week + 1,
                    HomeTeam = teams[0],
                    AwayTeam = ListTeam[0],
                    ByeWeek = teams[0].TeamID == 999999 || ListTeam[0].TeamID == 999999 ? true : false,
                });

                //add the rest of the match ups
                for (int index = 0; index < numTeamsHalf; index++)
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
        }
    }

}
