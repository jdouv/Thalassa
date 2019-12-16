package Thalassa.Controllers;

import Thalassa.Controllers.AuthorizationAnnotations.AuthorizedCompanyVesselsRegistryManager;
import Thalassa.Services.VesselService;
import Thalassa.Models.Vessel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@AuthorizedCompanyVesselsRegistryManager
public class VesselsController {

    private final VesselService vesselService;

    public VesselsController(VesselService vesselService) {
        this.vesselService = vesselService;
    }

    @PostMapping(path = "/vesselsRegistry", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Vessel> getVesselsRegistry(HttpSession session) {
        return vesselService.getVesselsRegistry(session.getAttribute("loggedInPrivateKey").toString());
    }

    @PostMapping(path = "/insertVessel", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ObjectNode insertVessel(@RequestBody ObjectNode json, HttpSession session) throws JsonProcessingException {
        return vesselService.save(json, (String) session.getAttribute("loggedInPrivateKey"));
    }

    @PostMapping(path = "/updateVessel", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ObjectNode updateVessel(@RequestBody ObjectNode json) throws JsonProcessingException {
        return vesselService.update(json);
    }
}