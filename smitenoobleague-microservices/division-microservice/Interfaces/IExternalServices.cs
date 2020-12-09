using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using division_microservice.Models.Internal;

namespace division_microservice.Interfaces
{
    public interface IExternalServices
    {
        Task<IList<Team>> GetDivisionTeamsByIdAsync(int divisionID);
    }
}
