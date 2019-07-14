package Thalassa.Accessories.Repositories;

import Thalassa.Models.Vessel;
import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import org.springframework.data.repository.query.Param;

public interface VesselRepository extends ArangoRepository<Vessel, String> {
    @Query("FOR vessel IN #collection FILTER vessel._key == @imoNumber RETURN vessel")
    Vessel findByImoNumber(@Param("imoNumber") String imoNumber);
}