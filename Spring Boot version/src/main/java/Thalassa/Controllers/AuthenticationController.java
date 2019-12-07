package Thalassa.Controllers;

import Thalassa.Configuration.CustomAuthenticationProvider;
import Thalassa.Configuration.Jwt.JwtResponse;
import Thalassa.DataManagement.Services.CryptographyService;
import Thalassa.DataManagement.Services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
public class AuthenticationController {

    private final UserService userService;
    private final CustomAuthenticationProvider authenticationProvider;

    public AuthenticationController(UserService userService, CustomAuthenticationProvider authenticationProvider) {
        this.userService = userService;
        this.authenticationProvider = authenticationProvider;
    }

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Object register(@RequestBody ObjectNode json, HttpSession session) throws JsonProcessingException {
        return authenticate(json, session, userService.register(json));
    }

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Object login(@RequestBody ObjectNode json, HttpSession session) throws JsonProcessingException {
        return authenticate(json, session, userService.login(json));
    }

    private Object authenticate(@RequestBody ObjectNode json, HttpSession session, Object result) {
        if (!(result instanceof JwtResponse)) return result;

        session.setAttribute("loggedInPrivateKey", json.get("fields").get("privateKey").textValue());
        final Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(
                        CryptographyService.getPublicKeyFromPrivate(json.get("fields").get("privateKey").textValue()),
                        json.get("fields").get("privateKey").textValue()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return result;
    }
}