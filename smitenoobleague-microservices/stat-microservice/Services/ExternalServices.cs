using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using stat_microservice.Classes;
using stat_microservice.Interfaces;
using stat_microservice.Models.Internal;

namespace stat_microservice.Services
{
    public class ExternalServices : IExternalServices
    {
        private readonly InternalServicesKey _servicekey;
        private Email _Email;

        public ExternalServices(InternalServicesKey serviceKey, Email email)
        {
            _servicekey = serviceKey;
            _Email = email;
        }

        public async Task<Team> GetBasicTeamInfoByTeamId(int? teamID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://team-microservice/team/basic/{teamID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<Team>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<string> GetCaptainEmailWithCaptainTeamMemberIDAsync(int captainTeamMemberID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://team-microservice/team/captainmailbyid/{captainTeamMemberID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return json;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<string> GetDivisionNameByDivisionID(int? divisionID)
        {
            //getnamebyid
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://division-microservice/division/getnamebyid/{divisionID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return json;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<Schedule> GetPlannedMatchUpByDivisionIdAsync(int divisionID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://division-microservice/schedule/currentschedulebydivisionid/{divisionID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<Schedule>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<PlayerWithTeamInfo> GetPlayerWithTeamInfoByPlayerIdAsync(int? playerID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://team-microservice/player/byplayerid/{playerID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<PlayerWithTeamInfo>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<List<Role>> GetRolesAsync()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://team-microservice/player/getallroles"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<List<Role>>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<TeamWithDetails> GetTeamByPlayersAsync(List<int> playersInMatch)
        {
            //body for the post request
            var stringContent = new StringContent(JsonConvert.SerializeObject(playersInMatch));

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);
                stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await httpClient.PostAsync($"http://team-microservice/team/findteam", stringContent))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<TeamWithDetails>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<TeamWithDetails> GetTeamWithDetailsByTeamId(int? teamID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.GetAsync($"http://team-microservice/team/{teamID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<TeamWithDetails>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<bool> SendEmailNotificationToCaptainAsync(string msg, string title, string email)
        {
            return await _Email.SendMail(email, msg, title);
        }

        public async Task<bool> UpdateScoreInScheduleAsync(string score, int matchupID)
        {
            //body for the post request
            var stringContent = new StringContent(JsonConvert.SerializeObject(new UpdateMatchScore { MatchupID = matchupID, ScoreText = score }));
            stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(10); //timeout after 10 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);

                using (var response = await httpClient.PostAsync($"http://division-microservice/schedule/updatematchupscore", stringContent))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }
    }
}
