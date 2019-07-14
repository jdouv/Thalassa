package Thalassa.Accessories.Services;

import Thalassa.Models.User;

public interface UserService {
    User findByEmail(String email);
    User findByPublicKey(String publicKey);
    User findByPosition(String position);
    void save(User user);
}