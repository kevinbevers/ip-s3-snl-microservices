﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using smiteapi_microservice.Internal_Models;
using smiteapi_microservice.External_Models;

namespace smiteapi_microservice.Interfaces
{
    public interface IHirezApiService
    {
        Task<IEnumerable<Player>> SearchPlayersByNameAsync(string name);
        Task<Match> GetMatchDetailsAsync(int MatchID);
        Task<string> GetCurrentPatchInfoAsync();
        Task<int?> UpdateGodsAsync();
        Task<int?> UpdateItemsAsync();
    }
}