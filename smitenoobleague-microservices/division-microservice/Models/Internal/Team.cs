using System;
namespace division_microservice.Models.Internal
{
    public class Team
    {
        public int TeamID { get; set; }
        public string TeamName { get; set; }
        public int? DivisionID { get; set; }
        public string TeamLogoPath { get; set; }
    }
}
