package Thalassa.Repositories;

import Thalassa.Models.Block;
import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import java.util.List;

public interface BlockRepository extends ArangoRepository<Block, String> {
    @Query("FOR block IN #collection RETURN block")
    List<Block> findAll();

    Block findByIndex(String index);

    @Query("FOR block IN #collection SORT block._key DESC LIMIT 1 RETURN block")
    Block findLastBlock();
}