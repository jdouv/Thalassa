package Thalassa.Services;

import Thalassa.Models.Vessel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.List;

public interface VesselService {
    Vessel findByName(String name);
    Vessel findByIMONumber(String imoNumber);
    void save(Vessel vessel);
    ObjectNode save(ObjectNode json, String privateKey) throws JsonProcessingException;
    ObjectNode update(ObjectNode json) throws JsonProcessingException;
    List<Vessel> getVesselsRegistry(String privateKey);
}