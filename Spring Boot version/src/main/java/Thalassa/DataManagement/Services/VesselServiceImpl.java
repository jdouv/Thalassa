package Thalassa.DataManagement.Services;

import Thalassa.DataManagement.Repositories.VesselRepository;
import Thalassa.Models.Vessel;
import org.springframework.stereotype.Service;

@Service
public class VesselServiceImpl implements VesselService {

    private final VesselRepository vesselRepository;

    public VesselServiceImpl(VesselRepository vesselRepository) {
        this.vesselRepository = vesselRepository;
    }

    @Override
    public void save(Vessel vessel) {
        vesselRepository.save(vessel);
    }

    @Override
    public Vessel findByIMONumber(String imoNumber) {
        return vesselRepository.findByImoNumber(imoNumber);
    }
}