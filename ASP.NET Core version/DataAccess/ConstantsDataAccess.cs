using System.Linq;
using Thalassa.Models;

namespace Thalassa.DataAccess
{
    public class ConstantsDataAccess : DbSetup
    {
        public void Insert(ConstantsData constantsData)
        {
            Db.Insert<ConstantsData>(constantsData);
        }
        
        public ConstantsData Find()
        {
            return Db.Query<ConstantsData>().FirstOrDefault();
        }
    }
}