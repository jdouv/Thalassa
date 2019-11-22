using System.Collections.Generic;
using Thalassa.Models;
using Thalassa.DataAccess;

namespace Thalassa.Business.Services
{
    public class BlockchainService : IBlockchainService
    {
        private readonly BlockchainDataAccess _blockchainDataAccess;

        public BlockchainService(BlockchainDataAccess blockchainDataAccess)
        {
            _blockchainDataAccess = blockchainDataAccess;
        }
        
        // Creates genesis block if no block if found in the blockchain
        public void InitializeBlockchain()
        {
            if (_blockchainDataAccess.FindLast() == null)
                _blockchainDataAccess.Insert(new Block(0.ToString(), "{'type':'Genesis block'}"));
        }

        public void InsertBlock(Block block)
        {
            _blockchainDataAccess.Insert(block);
        }
    
        public Block FindLastBlock()
        {
            return _blockchainDataAccess.FindLast();
        }
    
        // Validates service’s blockchain
        public List<Dictionary<string, List<string>>> ValidateBlockchain()
        {
            var result = new List<Dictionary<string, List<string>>> {new Dictionary<string, List<string>>(), new Dictionary<string, List<string>>()};
            
            InitializeBlockchain();
            var blockchain = _blockchainDataAccess.FindAll();

            if (blockchain.Count == 1) // If blockchain has only one (genesis) block, there is no need for validation
            {
                result[0]["emptyBlockchain"] = new List<string> {"y"};
                return null;
            }

            // Genesis block validation
            var genesisBlock = blockchain[0];
            if (!genesisBlock.Hash.Equals(genesisBlock.CalculateHash()))
            {
                var hashes = new List<string> {genesisBlock.Timestamp.ToString(), genesisBlock.CalculateHash(), genesisBlock.Hash};
                result[0][genesisBlock.Index] = hashes;
            }

            // Rest blocks validation
            for (var i = 1; i < blockchain.Count; i++)
            {
                var currentBlock = blockchain[i];
                var currentBlockDatetime = currentBlock.Timestamp.ToString();
                var currentBlockExpectedHash = currentBlock.CalculateHash();
                var previousBlock = blockchain[i - 1];
                var previousBlockDatetime = previousBlock.Timestamp.ToString();

                // If current block’s hash field is not equal to its hash expected after recalculation
                if (!currentBlock.Hash.Equals(currentBlockExpectedHash))
                {
                    var hashes = new List<string> {currentBlockDatetime, currentBlockExpectedHash, currentBlock.Hash};
                    result[0][currentBlock.Index] = hashes;
                }

                // If current block’s reference to previous block’s hash is not equal to previous block’s hash field
                if (currentBlock.PreviousHash.Equals(previousBlock.Hash)) continue;
                {
                    var hashes = new List<string> {previousBlockDatetime, currentBlockDatetime, previousBlock.Hash, currentBlock.PreviousHash};
                    result[1][previousBlock.Index] = hashes;
                }
            }

            return result;
        }
    }
}