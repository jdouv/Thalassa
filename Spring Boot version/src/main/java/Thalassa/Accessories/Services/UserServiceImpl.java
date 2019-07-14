package Thalassa.Accessories.Services;

import Thalassa.Accessories.Repositories.UserRepository;
import Thalassa.Models.User;
import org.springframework.stereotype.Service;
import java.util.HashMap;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void save(User user) {
        user.setPrivateKey(null); // since Thalassa lies on blockchain, private keys must not be stored
        user.setEnabled(true);
        user.setCorrespondingIndices(new HashMap<>());
        userRepository.save(user);
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
}