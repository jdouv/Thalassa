using Thalassa.Models;

namespace Thalassa.Services
{
    public interface ICompanyService
    {
        void Insert(Company company);
        Company FindByName(string name);
        Company FindByRegistryNumber(string registryNumber);
    }
}