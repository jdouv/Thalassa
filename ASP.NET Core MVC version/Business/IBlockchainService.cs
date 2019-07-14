using System.Collections.Generic;
using Common;

namespace Business
{
    public interface IBlockchainService
    {
        List<Dictionary<string, List<string>>> ValidateBlockchain();
        Block FindLastBlock();
        void InitializeBlockchain();
        void InsertBlock(Block block);
    }
}