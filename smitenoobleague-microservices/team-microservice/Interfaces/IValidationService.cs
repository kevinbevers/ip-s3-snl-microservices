using System;
using System.Threading.Tasks;

namespace team_microservice.Interfaces
{
    public interface IValidationService
    {
        Task<bool> CheckIfTeamNameIsTaken(string teamName, int? teamID);
        Task<bool> CheckIfTeamMemberIsTaken(int playerID, int? teamID);
        Task<bool> CheckIfCaptainIsTaken(int playerID, int? teamID);
        Task<bool> CheckIfDivisionIsFull(int divisionID);
    }
}
