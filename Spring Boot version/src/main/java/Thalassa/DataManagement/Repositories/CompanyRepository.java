package Thalassa.DataManagement.Repositories;

import Thalassa.Models.Company;
import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends ArangoRepository<Company, String> {
    @Query("FOR company IN #collection FILTER company.name == @name RETURN company")
    Company findByName(@Param("name") String name);

    @Query("FOR company IN #collection FILTER company._key == @registryNumber RETURN company")
    Company findByRegistryNumber(@Param("registryNumber") String registryNumber);
}