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
//database
using smiteapi_microservice.Smiteapi_DB;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
//swagger
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace smiteapi_microservice
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        string dbpass = Environment.GetEnvironmentVariable("DB_Password");
        string Smite_Api_DevId = Environment.GetEnvironmentVariable("Smite_Api_DevId");
        string Smite_Api_AuthKey = Environment.GetEnvironmentVariable("Smite_Api_AuthKey");

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAntiforgery(o => {
                o.Cookie.Name = "X-CSRF-TOKEN";
            });

            services.AddControllers();
            // Replace "YourDbContext" with the name of your own DbContext derived class.
            services.AddDbContextPool<SNL_Smiteapi_DBContext>(
                dbContextOptions => dbContextOptions
                    .UseMySql(
                        // Replace with your connection string.
                        $"server=db;port=3306;user=root;password={dbpass};database=SNL_Smiteapi_DB",
                        // Replace with your server version and type.
                        // For common usages, see pull request #1233.
                        new MySqlServerVersion(new Version(8, 0, 22)),
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)));

            //add API dev authorization
            //services.AddSingleton<IHirezApiContext>(new HirezApiContextV2 (Configuration.GetSection("Credentials").Get<ApiCredentials>()));
            services.AddSingleton<IHirezApiContext>(new HirezApiContextV2(new ApiCredentials { DevId = Smite_Api_DevId, AuthKey = Smite_Api_AuthKey }));

            //inject gatewaykey from appsettings.json UNUSED if api's are not exposed
            //services.Configure<GatewayKey>(Configuration.GetSection("GatewayKey"));
            //services.AddScoped<GatewayOnly>();

            //add Scoped Services
            services.AddScoped<IHirezApiService, HirezApiService>();
            services.AddScoped<IMatchService, MatchService>();

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {

                    options.Authority = "https://smitenoobleague.eu.auth0.com/";
                    options.Audience = "smitenoobleague";
                                // If the access token does not have a `sub` claim, `User.Identity.Name` will be `null`. Map it to a different claim by setting the NameClaimType below.
                                options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "Role",
                        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    };
                });

            //add swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Smiteapi microservice API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Smiteapi microservice API V1");
            });
        }
    }
}
