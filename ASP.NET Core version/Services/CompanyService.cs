using Thalassa.Models;
using Thalassa.DataAccess;

namespace Thalassa.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly CompaniesDataAccess _companiesDataAccess;

        public CompanyService(CompaniesDataAccess companiesDataAccess)
        {
            _companiesDataAccess = companiesDataAccess;
        }

        public void Insert(Company company)
        {
            _companiesDataAccess.Insert(company);
        }

        public Company FindByName(string name)
        {
            return _companiesDataAccess.FindByName(name);
        }
        
        public Company FindByRegistryNumber(string registryNumber)
        {
            return _companiesDataAccess.FindByRegistryNumber(registryNumber);
        }
    }
}