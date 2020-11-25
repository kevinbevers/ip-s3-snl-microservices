using System;
namespace smiteapi_microservice.Models.External
{
    public class QueuedMatch
    {
        public int gameID { get; set; }
        public DateTime scheduleTime { get; set; }
    }
}
