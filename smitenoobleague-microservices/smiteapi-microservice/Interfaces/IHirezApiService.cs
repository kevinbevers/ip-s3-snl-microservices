using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using smiteapi_microservice.Models.Internal;
using smiteapi_microservice.Models.External;
using Microsoft.AspNetCore.Mvc;

namespace smiteapi_microservice.Interfaces
{
    public interface IHirezApiService
    {
        Task<ActionResult<IEnumerable<Player>>> SearchPlayersByNameAsync(string name);
        Task<MatchData> GetMatchDetailsAsync(int MatchID);
        Task<ApiPatchInfo> GetCurrentPatchInfoAsync();
        Task<IEnumerable<ApiGod>> GetGodsAsync();
        Task<IEnumerable<ApiItem>> GetItemsAsync();
    }
}
