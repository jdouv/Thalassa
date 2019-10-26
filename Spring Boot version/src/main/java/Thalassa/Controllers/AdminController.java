package Thalassa.Controllers;

import Thalassa.DataManagement.Services.BlockchainService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.HashMap;
import java.util.List;

@Controller
public class AdminController {

    private final BlockchainService blockchainService;

    public AdminController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    @GetMapping("/validateBlockchain")
    public String validateBlockchain(ModelMap model) throws Exception {
        List<HashMap<String, List<String>>> results = blockchainService.validateBlockchain();
        model.put("results", results);

        return "dashboards/Admin/validateBlockchain";
    }
}
