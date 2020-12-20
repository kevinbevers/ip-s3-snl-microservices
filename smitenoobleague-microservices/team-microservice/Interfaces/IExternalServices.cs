using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using team_microservice.Models.Internal;

namespace team_microservice.Interfaces
{
    public interface IExternalServices
    {
       Task<IList<Division>> GetAllAvailableDivisions();
    }
   
}
