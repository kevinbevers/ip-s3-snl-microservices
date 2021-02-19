using System;
using System.Linq;
using System.Threading.Tasks;
using division_microservice.Division_DB;
using division_microservice.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace division_microservice.Services
{
    public class ValidationService : IValidationService
    {
        SNL_Division_DBContext _db;
        ILogger<ValidationService> _logger;

        public ValidationService(SNL_Division_DBContext db, ILogger<ValidationService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<bool> DivisionExistsAsync(int? divisionID)
        {
            int foundDivision = await _db.TableDivisions.Where(d => d.DivisionId == divisionID).CountAsync();
            return foundDivision > 0;
        }

        public async Task<bool> DivisionNameIsTakenAsync(string divisionName, int? divisionID) 
        {
            int foundDivision = await _db.TableDivisions.Where(d => d.DivisionName.ToLower().Equals(divisionName.ToLower()) && d.DivisionId != divisionID).CountAsync();
            return foundDivision > 0;  
        }
    }
}
