package Thalassa.Models;

import com.arangodb.springframework.annotation.Document;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import java.util.HashMap;

@Document("Users")
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    @Id
    private String publicKey;
    private String firstName, lastName, email, company, position, privateKey;
    private HashMap<String, String> correspondingIndices;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
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