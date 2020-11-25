using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using division_microservice.Classes;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using division_microservice.Division_DB;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace division_microservice.Controllers
{
    [Route("[controller]")]
    public class ScheduleController : Controller
    {

        public ScheduleController()
        {

        }

        // GET:  /schedule/{divisionID}
        [HttpGet("{divisionID}")]
        public Schedule Get(int divisionID)
        {           
            return new Schedule();
        }

        // GET /schedule/{divisionID}/{scheduleID}
        [HttpGet("{divisionID}/{scheduleID}")]
        public string Get(int divisionID, int scheduleID)
        {
            return "value";
        }

        // POST schedule/ scheduleSubmission{Name, Division, startDate}
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
