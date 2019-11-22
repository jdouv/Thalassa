using Thalassa.Models;
using System.Linq;

namespace Thalassa.DataAccess
{
    public class CompaniesDataAccess : DbSetup
    {
        public void Insert(Company company)
        {
            Db.Insert<Company>(company);
        }
        
        public void Update(Company company)
        {
            Db.UpdateById<Company>(company.RegistryNumber, company);
        }
        
        public Company FindByName(string name)
        {
            return Db.Query<Company>().FirstOrDefault(company => company.Name == name);
        }
        
        public Company FindByRegistryNumber(string registryNumber)
        {
            return Db.Query<Company>().FirstOrDefault(company => company.RegistryNumber == registryNumber);
        }
    }
}