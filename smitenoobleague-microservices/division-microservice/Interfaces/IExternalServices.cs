using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;

namespace division_microservice.Interfaces
{
    public interface IExternalServices
    {
        Task<IList<Team>> GetDivisionTeamsByIdAsync(int divisionID);
        Task<bool> RemoveTeamsFromDivision(int divisionID);
        Task<IList<Team>> GetScheduleTeamsWithListOfIds(List<int> teamIds);
    }
}
