using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using division_microservice.Interfaces;
using division_microservice.Models.External;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;
using division_microservice.Division_DB;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using division_microservice.Classes;
using System.Linq;

namespace division_microservice.Services
{
    public class DivisionService : IDivisionService
    {
        private readonly SNL_Division_DBContext _db;
        private readonly ILogger<DivisionService> _logger;
        private readonly IValidationService _validationService;
        private readonly IExternalServices _externalServices;

        public DivisionService(SNL_Division_DBContext db, ILogger<DivisionService> logger, IValidationService validationService, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _validationService = validationService;
            _externalServices = externalServices;
        }

        public async Task<ActionResult<IEnumerable<Division>>> GetDivisionsWithTeamsAsync()
        {
            try
            {
                //get all rows of the table divisions
                List<TableDivision> allDivisions = await _db.TableDivisions.ToListAsync();
                if (allDivisions == null || allDivisions.Count() == 0)
                {
                    return new ObjectResult("No divisions created yet.") { StatusCode = 404 }; //OK
                }
                else
                {
                    List<Division> returnDivisions = new List<Division>();

                    foreach (var division in allDivisions)
                    {

                        Division returnDivision = new Division { DivisionID = division.DivisionId, DivisionName = division.DivisionName };
                        returnDivision.CurrentScheduleID = await GetCurrentSchedule(returnDivision.DivisionID);
                        returnDivision.DivisionTeams = await _externalServices.GetDivisionTeamsByIdAsync(division.DivisionId);
                        returnDivisions.Add(returnDivision);
                    }

                    return new ObjectResult(returnDivisions) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get all divisions.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get all divisions.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public Task<ActionResult<int>> UpdateDivisionTeamsAsync(IEnumerable<Team> teams, int divisionID)
        {
            throw new NotImplementedException();
        }

        public async Task<ActionResult<Division>> CreateDivisionAsync(string divisionName)
        {
            try
            {
                if (await _validationService.DivisionNameIsTakenAsync(divisionName, null))
                {
                    return new ObjectResult("Given division name is already in use") { StatusCode = 400 }; //CREATED
                }
                else
                {
                    //create new row in database and save
                    TableDivision newDivision = new TableDivision { DivisionName = divisionName };
                    _db.TableDivisions.Add(newDivision);
                    await _db.SaveChangesAsync(); //entityframework will automatically populaty the ID

                    Division returnDivision = new Division { DivisionID = newDivision.DivisionId, DivisionName = newDivision.DivisionName };

                    return new ObjectResult(returnDivision) { StatusCode = 201 }; //CREATED
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to create a division.");
                //return result to client
                return new ObjectResult("Something went wrong trying to create a division.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<int>> DeleteDivisionByIdAsync(int divisionID)
        {
            try
            {
                //delete all division data
                await DeleteAllSchedulesForDivisionByIdAsync(divisionID);
                //delete row in database and save
                TableDivision divisionToDelete = await _db.TableDivisions.Where(d => d.DivisionId == divisionID).FirstOrDefaultAsync();

                if (divisionToDelete == null)
                {
                    return new ObjectResult("No division found with the given ID") { StatusCode = 404 }; //OK
                }
                else
                {
                    _db.TableDivisions.Remove(divisionToDelete);
                    await _db.SaveChangesAsync(); //save deletion / could have save changes as int changes and count the amount of changes and return that
                    //update all teams to be divisionless
                    await _externalServices.RemoveTeamsFromDivision(divisionID);

                    //make call to teamService to remove division id from the teams that have it

                    return new ObjectResult("Division successfully deleted") { StatusCode = 200 }; //OK
                }


            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete a division.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete a division.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<string>> GetDivisionNameByIdAsync(int divisionID)
        {
            try
            {
                //get row in database
                TableDivision foundDivision = await _db.TableDivisions.Where(d => d.DivisionId == divisionID).FirstOrDefaultAsync();
                //check if an object was returned
                if (foundDivision == null)
                {
                    return new ObjectResult("No division found with the given divisionID") { StatusCode = 404 }; //NOT FOUND
                }
                else
                {
                    //return name string
                    return new ObjectResult(foundDivision.DivisionName) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get division name by id.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get division name by id.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Division>> GetDivisionByIdAsync(int divisionID)
        {
            try
            {
                //get row in database
                TableDivision foundDivision = await _db.TableDivisions.Where(d => d.DivisionId == divisionID).FirstOrDefaultAsync();
                //check if an object was returned
                if (foundDivision == null)
                {
                    return new ObjectResult("No division found with the given divisionID") { StatusCode = 404 }; //NOT FOUND
                }
                else
                {
                    Division returnDivision = new Division { DivisionID = foundDivision.DivisionId, DivisionName = foundDivision.DivisionName };
                    returnDivision.CurrentScheduleID = await GetCurrentSchedule(returnDivision.DivisionID);
                    returnDivision.DivisionTeams = await _externalServices.GetDivisionTeamsByIdAsync(foundDivision.DivisionId);

                    return new ObjectResult(returnDivision) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get division by id.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get division by id.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<Division>>> GetDivisionsAsync()
        {
            try
            {
                //get all rows of the table divisions
                List<TableDivision> allDivisions = await _db.TableDivisions.ToListAsync();
                if (allDivisions == null || allDivisions.Count() == 0)
                {
                    return new ObjectResult("No divisions created yet.") { StatusCode = 404 }; //OK
                }
                else
                {
                    List<Division> returnDivisions = new List<Division>();

                    foreach(var division in allDivisions)
                    { 
                        Division returnDivision = new Division { DivisionID = division.DivisionId, DivisionName = division.DivisionName };
                        returnDivision.CurrentScheduleID = await GetCurrentSchedule(division.DivisionId);
                        returnDivisions.Add(returnDivision);
                    };


                    return new ObjectResult(returnDivisions) { StatusCode = 200 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get all divisions.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get all divisions.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Division>> UpdateDivisionAsync(Division division)
        {
            try
            {
                    //update row in database and save
                    TableDivision foundDivision = await _db.TableDivisions.Where( d => d.DivisionId == division.DivisionID).FirstOrDefaultAsync();

                    if (foundDivision == null)
                    {
                        return new ObjectResult("No division found with the given divisionID") { StatusCode = 404 }; //NOT FOUND
                    }
                    else
                    {
                        if (await _validationService.DivisionNameIsTakenAsync(division.DivisionName, division.DivisionID))
                        {
                            return new ObjectResult("Given division name is already in use") { StatusCode = 400 }; //CREATED
                        }

                        foundDivision.DivisionName = division?.DivisionName;
                        await _db.SaveChangesAsync();

                        Division returnDivision = new Division { DivisionID = foundDivision.DivisionId, DivisionName = foundDivision.DivisionName };
                        returnDivision.CurrentScheduleID = await GetCurrentSchedule(returnDivision.DivisionID);

                        return new ObjectResult(returnDivision) { StatusCode = 200 }; //OK
                    }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update division.");
                //nullReference get's thrown when body is wrong.
                //if (ex is NullReferenceException)
                //{
                //    //return result to client
                //    return new ObjectResult("Body empty or not formatted correctly.") { StatusCode = 400 }; //BAD REQUEST
                //}
                //else
                //{
                //return result to client
                return new ObjectResult("Something went wrong trying to update division.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
                //}
            }
        }

        #region methods
        private async Task<int?> GetCurrentSchedule(int divisionID)
        {
            var Today = DateTime.Now;
            //check if given date overlaps with already existing schedules
            var currentSchedule = await _db.TableSchedules.Where(s => Today >= s.ScheduleStartDate && Today <= s.ScheduleEndDate && s.ScheduleDivisionId == divisionID).FirstOrDefaultAsync();

            return currentSchedule?.ScheduleId;
        }

        private async Task<bool> DeleteAllSchedulesForDivisionByIdAsync(int divisionID)
        {
            try
            {
                //no try catch neccesary let it throw exception when something goes wrong and catch it in the parent method
                List<TableSchedule> schedulestoDelete = await _db.TableSchedules.Where(s => s.ScheduleDivisionId == divisionID).ToListAsync();
                if (schedulestoDelete == null || schedulestoDelete.Count() == 0)
                {
                    return true; //no schedules found
                }
                else
                {
                    _db.RemoveRange(schedulestoDelete);
                    //for each schedule that was found remove the matchups from the matchup table
                    IEnumerable<int> scheduleIds = await _db.TableSchedules.Where(s => s.ScheduleDivisionId == divisionID).Select(s => s.ScheduleId).ToListAsync();
                    foreach (int id in scheduleIds)
                    {
                        List<TableMatchup> matchupsToDelete = await _db.TableMatchups.Where(m => m.ScheduleId == id).ToListAsync();
                        if (matchupsToDelete != null || matchupsToDelete.Count() > 0)
                        {
                            _db.RemoveRange(matchupsToDelete);
                        }
                    }

                    await _db.SaveChangesAsync();

                    return true;
                }
            }
            catch
            {
                return false;
            }
        }
        #endregion
    }
}
