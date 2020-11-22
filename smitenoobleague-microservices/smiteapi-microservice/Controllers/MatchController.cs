using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.External_Models;
using smiteapi_microservice.Interfaces;
//database
using smiteapi_microservice.Smiteapi_DB;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [ServiceFilter(typeof(GatewayOnly))]
    [Route("[controller]")]
    public class MatchController : Controller
    {
        private readonly IHirezApiService _hirezApiService;
        private readonly SNL_Smiteapi_DBContext _context;

        public MatchController(IHirezApiService apiService, SNL_Smiteapi_DBContext context)
        {
            _hirezApiService = apiService;
            _context = context;
        }

        // GET: /match/134314134141
        [HttpGet("{gameID}")]
        public async Task<MatchData> Get(int gameID)
        {
            var match = await _hirezApiService.GetMatchDetailsAsync(gameID);

            return match;
        }

        // POST /match
        [HttpPost]
        public async Task<string> Post([FromBody]MatchSubmission submission)
        {
            if (submission.gameID == 0)
            {
                return "gameID can't be empty";
            }
            else
            {

                MatchData match = await _hirezApiService.GetMatchDetailsAsync(submission.gameID);

                if (match.ret_msg != null)
                {
                    string msg = match.ret_msg.ToString();

                    if (msg.Contains("MatchDetails are intentionally hidden"))
                    {
                        //match data becomes available after 7 days. datetime is greenwich maintime as my understanding.
                        string plannedDate = match.EntryDate.AddDays(7).ToString("s");

                        //add a schedule queue object to the schedule queue database table
                        _context.Add(new TableQueue { GameId = submission.gameID, QueueDate = match.EntryDate.AddDays(7), QueueState = false });
                        await _context.SaveChangesAsync();

                        //call the nodejs schedule api
                        using (var httpClient = new HttpClient())
                        {
                            //should make the http call dynamic by getting the string from the Gateway
                            using (var response = await httpClient.GetAsync($"https://localhost:5000/nodeschedule/schedulematch/{submission.gameID}/{plannedDate}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                //msg += " res:" + apiResponse;
                            }
                        }
                        //beatify response
                        string bdate = match.EntryDate.AddDays(7).ToString("MM/dd/yyyy H:mm");
                        msg = $"Matchdata not yet available. The data will be added once it becomes available at {bdate}";
                    }

                    return msg;
                }
                else
                {
                    //Add the match to the queue table with QueueState true so that it will never get scheduled and we can check if the match has already been submitted.
                    _context.Add(new TableQueue { GameId = submission.gameID, QueueDate = DateTime.Now, QueueState = true });
                    await _context.SaveChangesAsync();
                    //send data to stat service

                    return "Matchdata was added to our database";
                }
            }

        }
    }
}
