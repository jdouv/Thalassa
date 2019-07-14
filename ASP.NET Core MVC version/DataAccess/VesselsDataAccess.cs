using Common;
using System.Linq;

namespace DataAccess
{
    public class VesselsDataAccess : DbSetup
    {
        public void Insert(Vessel vessel)
        {
            Db.Insert<Vessel>(vessel);
        }
        
        public Vessel FindByImoNumber(string imoNumber)
        {
            return Db.Query<Vessel>().FirstOrDefault(vessel => vessel.ImoNumber == imoNumber);
        }
    }
}