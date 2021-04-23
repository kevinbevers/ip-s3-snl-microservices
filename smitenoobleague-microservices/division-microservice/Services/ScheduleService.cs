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
    public class ScheduleService : IScheduleService
    {
        private readonly SNL_Division_DBContext _db;
        private readonly ILogger<ScheduleService> _logger;
        private readonly IValidationService _validationService;
        private readonly IExternalServices _externalServices;
        private readonly IDivisionService _divisionService;

        public ScheduleService(SNL_Division_DBContext db, ILogger<ScheduleService> logger, IValidationService validationService, IExternalServices externalServices, IDivisionService divisionService)
        {
            _db = db;
            _logger = logger;
            _validationService = validationService;
            _externalServices = externalServices;
            _divisionService = divisionService;
        }

        public async Task<ActionResult> CreateScheduleForDivisionAsync(ScheduleCreation values)
        {
            try
            {
                if (!await _validationService.DivisionExistsAsync(values.DivisionID))
                {
                    return new ObjectResult("Can't create a schedule if the division doesn't exist") { StatusCode = 400 }; //BAD REQUEST
                }
                else
                {
                    //get teams from teams service
                    List<Team> divisionTeams = (List<Team>)await _externalServices.GetDivisionTeamsByIdAsync(values.DivisionID);
                    if (divisionTeams?.Count() == 0 || divisionTeams == null)
                    {
                        return new ObjectResult("Can't create a schedule if the division has no teams") { StatusCode = 400 }; //BAD REQUEST
                    }

                    //enddate of the double round robin is amount of teams - 1 (don't play yourself) & that * 2 because it's a double round robin
                    DateTime endDate = values.ScheduleStartDate.AddDays(7 * ((divisionTeams.Count() -1) * 2));
                    int overlap = await CheckDateOverlap(values, endDate);

                    if (overlap > 0)
                    {
                        return new ObjectResult("New schedule can't be overlapping with another schedule") { StatusCode = 400 }; //CREATED
                    }
                    else
                    {
                        await CreateAndSaveNewSchedule(values, divisionTeams, endDate);

                        return new ObjectResult("Schedule succesfully generated and saved") { StatusCode = 201 }; //CREATED
                    }
                }
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went trying to generate a new schedule.");
                //return result to client
                return new ObjectResult("Something went wrong trying to generate a new schedule.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<Schedule>>> GetAllSchedulesByDivisionIdAsync(int divisionID)
        {
            try
            {
                List<TableSchedule> foundSchedules = await _db.TableSchedules.Where(schedule => schedule.ScheduleDivisionId == divisionID).ToListAsync();
                if (foundSchedules.Count() == 0 || foundSchedules == null)
                {
                    return new ObjectResult("No schedules found for the given divisionID") { StatusCode = 404 };//NOT FOUND
                }
                else
                {
                    List<Schedule> divisionSchedules = new List<Schedule>();

                    foreach (TableSchedule fs in foundSchedules)
                    {
                        divisionSchedules.Add(new Schedule
                        {
                            ScheduleID = fs.ScheduleId,
                            DivisionID = fs.ScheduleDivisionId,
                            ScheduleName = fs.ScheduleName,
                            ScheduleStartDate = fs.ScheduleStartDate,
                            CurrentWeek = GetCurrentWeek(fs.ScheduleStartDate, await _db.TableMatchups.Where(x => x.ScheduleId == fs.ScheduleId).Select(x => x.WeekNumber).Distinct().CountAsync()), //number of weeks gone by. remainder of 6 days
                            Matchups = await GetMatchups(fs.ScheduleId)
                        });
                    }

                    return new ObjectResult(divisionSchedules) { StatusCode = 200 };//OK
                }
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went trying to get all schedules for the division");
                //return result to client
                return new ObjectResult("Something went trying to get all schedules for the division") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<SimpleSchedule>>> GetSimpleListOfAllSchedulesByDivisionIdAsync(int divisionID)
        {
            try
            {
                List<TableSchedule> foundSchedules = await _db.TableSchedules.Where(schedule => schedule.ScheduleDivisionId == divisionID).ToListAsync();

                if (foundSchedules.Count() == 0 || foundSchedules == null)
                {
                    return new ObjectResult("No schedules found for the given divisionID") { StatusCode = 404 };//NOT FOUND
                }
                else
                {
                    //add all scheduleid's to the int list
                    List<SimpleSchedule> divisionScheduleIds = new List<SimpleSchedule>();
                    foundSchedules.ForEach(fs => divisionScheduleIds.Add( new SimpleSchedule {ScheduleID = fs.ScheduleId, ScheduleName = fs.ScheduleName}));

                    return new ObjectResult(divisionScheduleIds) { StatusCode = 200 };//OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went trying to get all scheduleIds for the division");
                //return result to client
                return new ObjectResult("Something went trying to get all scheduleIds for the division") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Schedule>> GetScheduleByIdAsync(int scheduleID)
        {
            try
            {
                TableSchedule fs = await _db.TableSchedules.Where(s => s.ScheduleId == scheduleID).FirstOrDefaultAsync();

                if (fs == null)
                {
                    return new ObjectResult("No schedule found for the given scheduleID") { StatusCode = 404 };//NOT FOUND
                }
                else
                {
                    Schedule schedule = new Schedule
                        {
                            ScheduleID = fs.ScheduleId,
                            ScheduleName = fs.ScheduleName,
                            ScheduleStartDate = fs.ScheduleStartDate,
                            DivisionID = fs.ScheduleDivisionId,
                            CurrentWeek = GetCurrentWeek(fs.ScheduleStartDate, await _db.TableMatchups.Where(x => x.ScheduleId == scheduleID).Select(x => x.WeekNumber).Distinct().CountAsync()), //number of weeks gone by. remainder of 6 days
                            Matchups = await GetMatchups(fs.ScheduleId)
                        };
                    
                    return new ObjectResult(schedule) { StatusCode = 200 };//OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get a schedule by id");
                //return result to client
                return new ObjectResult("Something went wrong trying to get a schedule by id") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Schedule>> RemoveScheduleByIdAsync(int scheduleID)
        {
            try
            {
                TableSchedule scheduleToDelete = await _db.TableSchedules.Where(s => s.ScheduleId == scheduleID).FirstOrDefaultAsync();

                if (scheduleToDelete == null)
                {
                    return new ObjectResult("No schedule found for the given scheduleID") { StatusCode = 404 };//NOT FOUND
                }
                else
                {
                    List<TableMatchup> matchupsToDelete = await _db.TableMatchups.Where(matchup => matchup.ScheduleId == scheduleID).ToListAsync();
                    _db.Remove(scheduleToDelete);
                    _db.RemoveRange(matchupsToDelete);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Sucessfully deleted the schedule") { StatusCode = 200 };//OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete a schedule by id");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete a schedule by id") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<Schedule>> GetCurrentScheduleByDivisionIdAsync(int divisionID)
        {
            try
            {

                ActionResult<Division> response = await _divisionService.GetDivisionByIdAsync(divisionID);
                var processedResult = response.Result as ObjectResult;
                if (processedResult.StatusCode == 200)
                {
                    //can't be null if statusscode is 200
                    Division division = (Division)processedResult.Value;

                    int scheduleID = (int)division.CurrentScheduleID;

                    TableSchedule fs = await _db.TableSchedules.Where(s => s.ScheduleId == scheduleID).FirstOrDefaultAsync();

                    if (fs == null)
                    {
                        return new ObjectResult("No schedule found with the divisions currentScheduleID") { StatusCode = 404 };//NOT FOUND
                    }
                    else
                    {
                        //IList<Team> divisionTeams = await _externalServices.GetDivisionTeamsByIdAsync(fs.ScheduleDivisionId);

                        Schedule schedule = new Schedule
                        {
                            ScheduleID = fs.ScheduleId,
                            ScheduleName = fs.ScheduleName,
                            ScheduleStartDate = fs.ScheduleStartDate,
                            DivisionID = fs.ScheduleDivisionId,
                            CurrentWeek = GetCurrentWeek(fs.ScheduleStartDate, await _db.TableMatchups.Where(x => x.ScheduleId == scheduleID).Select(x => x.WeekNumber).Distinct().CountAsync()), //number of weeks gone by. remainder of 6 days
                            Matchups = await GetMatchups(fs.ScheduleId)
                        };

                        return new ObjectResult(schedule) { StatusCode = 200 };//OK
                    }
                }
                else
                {
                    return new ObjectResult("No division found for the given divisionID") { StatusCode = 404 };//NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get a schedule by divisionID");
                //return result to client
                return new ObjectResult("Something went wrong trying to get a schedule by divisionID") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> UpdateMatchUpScoreAsync(int matchupID, string scoreText)
        {
            try
            {
                TableMatchup matchup = await _db.TableMatchups.Where(mup => mup.MatchupId == matchupID).FirstOrDefaultAsync();

                if (matchup != null)
                {
                    matchup.Score = scoreText;
                    _db.TableMatchups.Update(matchup);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Matchup score text updated successfully") { StatusCode = 200 };//OK
                }
                else
                {
                    return new ObjectResult("no matchup found for the given matchupID") { StatusCode = 404 };//NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to update matchup score text");
                //return result to client
                return new ObjectResult("Something went wrong trying to update matchup score text") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> UpdateScheduleForDivisionAsync(SimpleSchedule values)
        {
            try
            {
                TableSchedule schedule = await _db.TableSchedules.Where(s => s.ScheduleId == values.ScheduleID).FirstOrDefaultAsync();
                if(schedule != null)
                {
                    schedule.ScheduleName = values.ScheduleName;

                    _db.TableSchedules.Update(schedule);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("Schedule updated successfully.") { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No schedule found with the given ID.") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went trying to update a schedule.");
                //return result to client
                return new ObjectResult("Something went wrong trying to update a schedule.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private int GetCurrentWeek(DateTime startDate, int numberOfWeeks)
        {
            int currentWeekNumber = (DateTime.Now - startDate).Days / 7 + 1; //number of weeks gone by. remainder of 6 days //add one to not be 0 on week 1 etc..

            return currentWeekNumber > numberOfWeeks ? numberOfWeeks : currentWeekNumber;
        }
        private async Task<IEnumerable<Matchup>> GetMatchups(int scheduleID) //, IList<Team> divisionTeams
        {
            List<TableMatchup> foundMatchups = await _db.TableMatchups.Where(matchup => matchup.ScheduleId == scheduleID).OrderBy(m => m.WeekNumber).ToListAsync();
            //instead of just relying on the teams that are in the division get all teams that are in the schedule. so we can still display teams that are moved out of the division on old weeks of the schedule.
            List<int> allTeamsInSchedule = foundMatchups.Where(x => x.HomeTeamId != 999999).Select(x => x.HomeTeamId).Distinct().ToList();
            allTeamsInSchedule.AddRange(foundMatchups.Where(x => x.AwayTeamId != 999999).Select(x => x.AwayTeamId).Distinct().ToList());
            IList<Team> scheduleTeams = await _externalServices.GetBasicTeamInfoInBatchWithTeamIdsList(allTeamsInSchedule.Distinct().ToList());

            //get all the teams for this division
            List<Matchup> matchupsToReturn = new List<Matchup>();

            foundMatchups.ForEach(fs => {
                matchupsToReturn.Add(new Matchup
                {
                    MatchupID = fs.MatchupId,
                    ByeWeek = fs.ByeGame,
                    Score = fs.Score, //calculate later. probably store it in the matchup table
                    WeekNumber = fs.WeekNumber,
                    HomeTeam = scheduleTeams.Where(t => t.TeamID == fs.HomeTeamId).FirstOrDefault(),
                    AwayTeam = scheduleTeams.Where(t => t.TeamID == fs.AwayTeamId).FirstOrDefault()
                });
            });

            return matchupsToReturn;      
        }
        private async Task CreateAndSaveNewSchedule(ScheduleCreation values, List<Team> divisionTeams, DateTime endDate)
        {
            //generate schedule
            IEnumerable<Matchup> generatedMatchups = Scheduling.Create(divisionTeams);

            //Add schedule to database
            TableSchedule newScheduleEntry = new TableSchedule
            {
                ScheduleDivisionId = values.DivisionID,
                ScheduleName = values.ScheduleName,
                ScheduleStartDate = values.ScheduleStartDate,
                ScheduleEndDate = endDate

            };
            await _db.TableSchedules.AddAsync(newScheduleEntry);
            await _db.SaveChangesAsync();

            //add the matchups to database
            List<TableMatchup> newMatchupEntries = new List<TableMatchup>();

            foreach (Matchup m in generatedMatchups)
            {
                newMatchupEntries.Add(new TableMatchup
                {
                    ScheduleId = newScheduleEntry.ScheduleId,
                    HomeTeamId = m.HomeTeam.TeamID,
                    AwayTeamId = m.AwayTeam.TeamID,
                    ByeGame = m.ByeWeek,
                    WeekNumber = m.WeekNumber
                });
            }

            await _db.TableMatchups.AddRangeAsync(newMatchupEntries.OrderBy(m => m.WeekNumber));
            await _db.SaveChangesAsync();
        }
        private async Task<int> CheckDateOverlap(ScheduleCreation values, DateTime endDate)
        {
            var startDate = values.ScheduleStartDate;
            var divID = values.DivisionID;
            //check if given date overlaps with already existing schedules
            var overlap = await _db.TableSchedules.Where(s => startDate >= s.ScheduleStartDate && startDate <= s.ScheduleEndDate && s.ScheduleDivisionId == divID || endDate >= s.ScheduleStartDate && endDate <= s.ScheduleEndDate && s.ScheduleDivisionId == divID).ToListAsync();

            return overlap.Count();
        }
        #endregion
    }
}
