﻿using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using team_microservice.Models.External;
using Microsoft.AspNetCore.Mvc;
using team_microservice.Models.Internal;

namespace team_microservice.Interfaces
{
    public interface IPlayerService
    {
        //players
        Task<ActionResult<IEnumerable<PlayerWithTeamInfo>>> GetPlayersByDivisionIdAsync(int? divisionID);//can be null for players without division
        Task<ActionResult<PlayerWithTeamInfo>> GetPlayerWithTeamInfoByPlayerID(int? playerID);
        Task<ActionResult<List<Role>>> GetAllRolesAsync();
    }
}
