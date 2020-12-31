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
using division_microservice.Classes;
//database
using division_microservice.Division_DB;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
//swagger
using Microsoft.OpenApi.Models;
using division_microservice.Interfaces;
using division_microservice.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace division_microservice
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

            string dbpass = Environment.GetEnvironmentVariable("DB_Password");
            // Replace "YourDbContext" with the name of your own DbContext derived class.
            services.AddDbContextPool<SNL_Division_DBContext>(
                dbContextOptions => dbContextOptions
                    .UseMySql(
                        // Replace with your connection string.
                        $"server=db;port=3306;user=root;password={dbpass};database=SNL_Division_DB",
                        // Replace with your server version and type.
                        // For common usages, see pull request #1233.
                        new MySqlServerVersion(new Version(8, 0, 22)), 
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)));

            //inject gatewaykey from appsettings.json
            //services.Configure<GatewayKey>(Configuration.GetSection("GatewayKey"));
            //services.AddScoped<GatewayOnly>();

            //add Scoped services
            services.AddScoped<IExternalServices, ExternalServices>();
            services.AddScoped<IDivisionService, DivisionService>();
            services.AddScoped<IScheduleService, ScheduleService>();
            services.AddScoped<IValidationService, ValidationService>();

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


            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
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

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Division microservice API V1");
            });
        }
    }
}
