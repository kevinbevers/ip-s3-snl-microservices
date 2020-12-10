using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using team_microservice.Interfaces;
using team_microservice.Team_DB;
using Microsoft.EntityFrameworkCore;

namespace team_microservice.Services
{
    public class ValidationService : IValidationService
    {
        private readonly SNL_Team_DBContext _db;
        //private readonly ILogger<ValidationService> _logger;

        public ValidationService(SNL_Team_DBContext db)
        {
            _db = db;
            //_logger = logger;
        }

        public async Task<bool> CheckIfCaptainIsTaken(int playerID, int? teamID)
        {
            var captainTeamMemberObject = await _db.TableTeamMembers.Where(m => m.TeamMemberPlayerId == playerID).FirstOrDefaultAsync();
            if (captainTeamMemberObject != null)
            {
                int captainFound = await _db.TableTeams.Where(t => t.TeamCaptainId == captainTeamMemberObject.TeamMemberId && t.TeamId != teamID).CountAsync();
                return captainFound > 0;
            }
            else
            {
                return false;
            }

            
        }

        public async Task<bool> CheckIfDivisionIsFull(int divisionID)
        {
            var teamsFound = await _db.TableTeams.Where(t => t.TeamDivisionId == divisionID).CountAsync();

            return teamsFound > 7; //if there are 8 teams
        }

        public async Task<bool> CheckIfTeamMemberIsTaken(int playerID, int? teamID)
        {
            var teamMemberFound = await _db.TableTeamMembers.Where(m => m.TeamMemberPlayerId == playerID && m.TeamMemberTeamId != teamID).CountAsync();

            return teamMemberFound > 0;
        }

        public async Task<bool> CheckIfTeamNameIsTaken(string teamName, int? teamID)
        {
            var teamNameFound = await _db.TableTeams.Where(m => m.TeamName == teamName && m.TeamId != teamID).CountAsync();

            return teamNameFound > 0;
        }
    }
}
