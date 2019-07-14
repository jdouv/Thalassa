package Thalassa.Accessories.Repositories;

import Thalassa.Models.User;
import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends ArangoRepository<User, String> {
    @Query("FOR user IN #collection FILTER user.email == @email RETURN user")
    User findByEmail(@Param("email") String email);
    @Query("FOR user IN #collection FILTER user.position == @position RETURN user")
    User findByPosition(@Param("position") String position);
    @Query("FOR user IN #collection FILTER user._key == @publicKey RETURN user")
    User findByPublicKey(@Param("publicKey") String publicKey);
}