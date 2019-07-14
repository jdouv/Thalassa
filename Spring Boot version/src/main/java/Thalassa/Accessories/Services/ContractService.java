package Thalassa.Accessories.Services;

import Thalassa.Models.LegalEngineering.Contract;
import java.util.HashMap;
import java.util.List;

public interface ContractService {
    List<HashMap<String, Object>> getUserContracts(String privateKey) throws Exception;
    HashMap<String, Object> getContract(String index, String privateKey) throws Exception;
    String testEnableOffHireClause();
    void concludeContract(Contract contract) throws Exception;
}