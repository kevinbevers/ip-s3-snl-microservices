﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using smiteapi_microservice.Classes;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Models.External;
using smiteapi_microservice.Models.Internal;

namespace smiteapi_microservice.Services
{
    public class ExternalServices : IExternalServices
    {
        private readonly InternalServicesKey _servicekey;

        public ExternalServices(InternalServicesKey serviceKey)
        {
            _servicekey = serviceKey;
        }

        public async Task<TeamWithDetails> GetTeamWithDetailsByIdAsync(int teamID)
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

        public async Task<ObjectResult> SaveInhouseMatchdataToInhouseService(MatchData match)
        {
            //body for the post request
            var stringContent = new StringContent(JsonConvert.SerializeObject(match));

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(15); //timeout after 15 seconds. higher timeout because on first run this could be slow.
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);
                stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await httpClient.PostAsync($"http://inhouse-microservice/matchstat", stringContent))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    int statusCode = (int)response.StatusCode;
                    return new ObjectResult(json) { StatusCode = statusCode };
                }
            }
        }

        public async Task<ObjectResult> SaveMatchdataToStatService(MatchData match)
        {
            //body for the post request
            var stringContent = new StringContent(JsonConvert.SerializeObject(match));

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(15); //timeout after 15 seconds. higher timeout because on first run this could be slow.
                //Add internal service header. so that the requests passes auth
                httpClient.DefaultRequestHeaders.Add("ServiceKey", _servicekey.Key);
                stringContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await httpClient.PostAsync($"http://stat-microservice/matchstat", stringContent))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    int statusCode = (int)response.StatusCode;
                    return new ObjectResult(json) { StatusCode = statusCode };
                }
            }
        }
    }
}
