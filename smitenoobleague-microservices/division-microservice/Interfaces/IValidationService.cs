using System;
using System.Threading.Tasks;

namespace division_microservice.Interfaces
{
    public interface IValidationService
    {
        public Task<bool> DivisionExistsAsync(int? divisionID);
        public Task<bool> DivisionNameIsTakenAsync(string divisionName, int? divisionID);
    }
}
