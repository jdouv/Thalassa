package Thalassa.DataManagement.Services;

import java.util.HashMap;
import java.util.List;

public interface BlockchainService {
    List<HashMap<String, List<String>>> validateBlockchain() throws Exception;
    void initializeBlockchain() throws Exception;
}