package Thalassa.DataManagement.Repositories;

import Thalassa.Models.Vessel;
import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VesselRepository extends ArangoRepository<Vessel, String> {
    @Query("FOR vessel IN #collection FILTER vessel.imoNumber == @imoNumber RETURN vessel")
    Vessel findByImoNumber(@Param("imoNumber") String imoNumber);

    @Query("FOR user IN Users FILTER user._key == @publicKey FOR company in Companies FILTER company._key == user.company FOR vessels in Vessels FILTER vessels._key IN company.vessels RETURN vessels")
    List<Vessel> findAllByLoggedInUser(@Param("publicKey") String publicKey);

    Vessel findByName(String name);
}