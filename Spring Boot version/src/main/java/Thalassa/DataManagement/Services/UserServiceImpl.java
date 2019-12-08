package Thalassa.DataManagement.Services;

import Thalassa.Configuration.Jwt.JwtResponse;
import Thalassa.Configuration.Jwt.JwtTokenUtil;
import Thalassa.DataManagement.Repositories.UserRepository;
import Thalassa.Models.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final ObjectMapper mapper;
    private final JwtTokenUtil jwtTokenUtil;

    public UserServiceImpl(UserRepository userRepository, ObjectMapper mapper, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public @ResponseBody boolean validateRegister(@RequestBody ObjectNode json) throws JsonProcessingException {
        return (!validate(json).has("invalidFields"));
    }

    @Override
    public Object register(ObjectNode json) throws IOException {
        User user = mapper.readValue(mapper.writeValueAsString(json.get("fields")), User.class);
        json = validate(json);
        if (json.has("invalidFields")) return json;

        user.setPublicKey(CryptographyService.getPublicKeyFromPrivate(user.getPrivateKey()));
        user.setPrivateKey(null); // since Thalassa lies on blockchain, private keys must not be stored
        user.setEnabled(true);
        user.setCorrespondingIndices(new HashMap<>());
        // For now, the newly created user is considered to belong to the demo company created during initialization.
        if (user.getPosition().equals("companyVesselsRegistryManager"))
            user.setCompany("1234567890");

        final User savedUser = userRepository.save(user);
        json.put("saved", savedUser.getPublicKey() != null);
        if (!json.get("saved").asBoolean()) return json;

        return new JwtResponse(jwtTokenUtil.generateToken(user), Files.readString(Paths.get("src/main/resources/views/" + user.getPosition() + ".js")));
    }

    @Override
    public Object login(ObjectNode json) throws IOException {
        String privateKey = json.get("fields").get("privateKey").textValue();
        json = validate(json);
        if (json.has("invalidFields")) return json;
        final User user = userRepository.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(privateKey));

        if (user != null)
            return new JwtResponse(jwtTokenUtil.generateToken(user), Files.readString(Paths.get("src/main/resources/views/" + user.getPosition() + ".js")));

        json.put("noUser", "noSuchCredentials");
        return json;
    }

    @Override
    public void save(User user) {
        user.setPrivateKey(null); // since Thalassa lies on blockchain, private keys must not be stored
        user.setEnabled(true);
        user.setCorrespondingIndices(new HashMap<>());
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String publicKey) throws UsernameNotFoundException {
        User user = userRepository.findByPublicKey(publicKey);
        if (user == null)
            throw new UsernameNotFoundException("User not found with public key " + publicKey + ".");
        String privateKey = (String) ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest().getSession(true).getAttribute("loggedInPrivateKey");

        return new org.springframework.security.core.userdetails.User(user.getPublicKey(), privateKey, new HashSet<>() {{
            add(new SimpleGrantedAuthority("ROLE_" + user.getPosition()));
        }});
    }

    @Override
    public User findByPublicKey(String publicKey) {
        return userRepository.findByPublicKey(publicKey);
    }

    @Override
    public User findByPosition(String position) {
        return userRepository.findByPosition(position);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public JsonNode findUserAndCompany(String publicKey) throws JsonProcessingException {
        return new ObjectMapper().readTree(new ObjectMapper().writeValueAsString(userRepository.findUserAndCompany(publicKey)));
    }

    @Override
    public JsonNode convertUserToJson(User user) throws JsonProcessingException {
        return new ObjectMapper().readValue(new ObjectMapper().writeValueAsString(user), ObjectNode.class);
    }

    private ObjectNode validate(ObjectNode oldJson) throws JsonProcessingException {
        ObjectNode json = mapper.createObjectNode();
        Iterator<Map.Entry<String, JsonNode>> iterator = oldJson.get("fields").fields();

        while (iterator.hasNext()) {
            Map.Entry element = iterator.next();
            String key = element.getKey().toString();

            HashMap<String, String> validation = validateValue(oldJson.get("type").textValue(), key, element.getValue().toString());
            if (!validation.isEmpty()) {
                if (!json.has("invalidFields"))
                    json.putObject("invalidFields");
                ((ObjectNode) json.get("invalidFields")).set(key, mapper.readValue(mapper.writeValueAsString(validation.get(key)), JsonNode.class));
            }
        }

        return json;
    }

    private HashMap<String, String> validateValue(String type, String key, String value) {
        HashMap<String, String> map = new HashMap<>();
        if (value.substring(0, 1).equals("\"") && value.substring(value.length() - 1).equals("\""))
            value = value.substring(1, value.length() - 1);

        if (key.equals("privateKey")) {
            if (value.length() > 0) {
                if (!value.matches("^[0-9a-fA-F]+$") && value.length() % 2 != 0)
                    map.put(key, "errorPrivateKeyInvalid");
            } else
                map.put(key, "errorRequiredPrivateKey");
        }

        if (!type.equals("register")) return map;

        switch (key) {
            case "firstName":
                if (value.length() < 1)
                    map.put(key, "errorRequiredFirstName");
                else if (!value.matches("\\p{L}+"))
                    map.put(key, "errorInputNotLetters");
                else if (value.length() > 100)
                    map.put(key, "errorMaxFirstName");
                break;
            case "lastName":
                if (value.length() < 1)
                    map.put(key, "errorRequiredLastName");
                else if (!value.matches("\\p{L}+"))
                    map.put(key, "errorInputNotLetters");
                else if (value.length() > 100)
                    map.put(key, "errorMaxLastName");
                break;
            case "email":
                if (value.length() < 1)
                    map.put(key, "errorRequiredEmail");
                else if (!value.matches("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"))
                    map.put(key, "errorEmailInvalid");
                else if (userRepository.findByEmail(value) != null)
                    map.put(key, "errorEmailAlreadyInUse");
                break;
            case "position":
                if (value.length() < 1)
                    map.put(key, "errorRequiredPosition");
                else if (!value.matches("\\p{L}+"))
                    map.put(key, "errorInputNotLetters");
                break;
            case "privateKey":
                break;
            default:
                throw new IllegalArgumentException("Unexpected json key during validation: " + key + ".");
        }

        return map;
    }
}