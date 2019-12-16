using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Thalassa.Services;

namespace Thalassa.Controllers
{
    [ApiController, Route("[controller]"), Authorize("admin")]
    public class AdminController : ControllerBase
    {
        private readonly IBlockchainService _blockchainService;

        public AdminController(IBlockchainService blockchainService)
        {
            _blockchainService = blockchainService;
        }
        
        [HttpPost("ValidateBlockchain")]
        public List<Dictionary<string, List<string>>> ValidateBlockchain()
        {
            return _blockchainService.ValidateBlockchain();
        }
    }
}