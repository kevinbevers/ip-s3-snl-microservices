﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Internal_Models;
using smiteapi_microservice.External_Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [ServiceFilter(typeof(GatewayOnly))]
    [ApiController]
    [Route("[controller]")]
    public class ItemController : Controller
    {
        private IHirezApiService hirezApiService;

        public ItemController(IHirezApiService apiService)
        {
            hirezApiService = apiService;
        }
        // GET: /patch
        [HttpGet]
        public async Task<IEnumerable<ApiItem>> Get()
        {
            return await hirezApiService.GetItemsAsync();
        }
    }
}