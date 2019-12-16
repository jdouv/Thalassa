package Thalassa.Repositories;

import Thalassa.Models.ConstantsData;
import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;

public interface ConstantsDataRepository extends ArangoRepository<ConstantsData, String> {

    @Query("FOR constantsData IN #collection RETURN constantsData")
    ConstantsData find();
}