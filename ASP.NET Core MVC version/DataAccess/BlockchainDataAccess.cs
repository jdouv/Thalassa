using System.Collections.Generic;
using Common;

namespace DataAccess
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
            var blocks = FindAll().Count - 1;
            return FindByIndex(blocks.ToString());
        }
    }
}