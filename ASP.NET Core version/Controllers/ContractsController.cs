using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Thalassa.Business.Services;
using Thalassa.Models.LegalEngineering;

namespace Thalassa.Controllers
{
    [ApiController, Route("[controller]"), Authorize("legalEngineer")]
    public class ContractsController : ControllerBase
    {
        private readonly IContractService _contractService;

        public ContractsController(IContractService contractService)
        {
            _contractService = contractService;
        }
        
        [HttpPost("ConcludeContract")]
        public void ConcludeContract(Contract contract)
        {
            _contractService.ConcludeContract(contract);
        }

        [HttpPost("Contracts")]
        public List<Dictionary<string, object>> Contracts()
        {
            return _contractService.GetUserContracts(HttpContext.Session.GetString("loggedInPrivateKey"));
        }
        
        [HttpPost("Contract/{index}")]
        public Dictionary<string, object> GetContract([FromRoute] string index)
        {
            return _contractService.GetContract(index, HttpContext.Session.GetString("loggedInPrivateKey"));
        }
        
        // Testing demo contract’s off-hire clause
        [HttpPost("TestEnableClause")]
        public string TestEnableClause() {
            return _contractService.TestEnableOffHireClause();
        }
    }
}