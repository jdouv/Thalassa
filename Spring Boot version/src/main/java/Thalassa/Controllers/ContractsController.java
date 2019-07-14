package Thalassa.Controllers;

import Thalassa.Accessories.Services.ContractService;
import Thalassa.Models.LegalEngineering.Contract;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@Controller
public class ContractsController {

    private final ContractService contractService;

    public ContractsController(ContractService contractService) {
        this.contractService = contractService;
    }

    // Prepares a new contract for drafting
    @GetMapping("/newContract")
    public String newContract(Model model) {
        model.addAttribute("user", new Contract());
        return "dashboards/LegalEngineer/newContract";
    }

    @PostMapping("/concludeContract")
    public void concludeContract(@ModelAttribute("contract") Contract contract) throws Exception {
        contractService.concludeContract(contract);
    }

    @GetMapping("/userContracts")
    public String userContracts(HttpSession session, Model model) throws Exception {
        String privateKey = (String) session.getAttribute("loggedInPrivateKey");
        List<HashMap<String, Object>> contracts = contractService.getUserContracts(privateKey);
        model.addAttribute("contracts", contracts);

        return "dashboards/LegalEngineer/contracts";
    }

    @GetMapping("/getContract/{index}")
    public String getContract(@PathVariable(value = "index") String index, HttpSession session, Model model) throws Exception {
        String privateKey = (String) session.getAttribute("loggedInPrivateKey");
        HashMap<String, Object> composedContract = contractService.getContract(index, privateKey);
        model.addAttribute("composedContract", composedContract);

        return "dashboards/LegalEngineer/contract";
    }

    // Testing demo contract’s off-hire clause
    @GetMapping("/testEnableClause")
    public @ResponseBody String testEnableClause() {
        return contractService.testEnableOffHireClause();
    }
}