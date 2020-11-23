using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using division_microservice.Classes;
using Microsoft.Extensions.Options;

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