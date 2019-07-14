using Business;
using Microsoft.AspNetCore.Mvc;

namespace Thalassa.Controllers
{
    public class AdminController : Controller
    {
        private readonly IBlockchainService _blockchainService;

        public AdminController(IBlockchainService blockchainService)
        {
            _blockchainService = blockchainService;
        }
        
        [HttpGet]
        public IActionResult ValidateBlockchain()
        {
            ViewBag.Results = _blockchainService.ValidateBlockchain();
            return PartialView("~/Views/Dashboards/Admin/ValidateBlockchain.cshtml");
        }
    }
}