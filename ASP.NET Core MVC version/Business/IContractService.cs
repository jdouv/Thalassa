using System.Collections.Generic;
using Common.LegalEngineering;

namespace Business
{
    public interface IContractService
    {
        List<Dictionary<string, object>> GetUserContracts(string privateKey);
        Dictionary<string, object> GetContract(string index, string privateKey);
        string TestEnableOffHireClause();
        void ConcludeContract(Contract contract);
    }
}