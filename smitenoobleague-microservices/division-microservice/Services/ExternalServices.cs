using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using division_microservice.Interfaces;
using division_microservice.Models.Internal;

namespace division_microservice.Services
{
    public class ExternalServices : IExternalServices
    {
        public ExternalServices()
        {
        }

        public async Task<IList<Team>> GetDivisionTeamsByIdAsync(int divisionID)
        {
            await Task.Delay(0);
            //call team service           
            List<Team> mockTeams = new List<Team> {
                new Team { TeamName = "team1", TeamID = 1 },
                new Team { TeamName = "team2", TeamID = 2 },
                new Team { TeamName = "team3", TeamID = 3 },
                new Team { TeamName = "team4", TeamID = 4 },
                new Team { TeamName = "team5", TeamID = 5 },
                new Team { TeamName = "team6", TeamID = 6 },
                new Team { TeamName = "team7", TeamID = 7},
                new Team { TeamName = "team8", TeamID = 8 }};

            return mockTeams;
        }
    }
}
