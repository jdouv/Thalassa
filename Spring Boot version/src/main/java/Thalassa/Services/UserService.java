package Thalassa.Services;

import Thalassa.Models.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.io.IOException;

public interface UserService {
    User findByEmail(String email);
    User findByPublicKey(String publicKey);
    User findByPosition(String position);
    boolean validateRegister(ObjectNode json) throws JsonProcessingException;
    Object register(ObjectNode json) throws IOException;
    Object login(ObjectNode json) throws IOException;
    void save(User user);
    UserDetails loadUserByUsername(String publicKey) throws UsernameNotFoundException;
    JsonNode findUserAndCompany(String publicKey) throws JsonProcessingException;
    JsonNode convertUserToJson(User user) throws JsonProcessingException;
}