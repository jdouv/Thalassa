using System;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Thalassa.Services
{
    public class AuthorizeAttribute : TypeFilterAttribute
    {
        public AuthorizeAttribute(params string[] claim) : base(typeof(AuthorizationFilter))
        {
            Arguments = new object[] { claim };
        }
    }

    public class AuthorizationFilter : IAuthorizationFilter
    {
        private readonly string[] _claim;

        public AuthorizationFilter(params string[] claim)
        {
            _claim = claim;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.HttpContext.User.Identity.IsAuthenticated)
            {
                var positionExists = false;
                foreach (var item in _claim)
                    if (context.HttpContext.User.HasClaim("position", item))
                        positionExists = true;

                if (positionExists) return;
                if (context.HttpContext.Request.IsAjaxRequest())
                    context.HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                else
                    context.Result = new UnauthorizedResult();
            }
            else
            if (context.HttpContext.Request.IsAjaxRequest())
                context.HttpContext.Response.StatusCode = (int) HttpStatusCode.Forbidden;
            else
                context.Result = new ForbidResult();
        }
    }
    
    public static class AjaxExtension
    {
        public static bool IsAjaxRequest(this HttpRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (request.Headers != null)
                return request.Headers["X-Requested-With"] == "XMLHttpRequest";
            return false;
        }
    }
}