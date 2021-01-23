using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using smiteapi_microservice.Models.Internal;

namespace smiteapi_microservice.Interfaces
{
    public interface IHirezApiContext
    {
        //Smite Functions, all string returns are JSON strings
        Task<string> GetPlayerByID(int id);
        Task<string> GetPlayerAchievementsByID(int id);
        Task<string> GetPlayerIdByName(string name);
        Task<List<ApiPlayer>> GetPlayerIdByGamtertag(string gamertag, ApiPlatformEnum platform);
        Task<string> GetGodRanks(int id);
        Task<string> GetQueueStats(int id, int queue);
        Task<List<ApiPlayer>> SearchPlayerByName(string playername);
        Task<string> GetTeamDetails(int id);
        Task<string> GetPlayerStatus(int playerID);
        Task<List<ApiItem>> GetAllItems();
        Task<List<ApiGod>> GetAllGods();
        Task<List<ApiPlayerMatchStat>> GetMatchDetailsByMatchID(int matchID);//get match statistics
        Task<List<ApiPlayerMatchStat>> GetMatchPlayerDetails(int matchID); //get player details of players in a live match
        Task<string> GetEsportsProLeagueDetails();
        Task<ApiPatchInfo> GetPatchInfo();
        Task<List<ApiMatchList>> GetListOfMatchIdsByQueueID(int queueID, DateTime date, string hour); //get list of match ids by a queueID
        //API core functions
        Task<string> PingAPI();
        Task<string> DataUsed();
        Task<string> APITestMethod(string _endpoint, string value);
    }
}
