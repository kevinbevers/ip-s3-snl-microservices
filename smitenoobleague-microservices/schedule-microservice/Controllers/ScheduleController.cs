﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using division_microservice.Classes;
using division_microservice.Internal_Models;
using Microsoft.AspNetCore.Mvc;
using static division_microservice.Internal_Models.Schedule;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace division_microservice.Controllers
{
    [Route("[controller]")]
    public class ScheduleController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<Matchup> Get()
        {
            List<Team> teams = new List<Team> {
                new Team { TeamName = "team1", TeamID = 1 },
                new Team { TeamName = "team2", TeamID = 2 },
                new Team { TeamName = "team3", TeamID = 3 },
                new Team { TeamName = "team4", TeamID = 4 },
                new Team { TeamName = "team5", TeamID = 5 },
                new Team { TeamName = "team6", TeamID = 6 },
                new Team { TeamName = "team7", TeamID = 7},
                new Team { TeamName = "team8", TeamID = 8 }};

            return Scheduling.Create(teams);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST schedule/ scheduleSubmission{Name, Split, Division}
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
