package Thalassa.Accessories.Services;

import Thalassa.Models.Vessel;

public interface VesselService {
    Vessel findByIMONumber(String imoNumber);
    void save(Vessel vessel);
}