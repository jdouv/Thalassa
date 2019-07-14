using Business;
using Common.LegalEngineering;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Thalassa.Controllers
{
    public class ContractsController : Controller
    {
        private readonly IContractService _contractService;

        public ContractsController(IContractService contractService)
        {
            _contractService = contractService;
        }
        
        // Prepares a new contract for drafting
        // Currently not used
        [HttpGet]
        public IActionResult NewContract()
        {
            return PartialView("~/Views/Dashboards/LegalEngineer/NewContract.cshtml");
        }

        [HttpPost]
        public void ConcludeContract(Contract contract)
        {
            _contractService.ConcludeContract(contract);
        }

        [HttpGet]
        public IActionResult UserContracts()
        {
            var privateKey = HttpContext.Session.GetString("loggedInPrivateKey");
            ViewBag.Contracts = _contractService.GetUserContracts(privateKey);

            return PartialView("~/Views/Dashboards/LegalEngineer/Contracts.cshtml");
        }
        
        [HttpGet("Contracts/GetContract/{index}")]
        public IActionResult GetContract([FromRoute] string index)
        {
            var privateKey = HttpContext.Session.GetString("loggedInPrivateKey");
            ViewBag.ComposedContract = _contractService.GetContract(index, privateKey);
            
            return PartialView("~/Views/Dashboards/LegalEngineer/Contract.cshtml");
        }
        
        // Testing demo contract’s off-hire clause
        [HttpGet]
        public string TestEnableClause() {
            return _contractService.TestEnableOffHireClause();
        }
    }
}