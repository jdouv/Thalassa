package Thalassa.Controllers;

import Thalassa.Configuration.Constants;
import Thalassa.Services.UserService;
import Thalassa.Services.CryptographyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/connectionTest")
    public boolean connectionTest() {
        return true;
    }

    // Checks if the e-mail provided by the user during registration already exists and returns boolean
    @PostMapping("/emailExists")
    public boolean emailExists(@RequestBody String email) {
        return userService.findByEmail(email) != null;
    }

    // Generates user’s public and private keys
    @PostMapping(path = "/generateKeys", produces = MediaType.APPLICATION_JSON_VALUE)
    public ObjectNode generateKeys() {
        String[] keys;
        // Generate keys and check if public key is already used
        do keys = CryptographyService.generateKeys();
        while (userService.findByPublicKey(keys[0]) != null);

        ObjectNode json = new ObjectMapper().createObjectNode();
        json.put("publicKey", keys[0]);
        json.put("privateKey", keys[1]);

        return json;
    }

    // Validates registration form before final registration
    @PostMapping(path = "/registerIsValid", consumes = MediaType.APPLICATION_JSON_VALUE)
    public boolean registerIsValid(@RequestBody ObjectNode json) throws JsonProcessingException {
        return userService.validateRegister(json);
    }

    // Returns localized messages
    @GetMapping(path = "/localization", produces = MediaType.APPLICATION_JSON_VALUE)
    public HashMap<String, HashMap<String, String>> localization() {
        return Constants.LOCALIZATION;
    }
}