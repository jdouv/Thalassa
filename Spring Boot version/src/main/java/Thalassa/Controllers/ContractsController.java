package Thalassa.Controllers;

import Thalassa.Controllers.AuthorizationAnnotations.AuthorizedLegalEngineer;
import Thalassa.Services.ContractService;
import Thalassa.Models.LegalEngineering.Contract;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@RestController
@AuthorizedLegalEngineer
public class ContractsController {

    private final ContractService contractService;

    public ContractsController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping("/concludeContract")
    public void concludeContract(@ModelAttribute("contract") Contract contract) throws Exception {
        contractService.concludeContract(contract);
    }

    @PostMapping(path = "/contracts", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<HashMap<String, Object>> contracts(HttpSession session) throws Exception {
        return contractService.getUserContracts(session.getAttribute("loggedInPrivateKey").toString());
    }

    @PostMapping(path = "/contract/{index}", produces = MediaType.APPLICATION_JSON_VALUE)
    public HashMap<String, Object> getContract(@PathVariable(value = "index") String index, HttpSession session) throws Exception {
        return contractService.getContract(index, session.getAttribute("loggedInPrivateKey").toString());
    }

    // Testing demo contract’s off-hire clause
    @PostMapping("/testEnableClause")
    public String testEnableClause() {
        return contractService.testEnableOffHireClause();
    }
}