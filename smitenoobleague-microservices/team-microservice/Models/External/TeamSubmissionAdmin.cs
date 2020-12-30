using System;
namespace team_microservice.Models.External
{
    public class TeamSubmissionAdmin : TeamSubmission
    {
        public int? TeamDivisionID { get; set; }
        public CaptainData Captain { get; set; }

        public class CaptainData
        {
            public string TeamCaptainEmail { get; set; }
            public string TeamCaptainAccountID { get; set; }
            public int? TeamCaptainPlayerID { get; set; }
            public string TeamCaptainPlayerName { get; set; }
            public int? TeamCaptainPlatformID { get; set; }
            public int? TeamCaptainRoleID { get; set; }
        }
    }
}
