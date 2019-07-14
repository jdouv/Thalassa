package Thalassa.Accessories.Services;

import Thalassa.Accessories.Repositories.BlockRepository;
import Thalassa.Accessories.Repositories.UserRepository;
import Thalassa.Accessories.Repositories.VesselRepository;
import Thalassa.Models.LegalEngineering.Clauses.Clause;
import Thalassa.Models.LegalEngineering.Clauses.FixedClauses.OffHire;
import Thalassa.Models.LegalEngineering.Contract;
import Thalassa.Models.User;
import Thalassa.Models.Block;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Service
public class ContractServiceImpl implements ContractService {

    private final BlockRepository blockRepository;
    private final UserRepository userRepository;
    private final VesselRepository vesselRepository;

    public ContractServiceImpl(BlockRepository blockRepository, UserRepository userRepository, VesselRepository vesselRepository) {
        this.blockRepository = blockRepository;
        this.userRepository = userRepository;
        this.vesselRepository = vesselRepository;
    }

    // Creates, encrypts and saves a new contract in the database as block
    // Currently not used - implementation pending
    public void concludeContract(Contract contract) throws Exception {
        // Parse contract into json string
        String jsonToString = new ObjectMapper().writeValueAsString(contract);

        // Encrypt string
        String[] encryptedData = CryptographyService.encrypt(jsonToString);
        String encryptedContract = encryptedData[0];
        String secretKey = encryptedData[1];

        // Save block in the database
        Block lastBlock = blockRepository.findLastBlock();
        String lastBlockIndex = lastBlock.getIndex();
        String lastBlockHash = lastBlock.getHash();
        String newBlockIndex = String.valueOf(Long.valueOf(lastBlockIndex) + 1);
        blockRepository.save(new Block(newBlockIndex, encryptedContract, lastBlockHash));

        // Encrypt and send the secret key to all users included in the contract
        for (Object hashMap : (List<Object>) contract.getEssentials().get("signatures")) {
            for (HashMap.Entry<String, Object> element : ((HashMap<String, Object>)hashMap).entrySet())
                if (element.getKey().equals("signer") || element.getKey().equals("onBehalfOf")) {
                    String encryptedSecret = CryptographyService.encryptWithPublicKey(secretKey, (String) element.getValue());
                    User userToBeUpdated = userRepository.findByPublicKey((String) element.getValue());
                    HashMap<String, String> userCorrespondingIndices = userToBeUpdated.getCorrespondingIndices();
                    userCorrespondingIndices.put(newBlockIndex, encryptedSecret);
                    userToBeUpdated.setCorrespondingIndices(userCorrespondingIndices);
                    userRepository.save(userToBeUpdated);
                }
        }
    }

    // Returns logged in user’s already concluded contracts
    public List<HashMap<String, Object>> getUserContracts(String privateKey) throws Exception {
        User user = userRepository.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(privateKey));
        HashMap<String, String> userCorrespondingIndices = user.getCorrespondingIndices();
        List<HashMap<String, Object>> contracts = new ArrayList<>();

        // Find all indices that correspond to this user
        for (HashMap.Entry<String, String> element : userCorrespondingIndices.entrySet()) {
            String index = element.getKey();
            String encryptedSecretKey = element.getValue();
            Block block = blockRepository.findByIndex(index);
            String decryptedSecretKey = CryptographyService.decryptWithPrivateKey(encryptedSecretKey, privateKey);
            String decryptedData = CryptographyService.decrypt(block.getData(), decryptedSecretKey);

            // If decrypted data is a contract indeed
            ObjectNode node = new ObjectMapper().readValue(decryptedData, ObjectNode.class);
            if (node.has("type") && node.get("type").textValue().equals("Contract")) {
                HashMap<String, Object> contract = new HashMap<>();
                contract.put("title", node.get("title").textValue());
                contract.put("index", block.getIndex());
                contract.put("hash", block.getHash());
                contract.put("timestamp", block.getDatetimeFromTimestamp());
                // Add contract to contracts list
                contracts.add(contract);
            }
        }
        return contracts;
    }

    // Returns a contract by its block index and validates its signatures
    public HashMap<String, Object> getContract(String index, String privateKey) throws Exception {
        User user = userRepository.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(privateKey));
        String encryptedSecretKey = user.getCorrespondingIndices().get(index);
        Block block = blockRepository.findByIndex(index);
        HashMap<String, Object> composedContract = new HashMap<>() {{
            put("index", block.getIndex()); put("hash", block.getHash()); put("timestamp", block.getDatetimeFromTimestamp());
        }};
        String decryptedSecretKey = CryptographyService.decryptWithPrivateKey(encryptedSecretKey, privateKey);
        String decryptedData = CryptographyService.decrypt(block.getData(), decryptedSecretKey);

        // If decrypted data is a contract indeed
        ObjectNode node = new ObjectMapper().readValue(decryptedData, ObjectNode.class);
        if (!node.has("type") || !node.get("type").textValue().equals("Contract")) return null;
        Contract contract = new ObjectMapper().readValue(decryptedData, Contract.class);
        ObjectNode contractNoSignatures = new ObjectMapper().readValue(decryptedData, ObjectNode.class);
        // Delete all signatures, since the signature will be validated on a “clean” contract
        ((ObjectNode) contractNoSignatures.get("essentials")).remove("signatures");
        if (contract.getEssentials().get("type").equals("timeCharter"))
            contract.getEssentials().put("vessel", vesselRepository.findByImoNumber((String) contract.getEssentials().get("vessel")));
        for (HashMap<String, Object> signature : (List<HashMap<String, Object>>) contract.getEssentials().get("signatures")) {
            for (HashMap.Entry<String, Object> element : signature.entrySet()) {
                if (element.getKey().equals("signer") || element.getKey().equals("onBehalfOf"))
                    element.setValue(userRepository.findByPublicKey((String) element.getValue()));
            }
            String signatureToValidate = (String) signature.get("signature");
            String publicKey = ((User) signature.get("signer")).getPublicKey();
            signature.put("valid", CryptographyService.verify(signatureToValidate, contractNoSignatures.toString(), publicKey));
        }

        // Convert each paragraph to readable format and add it to the contract
        for (Clause clause : contract.getClauses()) {
            for (HashMap<String, Object> paragraph : clause.getParagraphs())
                paragraph.put("readable", clause.getParagraphReadable((String) paragraph.get("legen")));
        }
        composedContract.put("contract", contract);

        return composedContract;
    }

    // Tests demo contract’s off-hire clause
    public String testEnableOffHireClause() {
        Random random = new Random();

        List<String> causes = new ArrayList<>();
        causes.add(".systems(breakdown)");
        causes.add(".machinery(breakdown)");
        causes.add(".equipment(breakdown)");
        causes.add("@<grounding");
        causes.add("@<detention");
        causes.add("@<drydocking");
        causes.add("@<cyber event");

        // Set a random number of days (loss of time)
        int first = random.nextInt(10) + 1;
        while (first == 0)
            first = random.nextInt(10) + 1;
        List<String> context = new ArrayList<>(Arrays.asList("@loss of time", "@>" + first));

        // Get random items from causes list
        int second = random.nextInt(6) + 1;
        while (second == 0)
            second = random.nextInt(6) + 1;
        for (int i = 0; i <= second; i++) {
            int randomInt = random.nextInt(causes.size());
            String value = causes.get(randomInt);
            while (context.contains(value)) {
                randomInt = random.nextInt(causes.size());
                value = causes.get(randomInt);
            }
            context.add(causes.get(randomInt));
        }
        for (int i = 0; i < context.size() - 1; i++) {
            if (context.get(i).contains("breakdown")) {
                context.add("@<breakdown");
                break;
            }
        }

        return new OffHire().enableClause(context);
    }
}