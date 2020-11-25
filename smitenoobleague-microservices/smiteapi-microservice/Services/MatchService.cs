using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Logging;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Models.External;
using smiteapi_microservice.Smiteapi_DB;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace smiteapi_microservice.Services
{
    public class MatchService : IMatchService
    {
        //services
        private readonly SNL_Smiteapi_DBContext _db;
        private readonly IHirezApiService _hirezApi;
        //logging
        private readonly ILogger<MatchService> _logger;
        //return messages, move to static class
        private readonly string ResponeText_alreadySubmitted = "gameID is already submitted";
        private readonly string ResponeText_gameIdEmpty = "gameID can't be empty";
        private readonly string ResponseText_MatchDetailsHidden = "Matchdata not yet available. The data will be added once it becomes available at"; //Date will be added after this
        private readonly string ResponseText_MatchDetailsAdded = "Matchdata was added to our database";

        public MatchService(SNL_Smiteapi_DBContext db, IHirezApiService hirezApi, ILogger<MatchService> logger)
        {
            //database
            _db = db;
            //api service
            _hirezApi = hirezApi;
            //logger
            _logger = logger;
        }

        public async Task<ActionResult<MatchData>> GetRawMatchData(int gameID)
        {
            try
            {
                var match = await _hirezApi.GetMatchDetailsAsync(gameID);

                return match;
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to process a submitted gameID");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<IActionResult> ProcessMatchID(MatchSubmission submission)
        {
            try
            {
                //if gameID is already submitted
                if (await _db.TableQueues.Where(game => game.GameId == submission.gameID).CountAsync() > 0)
                {
                    return new ObjectResult(ResponeText_alreadySubmitted) { StatusCode = 200 }; //OK
                }
                else
                {
                    if (submission.gameID == 0)
                    {
                        return new ObjectResult(ResponeText_gameIdEmpty) { StatusCode = 400 }; //BAD REQUEST
                    }
                    else
                    {
                        //try and get matchdata from smiteapi
                        MatchData match = await _hirezApi.GetMatchDetailsAsync(submission.gameID);

                        //check return message from api. if the return msg is null the match is valid
                        if (match.ret_msg != null)
                        {
                            return await ProcessReturnMessageFromSmiteApi(submission, match);
                        }
                        else
                        {
                            return await SaveGameIdAndSendToStats(submission);
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to process a submitted gameID");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<IActionResult> ProcessScheduleApiRequest(MatchSubmission submission)
        {
            try
            {
                //try and get matchdata from smiteapi
                MatchData match = await _hirezApi.GetMatchDetailsAsync(submission.gameID);

                //check return message from api. if the return msg is null the match is valid
                if (match.ret_msg != null)
                {
                    //something went wrong even when the matchData should have been available. because it is 7 days later
                    return new ObjectResult(match.ret_msg) { StatusCode = 404 }; //BAD REQUEST
                                                                                 //Node scheduler will add a new scheduled job 2 hours later to try to get the data again
                }
                else
                {
                    return await SaveGameIdAndSendToStats(submission);
                }
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying execute scheduledjob");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<List<QueuedMatch>>> GetScheduledGamesFromDB()
        {
            try
            {
                List<TableQueue> qd = await _db.TableQueues.ToListAsync();

                List<QueuedMatch> queuedMatches = new List<QueuedMatch>();

                foreach (var m in qd)
                {
                    //if it hasn't been ran yet.
                    if (m.QueueState == false)
                    {
                        queuedMatches.Add(new QueuedMatch { gameID = m.GameId, scheduleTime = m.QueueDate });
                    }
                }

                return queuedMatches;
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong getting all scheduled gameIds from the database");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region Methods
        private async Task<IActionResult> SaveGameIdAndSendToStats(MatchSubmission submission)
        {
            //Add or update the submission entry in the database
            TableQueue entry = await _db.TableQueues.Where(entry => entry.GameId == submission.gameID).FirstAsync();

            if (entry != null)
            {
                //update the entry of the gameID and it's state
                entry.QueueState = true;
                _db.Update(entry);
            }
            else
            {
                //Add the match to the queue table with QueueState true so that it will never get scheduled and we can check if the match has already been submitted.
                _db.Add(new TableQueue { GameId = submission.gameID, QueueDate = DateTime.UtcNow, QueueState = true });
            }
            await _db.SaveChangesAsync();

            //send data to stat service

            return new ObjectResult(ResponseText_MatchDetailsAdded) { StatusCode = 201 }; //CREATED
        }

        private async Task<IActionResult> ProcessReturnMessageFromSmiteApi(MatchSubmission submission, MatchData match)
        {
            string msg = match.ret_msg.ToString();

            if (msg.Contains("MatchDetails are intentionally hidden"))
            {
                //match data becomes available after 7 days. datetime is greenwich maintime as my understanding.
                string plannedDate = match.EntryDate.AddDays(7).ToString("s");

                //add a schedule queue object to the schedule queue database table
                _db.Add(new TableQueue { GameId = submission.gameID, QueueDate = match.EntryDate.AddDays(7), QueueState = false });
                await _db.SaveChangesAsync();

                //call the nodejs schedule api
                await CallScheduleAPI(submission, plannedDate);
                //beautify response
                string bdate = match.EntryDate.AddDays(7).ToString("dddd dd MMMM yyyy 'around' H:mm");

                msg = $"{ResponseText_MatchDetailsHidden} {bdate}";
            }

            return new ObjectResult(msg) { StatusCode = 200 }; //OK
        }

        private static async Task CallScheduleAPI(MatchSubmission submission, string plannedDate)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                                                              //should make the http call dynamic by getting the string from the Gateway
                using (var response = await httpClient.GetAsync($"http://localhost:5003/schedulematch/{submission.gameID}/{plannedDate}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    //msg += " res:" + apiResponse;
                }
            }
        }
        #endregion
    }
}
