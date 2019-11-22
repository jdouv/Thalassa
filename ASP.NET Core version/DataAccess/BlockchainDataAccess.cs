using Thalassa.Models;
using System.Collections.Generic;
using System.Linq;

namespace Thalassa.DataAccess
{
    public class BlockchainDataAccess : DbSetup
    {
        public void Insert(Block block)
        {
            Db.Insert<Block>(block);
        }

        public List<Block> FindAll()
        {
            return Db.Query<Block>().ToList();
        }
        
        public Block FindByIndex(string index)
        {
            return Db.Document<Block>(index);
        }
        
        public Block FindLast()
        {
            return Db.Query<Block>().OrderByDescending(block => block.Index).FirstOrDefault();
        }
    }
}