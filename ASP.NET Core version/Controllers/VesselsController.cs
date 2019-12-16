using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Thalassa.Models;
using Thalassa.Services;

namespace Thalassa.Controllers
{
    [ApiController, Route("[controller]"), Authorize("companyVesselsRegistryManager")]
    public class VesselsController : ControllerBase
    {
        private readonly IVesselService _vesselService;

        public VesselsController(IVesselService vesselService)
        {
            _vesselService = vesselService;
        }

        [HttpPost("VesselsRegistry")]
        public List<Vessel> GetVesselsRegistry()
        {
            return _vesselService.GetVesselsRegistry(HttpContext.Session.GetString("loggedInPrivateKey"));
        }
        
        [HttpPost("InsertVessel")]
        public JObject InsertVessel([FromBody] JObject json)
        {
            return _vesselService.Insert(json, HttpContext.Session.GetString("loggedInPrivateKey"));
        }
        
        [HttpPost("UpdateVessel")]
        public JObject UpdateVessel([FromBody] JObject json)
        {
            return _vesselService.Update(json);
        }
    }
}