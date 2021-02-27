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

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string dbpass = Environment.GetEnvironmentVariable("DB_Password");
            string Smite_Api_DevId = Environment.GetEnvironmentVariable("Smite_Api_DevId");
            string Smite_Api_AuthKey = Environment.GetEnvironmentVariable("Smite_Api_AuthKey");

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
            services.AddSingleton<IHirezApiContext>(new HirezApiContextV2(new ApiCredentials { DevId = Smite_Api_DevId, AuthKey = Smite_Api_AuthKey }));

            string servicekey = Environment.GetEnvironmentVariable("InternalServiceKey");
            //InternalServices only
            services.AddSingleton(new InternalServicesKey { Key = servicekey }); //access internalservice key where needed
            services.AddSingleton(new InternalServicesOnly(new InternalServicesKey { Key = servicekey }));//used for controller filter / auth of internal services

            //add Scoped Services
            services.AddScoped<IHirezApiService, HirezApiService>();
            services.AddScoped<IMatchService, MatchService>();
            services.AddScoped<IInhouseMatchService, InhouseMatchService>();
            services.AddScoped<IExternalServices, ExternalServices>();
            services.AddScoped<IGenerateDataService, GenerateDataService>();

            //Auth
            string domain = Environment.GetEnvironmentVariable("Auth0Domain");
            string audience = Environment.GetEnvironmentVariable("Auth0Audience");
            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {

                    options.Authority = domain;
                    options.Audience = audience;
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
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme."
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}
                    }
                });
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
