using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using smiteapi_microservice.External_Models;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Smiteapi_DB;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [Route("[controller]")]
    public class QueuedMatchController : Controller
    {
        private readonly IHirezApiService _hirezApiService;
        private readonly SNL_Smiteapi_DBContext _context;

        public QueuedMatchController(IHirezApiService apiService, SNL_Smiteapi_DBContext context)
        {
            _hirezApiService = apiService;
            _context = context;
        }

        // GET: /queuedmatch
        [HttpGet]
        public async Task<List<QueuedMatch>> Get()
        {
            List<TableQueue> qd = await _context.TableQueues.ToListAsync();

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

        // POST: /queuedmatch
        [HttpPost]
        public async Task<string> Post([FromBody] QueuedMatch queuedMatch)
        {
            try
            {
                //get game data
                MatchData match = await _hirezApiService.GetMatchDetailsAsync(queuedMatch.gameID);

                //send gamedata to stats api


                //update schedule queue database table
                TableQueue toupdate = await _context.TableQueues.Where(m => m.GameId == queuedMatch.gameID && m.QueueDate == queuedMatch.scheduleTime).FirstAsync();
                //changes state to true
                toupdate.QueueState = true;
                _context.Update(toupdate);
                await _context.SaveChangesAsync();

                //return succesmessage
                return "Matchdata saved to stat service succesfully";
            }
            catch
            {
                //log the error

                //send return message
                return "something went wrong getting the data and saving it to stats service";
            }

        }
    }
}
