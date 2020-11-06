using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
//get classes from project for Dependency injection / inversion
using smiteapi_microservice.Classes;
using smiteapi_microservice.Contexts;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Services;

namespace smiteapi_microservice
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            //add API dev authorization
            services.AddSingleton<IHirezApiContext>(new HirezApiContext (Configuration.GetSection("Credentials").Get<ApiCredentials>()));

            //inject gatewaykey from appsettings.json
            services.Configure<GatewayKey>(Configuration.GetSection("GatewayKey"));
            services.AddScoped<GatewayOnly>();

            //add Scoped Services
            services.AddScoped<IHirezApiService, HirezApiService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
