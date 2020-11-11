using Newtonsoft.Json;
using smiteapi_microservice.Internal_Models;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Classes;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace smiteapi_microservice.Contexts
{
    public class HirezApiContextV2 : IHirezApiContext
    {
        private readonly string _devID;
        private readonly string _authKey;
        private const string language = "/1";
        private string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        private ApiSessionResult sessionResult = new ApiSessionResult();
        private readonly string PCAPIurl = "http://api.smitegame.com/smiteapi.svc/";

        public HirezApiContextV2(ApiCredentials credentials)
        {
            _devID = credentials.DevId;
            _authKey = credentials.AuthKey;
        }

        private static string GetMD5Hash(string input)
        {
            //return await Task.Run(() => {
            //    //Hashing here...
                var md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
                var bytes = Encoding.UTF8.GetBytes(input);
                bytes = md5.ComputeHash(bytes);
                var sb = new StringBuilder();
                foreach (byte b in bytes)
                {
                    sb.Append(b.ToString("x2").ToLower());
                }
                return sb.ToString();
            //});
        }

        private async Task CreateSessionAsync()
        {
            string signature = GetMD5Hash(_devID + "createsession" + _authKey + timestamp);
            string result;

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}createsessionjson/{_devID}/{signature}/{timestamp}"))
                {
                    var response = await httpClient.SendAsync(request);
                    result = await response.Content.ReadAsStringAsync();
                }
            }
            HirezSession session = JsonConvert.DeserializeObject<HirezSession>(result);

            SaveSessionAsync(session.session_id, session.timestamp);
        }
        private async void SaveSessionAsync(string sessionID, string timestamp)
        {
            sessionResult.sessionID = sessionID;
            sessionResult.sessionTime = timestamp;

            string json = JsonConvert.SerializeObject(sessionResult, Formatting.Indented);
            await File.WriteAllTextAsync("Config/hirezapi.json", json);
        }
        private async Task CheckSessionAsync()
        {
            timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            if (!File.Exists("Config/hirezapi.json"))
            {
                await CreateSessionAsync();
            }
            string json = await File.ReadAllTextAsync("Config/hirezapi.json");
            sessionResult = JsonConvert.DeserializeObject<ApiSessionResult>(json);
          
            if (sessionResult.sessionTime != null)
            {
                DateTime parsedSessionTime = DateTime.Parse(sessionResult.sessionTime, CultureInfo.InvariantCulture);

                //also check if sessionID is not empty, it is sometimes empty for some reason
                if ((DateTime.UtcNow - parsedSessionTime).TotalMinutes >= 15 || sessionResult.sessionID == "")
                {
                    await CreateSessionAsync();
                }
            }
            else
            {
                await CreateSessionAsync();
            }
        }
        private async Task<ApiResponse> CallAsync(string endpoint, string value)
        {
            await CheckSessionAsync();

            string signature = GetMD5Hash(_devID + endpoint + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using var httpClient = new HttpClient(handler, false);

            string requrl = $"{PCAPIurl}{endpoint}json" + $"/{_devID}" + $"/{signature}" + $"/{sessionResult.sessionID}" + $"/{timestamp}";
            requrl = value != "" ?  requrl + $"/{value}" : requrl;

            using var request = new HttpRequestMessage(HttpMethod.Get, requrl);

            var response = await httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();
            ApiResponse res = new ApiResponse(); 
            if (json.ToLowerInvariant().Contains("html"))
            {
                res.error = json;

                return res;
            }
            else
            {
                res.content = json;

                return res;
            }
        }
        public async Task<List<ApiPlayerMatchStat>> GetMatchDetailsByMatchID(int matchID)
        {
            ApiResponse response = await CallAsync("getmatchdetails", matchID.ToString());
            if (response.error != null)
            {
                var error = new List<ApiPlayerMatchStat> { new ApiPlayerMatchStat { ret_msg = response.error } };
                //set error message as ret_msg 
                return error;
            }
            return JsonConvert.DeserializeObject<List<ApiPlayerMatchStat>>(response.content);
        }

        public Task<string> GetPlayerByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetPlayerAchievementsByID(int id)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetPlayerIdByName(string name)
        {
            throw new NotImplementedException();
        }

        public Task<List<ApiPlayer>> GetPlayerIdByGamtertag(string gamertag, ApiPlatformEnum platform)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetGodRanks(int id)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetQueueStats(int id, int queue)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ApiPlayer>> SearchPlayerByName(string playername)
        { 
            ApiResponse response = await CallAsync("searchplayers", playername);
            if (response.error != null)
            {
                var error = new List<ApiPlayer> { new ApiPlayer { ret_msg = response.error } };
                //set error message as ret_msg 
                return error;
            }
            return JsonConvert.DeserializeObject<List<ApiPlayer>>(response.content);
        }

        public Task<string> GetTeamDetails(int id)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetPlayerStatus(int playerID)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ApiItem>> GetAllItems()
        {
            ApiResponse response = await CallAsync("getitems", language);
            if (response.error != null)
            {
                var error = new List<ApiItem> { new ApiItem { ret_msg = response.error } };
                //set error message as ret_msg 
                return error;
            }
            return JsonConvert.DeserializeObject<List<ApiItem>>(response.content);
        }

        public async Task<List<ApiGod>> GetAllGods()
        {
            // /1 for the language english
            ApiResponse response = await CallAsync("getgods", language);
            if (response.error != null)
            {
                var error = new List<ApiGod> { new ApiGod { ret_msg = response.error } };
                //set error message as ret_msg 
                return error;
            }
            return JsonConvert.DeserializeObject<List<ApiGod>>(response.content);
        }

        public Task<IEnumerable<ApiPlayerMatchStat>> GetMatchPlayerDetails(int matchID)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetEsportsProLeagueDetails()
        {
            throw new NotImplementedException();
        }

        public async Task<ApiPatchInfo> GetPatchInfo()
        {
            ApiResponse response = await CallAsync("getpatchinfo", "");
            if (response.error != null)
            {
                var error = new ApiPatchInfo { ret_msg = response.error } ;
                //set error message as ret_msg 
                return error;
            }
            return JsonConvert.DeserializeObject<ApiPatchInfo>(response.content);
        }

        public async Task<string> PingAPI()
        {
            
            ApiResponse response = await CallAsync("ping", "");
            if (response.error != null)
            {
                return response.error;
            }
            return response.content;
        }

        public async Task<string> DataUsed()
        {        
            ApiResponse response = await CallAsync("getdataused", "");
            if (response.error != null)
            {
                return response.error;
            }
            return response.content;
        }

        public async Task<string> APITestMethod(string _endpoint, string value)
        {
            ApiResponse response = await CallAsync(_endpoint, value);
            if (response.error != null)
            {
                return response.error;
            }
            return response.content;
        }

        Task<List<ApiPlayerMatchStat>> IHirezApiContext.GetMatchPlayerDetails(int matchID)
        {
            throw new NotImplementedException();
        }
    }
}

