package Thalassa.Controllers;

import Thalassa.Controllers.AuthorizationAnnotations.AuthorizedAdmin;
import Thalassa.DataManagement.Services.BlockchainService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;

@RestController
@AuthorizedAdmin
public class AdminController {

    private final BlockchainService blockchainService;

    public AdminController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    @PostMapping(path = "/validateBlockchain", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<HashMap<String, List<String>>> validateBlockchain() throws Exception {
        return blockchainService.validateBlockchain();
    }
}