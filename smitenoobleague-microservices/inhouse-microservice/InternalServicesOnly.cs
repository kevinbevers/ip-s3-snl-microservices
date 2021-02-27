using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using inhouse_microservice.Classes;
using Microsoft.Extensions.Options;

public class InternalServicesOnly : ActionFilterAttribute
{
    private readonly InternalServicesKey _serviceKey;

    public InternalServicesOnly(InternalServicesKey serviceKey)
    {
        _serviceKey = serviceKey;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    { 
        if (filterContext.HttpContext.Request.Headers["ServiceKey"].ToString() != _serviceKey.Key)
        {
            filterContext.Result = new UnauthorizedResult();
        }
    }
}