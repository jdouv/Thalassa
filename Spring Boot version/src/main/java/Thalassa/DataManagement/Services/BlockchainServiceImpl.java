package Thalassa.DataManagement.Services;

import Thalassa.DataManagement.Repositories.BlockRepository;
import Thalassa.Models.Block;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Service
public class BlockchainServiceImpl implements BlockchainService {

    private final BlockRepository blockRepository;

    public BlockchainServiceImpl(BlockRepository blockRepository) {
        this.blockRepository = blockRepository;
    }

    @Override
    // Creates genesis block if no block if found in the blockchain
    public void initializeBlockchain() throws Exception {
        if (blockRepository.findLastBlock() != null) return;
        blockRepository.save(new Block(String.valueOf(0), "{'type':'Genesis block'}"));
    }

    // Validates service’s blockchain
    @Override
    public List<HashMap<String, List<String>>> validateBlockchain() throws Exception {
        initializeBlockchain();
        List<Block> blockchain = blockRepository.findAll();

        if (blockchain.size() == 1) // If blockchain has only one (genesis) block, there is no need for validation
            return null;
        else {
            HashMap<String, List<String>> calculationResults = new HashMap<>(), referenceResults = new HashMap<>();

            // Genesis block validation
            Block genesisBlock = blockchain.get(0);
            if (!genesisBlock.getHash().equals(genesisBlock.calculateHash())) {
                List<String> hashes = new ArrayList<>(Arrays.asList(String.valueOf(genesisBlock.getTimestamp()), genesisBlock.calculateHash(), genesisBlock.getHash()));
                calculationResults.put(genesisBlock.getIndex(), hashes);
            }

            // Rest blocks validation
            for (int i = 1; i < blockchain.size(); i++) {
                Block currentBlock = blockchain.get(i);
                String currentBlockDatetime = String.valueOf(currentBlock.getTimestamp());
                String currentBlockExpectedHash = currentBlock.calculateHash();
                Block previousBlock = blockchain.get(i - 1);
                String previousBlockDatetime = String.valueOf(previousBlock.getTimestamp());

                // If current block’s hash field is not equal to its hash expected after recalculation
                if (!currentBlock.getHash().equals(currentBlockExpectedHash)) {
                    List<String> hashes = new ArrayList<>(Arrays.asList(currentBlockDatetime, currentBlockExpectedHash, currentBlock.getHash()));
                    calculationResults.put(currentBlock.getIndex(), hashes);
                }

                // If current block’s reference to previous block’s hash is not equal to previous block’s hash field
                if (currentBlock.getPreviousHash().equals(previousBlock.getHash())) continue;
                List<String> hashes = new ArrayList<>(Arrays.asList(previousBlockDatetime, currentBlockDatetime, previousBlock.getHash(), currentBlock.getPreviousHash()));
                referenceResults.put(previousBlock.getIndex(), hashes);
            }

            return new ArrayList<>(Arrays.asList(calculationResults, referenceResults));
        }
    }
}