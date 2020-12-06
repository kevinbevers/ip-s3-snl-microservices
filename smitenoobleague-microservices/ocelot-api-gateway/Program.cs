using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ocelot_api_gateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((Host, config) =>  {
                    config.AddJsonFile("appsettings.json");
                    config.AddJsonFile("ocelot.json");

                    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                    if (env != null)
                    {
                        config.AddJsonFile($"ocelot.{env}.json", optional: true);
                    }
                    
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
