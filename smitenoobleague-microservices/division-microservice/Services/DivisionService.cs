using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using division_microservice.Interfaces;
using division_microservice.Models.External;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;
using division_microservice.Division_DB;
using Microsoft.Extensions.Logging;

namespace division_microservice.Services
{
    public class DivisionService : IDivisionService
    {
        private readonly SNL_Division_DBContext _db;
        private readonly ILogger<DivisionService> _logger;

        public DivisionService(SNL_Division_DBContext db, ILogger<DivisionService> logger)
        {
            _db = db;
            _logger = logger;
        }
        //located here so that the front-end only makes 1 call
        public Task<ActionResult<int>> AddTeamsToDivisionAsync(IEnumerable<Team> teamsToAdd, int divisionID)
        {
            //call Teamservice with a list of teams
            throw new NotImplementedException();
        }
        //located here so that the front-end only makes 1 call
        public Task<ActionResult<int>> RemoveTeamsFromDivisionAsync(IEnumerable<Team> teamsToRemove, int divisionID)
        {
            throw new NotImplementedException();
        }

        public async Task<ActionResult<Division>> CreateDivisionAsync(string divisionName)
        {
            try
            {
                //create new row in database and save
                TableDivision newDivision = new TableDivision { DivisionName = divisionName };
                _db.TableDivisions.Add(newDivision);
                await _db.SaveChangesAsync(); //entityframework will automatically populaty the ID

                Division returnDivision = new Division { DivisionID = newDivision.DivisionId, DivisionName = newDivision.DivisionName };

                return new ObjectResult(returnDivision) { StatusCode = 201 }; //CREATED
            }
            catch(Exception ex)
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
                //delete row in database and save
                _db.TableDivisions.Remove(await _db.TableDivisions.FindAsync(divisionID));
                await _db.SaveChangesAsync(); //entityframework will automatically populaty the ID

                return new ObjectResult("Division successfully deleted") { StatusCode = 200 }; //OK
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete a division.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete a division.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Division>> GetDivisionByIdAsync(int divisionID)
        {
            try
            {
                //delete row in database and save
                TableDivision foundDivision = await _db.TableDivisions.FindAsync(divisionID);

                Division returnDivision = new Division { DivisionID = foundDivision.DivisionId, DivisionName = foundDivision.DivisionName };
                returnDivision.DivisionTeams = await GetTeamsByDivisionIdAsync(foundDivision.DivisionId);

                return new ObjectResult(foundDivision) { StatusCode = 200 }; //OK
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get division by id.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get division by id.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Division>> UpdateDivisionAsync(Division division)
        {
            try
            {
                //update row in database and save
                TableDivision foundDivision = await _db.TableDivisions.FindAsync(division.DivisionID);
                foundDivision.DivisionName = division.DivisionName;
                await _db.SaveChangesAsync();

                Division returnDivision = new Division { DivisionID = foundDivision.DivisionId, DivisionName = foundDivision.DivisionName };

                return new ObjectResult(foundDivision) { StatusCode = 200 }; //OK
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update division.");
                //return result to client
                return new ObjectResult("Something went wrong trying to update division.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task<IEnumerable<Team>> GetTeamsByDivisionIdAsync(int divisionID)
        {
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
        #endregion
    }
}
