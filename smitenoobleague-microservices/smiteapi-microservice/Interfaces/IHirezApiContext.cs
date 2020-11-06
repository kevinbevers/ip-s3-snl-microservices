using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using smiteapi_microservice.Internal_Models;

namespace smiteapi_microservice.Interfaces
{
    public interface IHirezApiContext
    {
        //Smite Functions, all string returns are JSON strings
        Task<string> GetPlayerByID(int id);
        Task<string> GetPlayerAchievementsByID(int id);
        Task<string> GetPlayerIdByName(string name);
        Task<IEnumerable<ApiPlayer>> GetPlayerIdByGamtertag(string gamertag, ApiPlatformEnum platform);
        Task<string> GetGodRanks(int id);
        Task<string> GetQueueStats(int id, int queue);
        Task<IEnumerable<ApiPlayer>> SearchPlayerByName(string playername);
        Task<string> GetTeamDetails(int id);
        Task<string> GetPlayerStatus(int playerID);
        Task<IEnumerable<ApiItem>> GetAllItems();
        Task<IEnumerable<ApiGod>> GetAllGods();
        Task<IEnumerable<ApiPlayerMatchStat>> GetMatchDetailsByMatchID(int matchID);
        //same as above method?! but different url Call
        Task<IEnumerable<ApiPlayerMatchStat>> GetMatchPlayerDetails(int matchID);
        Task<string> GetEsportsProLeagueDetails();
        Task<ApiPatchInfo> GetPatchInfo();
        //API core functions
        Task<string> PingAPI();
        Task<string> DataUsed();
        Task<string> APITestMethod(string _endpoint, string value);
    }
}
