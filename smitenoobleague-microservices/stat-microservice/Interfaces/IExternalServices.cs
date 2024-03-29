﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.Internal;

namespace stat_microservice.Interfaces
{
    public interface IExternalServices
    {
        Task<TeamWithDetails> GetTeamByPlayersAsync(List<int> playersInMatch);
        Task<Schedule> GetPlannedMatchUpByDivisionIdAsync(int divisionID);
        Task<bool> UpdateScoreInScheduleAsync(string score, int matchupID);
        Task<string> GetCaptainEmailWithCaptainTeamMemberIDAsync(int captainTeamMemberID);
        Task<bool> SendEmailNotificationToCaptainAsync(string msg, string title, string email);
        Task<PlayerWithTeamInfo> GetPlayerWithTeamInfoByPlayerIdAsync(int? playerID);
        //Task<Matchup> GetMatchupByMatchupIdAsync(int matchupID);
        Task<TeamWithDetails> GetTeamWithDetailsByTeamId(int? teamID);
        Task<Team> GetBasicTeamInfoByTeamId(int? teamID);
        Task<IEnumerable<Team>> GetBasicTeamInfoInBatchWithTeamIdsList(List<int> teamIDs);
        Task<string> GetDivisionNameByDivisionID(int? divisionID);
        Task<List<Role>> GetRolesAsync();
    }
}
