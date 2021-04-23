using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using division_microservice.Interfaces;
using division_microservice.Models.Internal;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using division_microservice.Classes;
using division_microservice.Models.External;

namespace division_microservice.Services
{
    public class ExternalServices : IExternalServices
    {
        private readonly InternalServicesKey _servicekey;

        public ExternalServices(InternalServicesKey serviceKey)
        {
            _servicekey = serviceKey;
        }

        public async Task<IList<Team>> GetDivisionTeamsByIdAsync(int divisionID)
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                                                                //should make the http call dynamic by getting the string from the Gateway
                using (var response = await httpClient.GetAsync($"http://team-microservice/team/bydivision/{divisionID}"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<List<Team>>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<IList<Team>> GetScheduleTeamsWithListOfIds(List<int> teamIds)
        {

            var stringContent = new StringContent(JsonConvert.SerializeObject(teamIds));

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                                                              //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);
                stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                using (var response = await httpClient.PostAsync($"http://team-microservice/team-service/team/basicbatch", stringContent))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<List<Team>>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<bool> RemoveTeamsFromDivision(int divisionID)
        {
            SetDivisionTeams divisionTeams = new SetDivisionTeams {divisionID = divisionID, teamIdList = null };
            //setdivisionforteam
            //body for the post request
            var stringContent = new StringContent(JsonConvert.SerializeObject(divisionTeams));

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);
                stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await httpClient.PostAsync($"http://team-microservice/team/setdivisionforteams", stringContent))
                {
                    string json = await response.Content.ReadAsStringAsync();
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
