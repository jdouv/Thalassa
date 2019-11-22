using System.Collections.Generic;
using Thalassa.Models;

namespace Thalassa.Business.Services
{
    public interface IBlockchainService
    {
        List<Dictionary<string, List<string>>> ValidateBlockchain();
        Block FindLastBlock();
        void InitializeBlockchain();
        void InsertBlock(Block block);
    }
}