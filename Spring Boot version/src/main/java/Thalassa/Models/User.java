package Thalassa.Models;

import com.arangodb.springframework.annotation.Document;
import com.arangodb.springframework.annotation.Field;
import org.springframework.data.annotation.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.HashMap;

@Document("Users")
public class User {

    @Id
    private String publicKey;
    @Field("First name")
    @NotBlank(message =  "{error.requiredFirstName}")
    @Size(max = 30, message = "{error.maxFirstName}")
    private String firstName;
    @Field("Last name")
    @NotBlank(message =  "{error.requiredLastName}")
    @Size(max = 30, message = "{error.maxLastName}")
    private String lastName;
    @Field("E-mail")
    @NotBlank(message =  "{error.requiredEmail}")
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "{error.emailInvalid}")
    private String email;
    @Field("Position")
    @NotBlank(message =  "{error.requiredPosition}")
    private String position;
    private String privateKey;
    @Field("Corresponding indices")
    private HashMap<String, String> correspondingIndices;
    @Field("Enabled")
    private boolean enabled;

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public HashMap<String, String> getCorrespondingIndices() {
        return correspondingIndices;
    }

    public void setCorrespondingIndices(HashMap<String, String> correspondingIndices) {
        this.correspondingIndices = correspondingIndices;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}