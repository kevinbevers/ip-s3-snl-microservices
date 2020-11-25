using Newtonsoft.Json;
using smiteapi_microservice.Models.Internal;
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
    public class HirezApiContext : IHirezApiContext
    {
        private readonly string _devID;
        private readonly string _authKey;
        private const int language = 1;
        private string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        private ApiSessionResult sessionResult = new ApiSessionResult();
        private readonly string PCAPIurl = "http://api.smitegame.com/smiteapi.svc/";
        //private readonly string PaladinsAPIurl = "http://api.paladins.com/paladinsapi.svc/";

        public HirezApiContext(ApiCredentials credentials)
        {
            _devID = credentials.DevId;
            _authKey = credentials.AuthKey;
        }
        //private functions for API 
        private static string GetMD5Hash(string input)
        {
            var md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            var bytes = Encoding.UTF8.GetBytes(input);
            bytes = md5.ComputeHash(bytes);
            var sb = new StringBuilder();
            foreach (byte b in bytes)
            {
                sb.Append(b.ToString("x2").ToLower());
            }
            return sb.ToString();
        }
        private async Task CreateSession()
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

            SaveSession(session.session_id, session.timestamp);
        }
        private void SaveSession(string sessionID, string timestamp)
        {
            sessionResult.sessionID = sessionID;
            sessionResult.sessionTime = timestamp;

            string json = JsonConvert.SerializeObject(sessionResult, Formatting.Indented);
            File.WriteAllText("Config/hirezapi.json", json);
        }
        private async Task CheckSession()
        {
            timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            if (!File.Exists("Config/hirezapi.json"))
            {
                await CreateSession();
            }
            string json = File.ReadAllText("Config/hirezapi.json");
            sessionResult = JsonConvert.DeserializeObject<ApiSessionResult>(json);

            if (sessionResult.sessionTime != null)
            {
                DateTime parsedSessionTime = DateTime.Parse(sessionResult.sessionTime, CultureInfo.InvariantCulture);

                //also check if sessionID is not empty, it is sometimes empty for some reason
                if ((DateTime.UtcNow - parsedSessionTime).TotalMinutes >= 15 || sessionResult.sessionID == "")
                {
                    await CreateSession();
                }
            }
            else
            {
                await CreateSession();
            }
        }
        //Api functions
        public async Task<string> GetPlayerByID(int id)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getplayer" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getplayerjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{id}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> GetPlayerAchievementsByID(int id)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getplayerachievements" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getplayerachievementsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{id}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> APITestMethod(string _endpoint, string value) // Testing Method
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + _endpoint.ToLowerInvariant() + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}{_endpoint}json/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{value}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> GetPlayerIdByName(string username)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getplayeridbyname" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getplayeridbynamejson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{username}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<List<ApiPlayer>> GetPlayerIdByGamtertag(string username, ApiPlatformEnum platformId)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getplayeridsbygamertag" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getplayeridsbygamertagjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{(int)platformId}/{username}"))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<ApiPlayer>>(json);
                }
            }
        }
        public async Task<string> GetGodRanks(int id)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getgodranks" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getgodranksjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{id}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> GetQueueStats(int id, int queue)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getqueuestats" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getqueuestatsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{id}/{queue}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<List<ApiPlayer>> SearchPlayerByName(string username)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "searchplayers" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}searchplayersjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{username}"))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    try
                    {
                        return JsonConvert.DeserializeObject<List<ApiPlayer>>(json);
                    }
                    catch
                    {
                        return new List<ApiPlayer> { new ApiPlayer { ret_msg = json } };
                    }
                }
            }
        }
        public async Task<string> GetTeamDetails(int id)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getteamdetails" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getteamdetailsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{id}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> GetPlayerStatus(int playerID)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getplayerstatus" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getplayerstatusjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{playerID}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<List<ApiItem>> GetAllItems()
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getitems" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getitemsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{language}"))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<ApiItem>>(json);
                }
            }
        }
        public async Task<List<ApiPlayerMatchStat>> GetMatchDetailsByMatchID(int matchID)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getmatchdetails" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getmatchdetailsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{matchID}"))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    //try catch if API is unavailable
                    try
                    {
                        return JsonConvert.DeserializeObject<List<ApiPlayerMatchStat>>(json);
                    }
                    catch
                    {
                        return new List<ApiPlayerMatchStat> { new ApiPlayerMatchStat { ret_msg = json } };
                    }
                }
            }
        }
        public async Task<List<ApiPlayerMatchStat>> GetMatchPlayerDetails(int matchID)
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getmatchplayerdetails" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getmatchplayerdetailsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/{matchID}"))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<ApiPlayerMatchStat>>(json);
                }
            }
        }
        public async Task<List<ApiGod>> GetAllGods()
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getgods" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getgodsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}/1"))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<ApiGod>>(json);
                }
            }
        }
        public async Task<string> GetEsportsProLeagueDetails()
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getesportsproleaguedetails" + _authKey + timestamp);

            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, $"{PCAPIurl}getesportsproleaguedetailsjson/{_devID}/{signature}/{sessionResult.sessionID}/{timestamp}"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> PingAPI()
        {
            var handler = new HttpClientHandler();
            using (var httpClient = new HttpClient(handler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, PCAPIurl + "pingjson"))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<string> DataUsed()
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getdataused" + _authKey + timestamp);

            var dataUsedHandler = new HttpClientHandler();
            using (var httpClient = new HttpClient(dataUsedHandler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, PCAPIurl + "getdatausedjson/" + _devID + "/" + signature + "/" + sessionResult.sessionID + "/" + timestamp))
                {
                    var response = await httpClient.SendAsync(request);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
        public async Task<ApiPatchInfo> GetPatchInfo()
        {
            await CheckSession();

            string signature = GetMD5Hash(_devID + "getpatchinfo" + _authKey + timestamp);

            var dataUsedHandler = new HttpClientHandler();
            using (var httpClient = new HttpClient(dataUsedHandler, false))
            {
                using (var request = new HttpRequestMessage(HttpMethod.Get, PCAPIurl + "getpatchinfojson/" + _devID + "/" + signature + "/" + sessionResult.sessionID + "/" + timestamp))
                {
                    var response = await httpClient.SendAsync(request);
                    string json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<ApiPatchInfo>(json);
                }
            }
        }
    }
}

