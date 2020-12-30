using System;
using System.Collections.Generic;
using System.Net.Http;
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
                        return JsonConvert.DeserializeObject<string>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public Task<int> GetPlannedMatchUpByTeamIDAsync(int teamID)
        {
            throw new NotImplementedException();
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

        public async Task<bool> SendEmailNotificationToCaptainAsync(string msg, string title, string email)
        {
            return await _Email.SendMail(email, msg, title);
        }

        public async Task<ActionResult> UpdateScoreInScheduleAsync(string score)
        {
            throw new NotImplementedException();
        }
    }
}
