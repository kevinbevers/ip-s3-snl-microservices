using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.External_Models;
using smiteapi_microservice.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [ServiceFilter(typeof(GatewayOnly))]
    [Route("[controller]")]
    public class MatchController : Controller
    {
        private readonly IHirezApiService _hirezApiService;

        public MatchController(IHirezApiService apiService)
        {
            _hirezApiService = apiService;
        }

        // GET: /match/134314134141
        [HttpGet("{gameID}")]
        public async Task<MatchData> Get(int gameID)
        {
            var match = await _hirezApiService.GetMatchDetailsAsync(gameID);

            return match;
        }

        // POST api/values
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

                        using (var httpClient = new HttpClient())
                        {
                            //should make the http call dynamic by getting the string from the Gateway
                            using (var response = await httpClient.GetAsync($"https://localhost:5000/nodeschedule/schedulematch/{submission.gameID}/{plannedDate}"))
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                //msg += " res:" + apiResponse;
                            }
                        }

                    }

                    return msg;
                }
                else
                {
                    return "Matchdata was added to our database";
                }
            }

        }
    }
}
