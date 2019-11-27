package Thalassa.DataManagement.Services;

import Thalassa.DataManagement.Repositories.CompanyRepository;
import Thalassa.DataManagement.Repositories.UserRepository;
import Thalassa.DataManagement.Repositories.VesselRepository;
import Thalassa.Models.Company;
import Thalassa.Models.Vessel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class VesselServiceImpl implements VesselService {

    private final VesselRepository vesselRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ObjectMapper mapper;

    public VesselServiceImpl(VesselRepository vesselRepository, CompanyRepository companyRepository, UserRepository userRepository, ObjectMapper mapper) {
        this.vesselRepository = vesselRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    public ObjectNode save(ObjectNode json, String privateKey) throws JsonProcessingException {
        ObjectNode newJson = validate(json);
        if (newJson.has("invalidFields")) return newJson;
        Vessel vessel = mapper.readValue(mapper.writeValueAsString(json), Vessel.class);
        vessel.setCompany(userRepository.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(privateKey)).getCompany());

        try {
            Vessel savedVessel = vesselRepository.save(vessel);
            Company company = companyRepository.findByRegistryNumber(savedVessel.getCompany());
            LinkedList<String> vessels = company.getVessels();
            vessels.add(savedVessel.getId());
            company.setVessels(vessels);
            companyRepository.save(company);
            newJson.put("saved", true);
            return newJson;
        } catch (Exception e) {
            e.printStackTrace();
            newJson.put("saved", false);
            newJson.put("errorDetails", e.getMessage() != null ? e.getMessage() : e.toString());
            return newJson;
        }
    }

    @Override
    public ObjectNode update(ObjectNode json) throws JsonProcessingException {
        ObjectNode newJson = validate(json);
        if (newJson.has("invalidFields")) return newJson;
        Vessel vessel = mapper.readValue(mapper.writeValueAsString(json), Vessel.class);
        
        try {
            vesselRepository.save(vessel);
            newJson.put("updated", true);
            return newJson;
        } catch (Exception e) {
            e.printStackTrace();
            newJson.put("updated", false);
            newJson.put("errorDetails", e.getMessage() != null ? e.getMessage() : e.toString());
            return newJson;
        }
    }

    @Override
    public Vessel findByName(String name) {
        return vesselRepository.findByName(name);
    }

    @Override
    public Vessel findByIMONumber(String imoNumber) {
        return vesselRepository.findByImoNumber(imoNumber);
    }

    @Override
    public void save(Vessel vessel) {
        vesselRepository.save(vessel);
    }

    @Override
    public List<Vessel> getVesselsRegistry(String privateKey) {
        return vesselRepository.findAllByLoggedInUser(CryptographyService.getPublicKeyFromPrivate(privateKey));
    }

    private ObjectNode validate(JsonNode oldJson) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode json = mapper.createObjectNode();

        if (!oldJson.get("underConstruction").asBoolean()) {
            Iterator<Map.Entry<String, JsonNode>> iterator = oldJson.fields();
            while (iterator.hasNext()) {
                Map.Entry element = iterator.next();
                String key = element.getKey().toString();

                HashMap<String, String> validation = validateValue(key, element.getValue().toString());
                if (!validation.isEmpty()) {
                    if (!json.has("invalidFields"))
                        json.putObject("invalidFields");
                    ((ObjectNode) json.get("invalidFields")).set(key, mapper.readValue(mapper.writeValueAsString(validation.get(key)), JsonNode.class));
                }
            }
        }

        return json;
    }

    private HashMap<String, String> validateValue(String key, String value) {
        HashMap<String, String> map = new HashMap<>();
        if (value.substring(0, 1).equals("\"") && value.substring(value.length() - 1).equals("\""))
            value = value.substring(1, value.length() - 1);

        switch (key) {
            case "imoNumber":
                if (value.length() < 1)
                    map.put(key, "errorRequiredVesselImoNumber");
                else if (!value.matches("\\d+"))
                    map.put(key, "errorInputNotNumerical");
                else if (value.length() > 100)
                    map.put(key, "errorMaxVesselImoNumber");
                break;
            case "name":
                if (value.length() < 1)
                    map.put(key, "errorRequiredVesselName");
                else if (value.length() > 100)
                    map.put(key, "errorMaxVesselName");
                break;
            case "flag":
                if (value.length() < 1)
                    map.put(key, "errorRequiredVesselFlag");
                else if (!value.matches("\\p{L}+"))
                    map.put(key, "errorInputNotLetters");
                else if (value.length() > 2)
                    map.put(key, "errorSizeVesselFlag");
                break;
            case "yearBuilt":
                if (value.length() < 1)
                    map.put(key, "errorRequiredVesselYearBuilt");
                else if (!value.matches("\\d+"))
                    map.put(key, "errorInputNotNumerical");
                else if (value.length() != 4)
                    map.put(key, "errorSizeVesselYearBuilt");
                break;
            case "dwt":
                if (value.length() < 1)
                    map.put(key, "errorRequiredVesselDwt");
                else if (!value.matches("\\d+"))
                    map.put(key, "errorInputNotNumerical");
                else if (value.length() > 10)
                    map.put(key, "errorMaxVesselDwt");
                break;
            case "id":
            case "company":
            case "underConstruction":
                break;
            default:
                throw new IllegalArgumentException("Unexpected json key during validation: " + key + ".");
        }

        return map;
    }
}