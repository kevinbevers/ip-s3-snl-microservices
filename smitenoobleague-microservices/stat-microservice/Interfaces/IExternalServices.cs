using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.Internal;

namespace stat_microservice.Interfaces
{
    public interface IExternalServices
    {
        Task<TeamWithDetails> GetTeamByPlayersAsync(List<int> playersInMatch);
        Task<int> GetPlannedMatchUpByTeamIDAsync(int teamID);
        Task<ActionResult> UpdateScoreInScheduleAsync(string score);
        Task<string> GetCaptainEmailWithCaptainTeamMemberIDAsync(int captainTeamMemberID);
        Task<bool> SendEmailNotificationToCaptainAsync(string msg, string title, string email);
    }
}
