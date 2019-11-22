using System.Collections.Generic;
using Thalassa.Models.LegalEngineering;

namespace Thalassa.Business.Services
{
    public interface IContractService
    {
        List<Dictionary<string, object>> GetUserContracts(string privateKey);
        Dictionary<string, object> GetContract(string index, string privateKey);
        string TestEnableOffHireClause();
        void ConcludeContract(Contract contract);
    }
}