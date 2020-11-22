using System;
namespace smiteapi_microservice.External_Models
{
    public class QueuedMatch
    {
        public int gameID { get; set; }
        public DateTime scheduleTime { get; set; }
    }
}
