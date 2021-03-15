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
using smiteapi_microservice.Classes;
using Microsoft.Extensions.Options;
using smiteapi_microservice.Models.Internal;
//#optimize / make it cleaner in the future
namespace smiteapi_microservice.Services
{
    public class MatchService : IMatchService
    {
        //services
        private readonly SNL_Smiteapi_DBContext _db;
        private readonly IHirezApiService _hirezApiService;
        private readonly IExternalServices _externalServices;
        //logging
        private readonly ILogger<MatchService> _logger;
        //gateway key
        //private readonly GatewayKey _gatewayKey;
        //return messages, move to static class
        private readonly string ResponeText_alreadySubmitted = "gameID is already submitted";
        private readonly string ResponeText_gameIdEmpty = "Invalid gameID submitted";
        private readonly string ResponseText_MatchDetailsHidden = "Matchdata not yet available. The data will be added once it becomes available at"; //Date will be added after this

        public MatchService(SNL_Smiteapi_DBContext db, IHirezApiService hirezApiService, ILogger<MatchService> logger, IExternalServices externalServices)
        {
            //database
            _db = db;
            //api service
            _hirezApiService = hirezApiService;
            //logger
            _logger = logger;
            //external services
            _externalServices = externalServices;

        }

        public async Task<ActionResult<MatchData>> GetRawMatchDataAsync(int? gameID)
        {
            try
            {
                var match = await _hirezApiService.GetMatchDetailsAsync((int)gameID);

                return match;
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to process a submitted gameID");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> ProcessMatchIdAsync(int? gameID)
        {
            try
            {
                //if gameID is already submitted
                if (await _db.TableQueues.Where(game => game.GameId == gameID).CountAsync() > 0)
                {
                    return new ObjectResult(ResponeText_alreadySubmitted) { StatusCode = 400 }; //OK
                }
                else
                {
                    if (gameID == null)
                    {
                        return new ObjectResult(ResponeText_gameIdEmpty) { StatusCode = 400 }; //BAD REQUEST
                    }
                    else
                    {
                        //try and get matchdata from smiteapi
                        MatchData match = await _hirezApiService.GetMatchDetailsAsync((int)gameID);
                        ApiPatchInfo patch = await _hirezApiService.GetCurrentPatchInfoAsync();
                        MatchSubmission ms = new MatchSubmission { gameID = gameID, patchNumber = patch.version_string };


                        //check return message from api. if the return msg is null the match is valid
                        if (match.ret_msg != null)
                        {
                            return await ProcessReturnMessageFromSmiteApiAsync(ms, match);
                        }
                        else
                        {
                            return await SaveGameIdAndSendToStatsAsync(ms, match);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to process a submitted gameID");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> ProcessScheduleApiRequestAsync(MatchSubmission submission)
        {
            try
            {
                //try and get matchdata from smiteapi
                MatchData match = await _hirezApiService.GetMatchDetailsAsync((int)submission.gameID);

                //check return message from api. if the return msg is null the match is valid
                if (match?.ret_msg != null && !match.ret_msg.ToString().Contains("Privacy flag set for one or more players.. Player(s):"))
                {
                    match.ret_msg += " Resubmit after the privacy option has been disabled for the player(s) in question.";
                    //something went wrong even when the matchData should have been available. because it is 7 days later
                    return new ObjectResult(match.ret_msg) { StatusCode = 404 }; //BAD REQUEST
                                                                                 //Node scheduler will add a new scheduled job 2 hours later to try to get the data again
                }
                else
                {
                    return await SaveGameIdAndSendToStatsAsync(submission, match);
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying execute scheduledjob");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<List<QueuedMatch>>> GetScheduledGamesFromDbAsync()
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
                        queuedMatches.Add(new QueuedMatch { gameID = m.GameId, scheduleTime = m.QueueDate, patchNumber = m.PatchVersion });
                    }
                }

                return queuedMatches;
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong getting all scheduled gameIds from the database");
                //return result to client
                return new ObjectResult("Something went wrong! oh oh.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region Methods
        private async Task<ActionResult> SaveGameIdAndSendToStatsAsync(MatchSubmission submission, MatchData match)
        {
            //Add or update the submission entry in the database
            TableQueue entry = await _db.TableQueues.Where(entry => entry.GameId == submission.gameID).FirstOrDefaultAsync();

            if (match?.ret_msg != null && match.ret_msg.ToString().Contains("Privacy flag set for one or more players.. Player(s):"))
            {
                match.ret_msg += " Resubmit after the privacy option has been disabled for the player(s) in question.";
                //if privacy flag was set remove the id from the queue table so it can be resubmitted.
                if (entry != null)
                {
                    _db.Remove(entry);
                    await _db.SaveChangesAsync();
                }
                //send data to stat service
                return await _externalServices.SaveMatchdataToStatService(match);
            }
            else
            {
                if (entry != null)
                {
                    if (entry.QueueState == true)
                    {
                        return new ObjectResult("MatchID already validated.") { StatusCode = 200 };
                    }
                    //update the entry of the gameID and it's state
                    entry.QueueState = true;
                    _db.Update(entry);
                }
                else
                {
                    //Add the match to the queue table with QueueState true so that it will never get scheduled and we can check if the match has already been submitted.
                    _db.Add(new TableQueue { GameId = (int)submission.gameID, QueueDate = DateTime.UtcNow, QueueState = true, PatchVersion = submission.patchNumber });
                }

                await _db.SaveChangesAsync();
                //set patch number
                match.patchNumber = submission.patchNumber;

                //send data to stat service
                return await _externalServices.SaveMatchdataToStatService(match);
            }

            //return new ObjectResult(ResponseText_MatchDetailsAdded) { StatusCode = 201 }; //CREATED
        }

        private async Task<ActionResult> ProcessReturnMessageFromSmiteApiAsync(MatchSubmission submission, MatchData match)
        {
            string msg = match.ret_msg.ToString();

            if (msg.Contains("MatchDetails are intentionally hidden"))
            {
                //match data becomes available after 7 days. datetime is greenwich maintime as my understanding.
                string plannedDate = match.EntryDate.AddDays(7).AddHours(1).ToString("s");

                //add a schedule queue object to the schedule queue database table
                _db.Add(new TableQueue { GameId = (int)submission.gameID, QueueDate = match.EntryDate.AddDays(7), QueueState = false, PatchVersion = submission.patchNumber });
                await _db.SaveChangesAsync();

                //call the nodejs schedule api
                await CallScheduleApiAsync(submission, plannedDate); // _gatewayKey.Key
                //beautify response
                string bdate = match.EntryDate.AddDays(7).ToString("dddd d MMMM yyyy 'around' HH:mm 'GMT'");

                msg = $"{ResponseText_MatchDetailsHidden} {bdate}";
                return new ObjectResult(msg) { StatusCode = 200 }; //OK
            }

            if (msg.Contains("Privacy flag set for one or more players.. Player(s):"))
            {
                msg += ". Resubmit after the privacy option has been disabled for the player(s) in question.";
            }

            return new ObjectResult(msg) { StatusCode = 404 }; //NOT FOUND


        }

        private async Task CallScheduleApiAsync(MatchSubmission submission, string plannedDate)//, string gatewayKey
        {
            //Log the occurence of the call not getting made. but if the call wasn't received then the matchId is still in database and will get scheduled later
            try
            {
                using (var httpClient = new HttpClient())
                {
                    //httpClient.DefaultRequestHeaders.Add("GatewayKey", gatewayKey);
                    httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                                                                  //should make the http call dynamic by getting the string from the Gateway
                    using (var response = await httpClient.GetAsync($"http://nodeschedule-microservice/schedulematch/{submission.gameID}/{plannedDate}"))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        //msg += " res:" + apiResponse;
                    }
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong calling the Scheduling Service");
            }
        }
        #endregion
    }
}
