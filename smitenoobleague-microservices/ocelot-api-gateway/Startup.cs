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
//Ocelot imports
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
//swagger

namespace ocelot_api_gateway
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        string[] domains = Environment.GetEnvironmentVariable("Domain").Split(',');

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // domains.Append("http://localhost:3000");
            // domains.Append("https://scl-picks-and-bans.herokuapp.com");
            domains = domains.Concat(new string[] { "http://localhost:3000", "https://scl-picks-and-bans.herokuapp.com" }).ToArray();
            services.AddControllers();
            services.AddOcelot(Configuration);
            services.AddSwaggerForOcelot(Configuration);
            services.AddCors(options =>
            {
                options.AddPolicy("AllowedOrigin",
                builder =>
                {
                    builder.WithOrigins(domains); //accept only the configured domains. 1 local for development and env variable for production.
                    builder.AllowAnyHeader();
                    builder.WithExposedHeaders("Token-Expired");
                    builder.AllowAnyMethod();
                    builder.AllowCredentials();
                    builder.Build();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowedOrigin");

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


            await app.UseSwaggerForOcelotUI(opt =>
            {
                opt.PathToSwaggerGenerator = "/swagger/docs";
            })
            .UseOcelot();
        }
    }
}
