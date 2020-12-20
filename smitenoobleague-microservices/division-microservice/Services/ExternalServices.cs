using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using division_microservice.Interfaces;
using division_microservice.Models.Internal;
using System.Net.Http;
using Newtonsoft.Json;

namespace division_microservice.Services
{
    public class ExternalServices : IExternalServices
    {
        public ExternalServices()
        {
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
    }
}
