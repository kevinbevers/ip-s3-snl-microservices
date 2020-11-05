using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using smiteapi_microservice.Classes;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;

public class GatewayOnly : ActionFilterAttribute
{
    private readonly GatewayKey _gatewayKey;

    public GatewayOnly(IOptions<GatewayKey> gatewayKey)
    {
        _gatewayKey = gatewayKey.Value;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    { 
        if (filterContext.HttpContext.Request.Headers["GatewayKey"].ToString() != _gatewayKey.Key)
        {
            filterContext.Result = new UnauthorizedResult();
        }
    }
}