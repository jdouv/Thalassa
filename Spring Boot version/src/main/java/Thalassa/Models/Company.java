package Thalassa.Models;

import com.arangodb.springframework.annotation.Document;
import org.springframework.data.annotation.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.LinkedList;

@Document("Companies")
public class Company {

    @Id
    @NotBlank(message = "errorRequiredRegistryNumber")
    @Size(max = 30, message = "errorMaxRegistryNumber")
    private String registryNumber;

    @NotBlank(message = "errorRequiredCompanyName")
    private String name;

    @NotBlank(message = "errorRequiredCompanyType")
    private String type;

    @NotBlank(message = "errorRequiredEmail")
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "errorEmailInvalid")
    private String email;

    @NotBlank(message = "errorRequiredAddress")
    private String address;

    private LinkedList<String> vessels;

    public String getRegistryNumber() {
        return registryNumber;
    }

    public void setRegistryNumber(String registryNumber) {
        this.registryNumber = registryNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LinkedList<String> getVessels() {
        return vessels;
    }

    public void setVessels(LinkedList<String> vessels) {
        this.vessels = vessels;
    }
}