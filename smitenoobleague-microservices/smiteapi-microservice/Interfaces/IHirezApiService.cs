using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using smiteapi_microservice.Models.Internal;
using smiteapi_microservice.Models.External;

namespace smiteapi_microservice.Interfaces
{
    public interface IHirezApiService
    {
        Task<IEnumerable<Player>> SearchPlayersByNameAsync(string name);
        Task<MatchData> GetMatchDetailsAsync(int MatchID);
        Task<ApiPatchInfo> GetCurrentPatchInfoAsync();
        Task<IEnumerable<ApiGod>> GetGodsAsync();
        Task<IEnumerable<ApiItem>> GetItemsAsync();
    }
}
