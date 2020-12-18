using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace team_microservice.Models.Internal
{
    public class Division
    {
        public int DivisionID { get; set; }
        public string DivisionName { get; set; }
    }
}
