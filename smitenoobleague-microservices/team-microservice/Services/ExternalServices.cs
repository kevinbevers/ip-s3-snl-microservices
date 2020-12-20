using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using team_microservice.Interfaces;
using team_microservice.Models.Internal;
using Newtonsoft.Json;

namespace team_microservice.Services
{
    public class ExternalServices : IExternalServices
    {
        public ExternalServices()
        {
        }

        public async Task<IList<Division>> GetAllAvailableDivisions()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(5); //timeout after 5 seconds
                                                              //should make the http call dynamic by getting the string from the Gateway
                using (var response = await httpClient.GetAsync($"http://division-microservice/division"))
                {
                    string json = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<List<Division>>(json);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }
    }
}
