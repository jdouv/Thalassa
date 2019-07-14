package Thalassa.Configuration;

import Thalassa.Accessories.Repositories.BlockRepository;
import Thalassa.Accessories.Repositories.UserRepository;
import Thalassa.Accessories.Services.BlockchainService;
import Thalassa.Accessories.Services.UserService;
import Thalassa.Accessories.Services.VesselService;
import Thalassa.Models.LegalEngineering.Clauses.Clause;
import Thalassa.Models.LegalEngineering.Clauses.FixedClauses.FixedClausesFactory;
import Thalassa.Models.LegalEngineering.Contract;
import Thalassa.Models.User;
import Thalassa.Models.Block;
import Thalassa.Accessories.Services.CryptographyService;
import Thalassa.Models.Vessel;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.muquit.libsodiumjna.SodiumLibrary;
import com.sun.jna.Platform;
import org.springframework.stereotype.Component;
import sun.misc.Unsafe;
import javax.annotation.PostConstruct;
import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;

// Most methods in this class are for demo purposes only.
// In a production environment, only cryptography libraries initialization and
// method blockchainService.initializeBlockchain() are needed.
@Component
public class Initializer {

    private final BlockRepository blockRepository;
    private final UserRepository userRepository;
    private final BlockchainService blockchainService;
    private final UserService userService;
    private final VesselService vesselService;

    public Initializer(BlockRepository blockRepository,
                       UserRepository userRepository,
                       BlockchainService blockchainService,
                       UserService userService,
                       VesselService vesselService) {
        this.blockRepository = blockRepository;
        this.userRepository = userRepository;
        this.blockchainService = blockchainService;
        this.userService = userService;
        this.vesselService = vesselService;
    }

    @PostConstruct
    void initialize() throws Exception {
        // Suppress warnings
        Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
        theUnsafe.setAccessible(true);
        Unsafe unsafe = (Unsafe) theUnsafe.get(null);
        Class cls = Class.forName("jdk.internal.module.IllegalAccessLogger");
        unsafe.putObjectVolatile(cls, unsafe.staticFieldOffset(cls.getDeclaredField("logger")), null);

        // Add Bouncy Castle provider
        java.security.Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

        // Add Libsodium library
        String arch = null;
        if (System.getProperty("os.arch").contains("86"))
            arch = "x86";
        else if (System.getProperty("os.arch").contains("64"))
            arch = "x64";
        if (Platform.isMac())
            SodiumLibrary.setLibraryPath(new File("libs/libsodium.dylib").getAbsolutePath());
        else if (Platform.isWindows())
            SodiumLibrary.setLibraryPath(new File("libs/libsodium_" + arch + ".dll").getAbsolutePath());
        else
            SodiumLibrary.setLibraryPath(new File("libs/libsodium_" + arch + ".so").getAbsolutePath());

        // Set admin for demo purposes
        if (userService.findByPosition("Admin") == null) {
            User admin = new User();
            admin.setPublicKey("efa3036945807cc349ae55b2b503d8832c0250bb8782d32b74af6a63850fedaa");
            admin.setFirstName("Admin");
            admin.setLastName("Admin");
            admin.setEmail("admin@example.com");
            admin.setPosition("Admin");
            admin.setEnabled(true);
            admin.setCorrespondingIndices(new HashMap<>());
            userService.save(admin);
        }

        // Set plain user for demo purposes
        User testUser = new User();
        testUser.setPublicKey("d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john@example.com");
        testUser.setPosition("Legal engineer");
        testUser.setEnabled(true);
        testUser.setCorrespondingIndices(new HashMap<>());

        User dbUser = userRepository.findByPublicKey("d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
        // If there is already a user with this public key
        if (dbUser != null)
            testUser = dbUser;
        else
            userService.save(testUser);

        blockchainService.initializeBlockchain();

        // Insert dummy data (vessel) for demo purposes
        if (vesselService.findByIMONumber("1234567890") == null)
            vesselService.save(new Vessel("1234567890", "e-Harmony", "US", "2019", "300000"));

        // Insert dummy data (contract) for demo purposes
        if (!blockRepository.findLastBlock().getIndex().equals("0")) return;
        HashMap<String, Object> essentials = new HashMap<>() {{
            put("type", "timeCharter");
            put("preamble", "THIS CHARTERPARTY, made and concluded in the datetime mentioned above between the parties described in the contracting parties section, shall be performed subject to all the terms and conditions included in the clauses section along with any additional clauses and addenda.");
            put("vessel", "1234567890");
        }};
        LinkedList<Clause> clauses = new LinkedList<>(Collections.singletonList(FixedClausesFactory.getOffHireClause()));
        Contract contractNoSignatures = new Contract("Contract", "timeCharter", essentials, clauses);
        String contractToString = new ObjectMapper().writeValueAsString(contractNoSignatures);
        HashMap<String, Object> signature1 = new HashMap<>() {{
            put("signature", CryptographyService.sign(contractToString, "d0b2df0582f262e50dccc9f3586ded1d0560ff4b46db82806a74b2493e9b92ad"));
            put("signer", "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
            put("onBehalfOf", "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
        }};
        HashMap<String, Object> signature2 = new HashMap<>() {{
            put("signature", CryptographyService.sign(contractToString, "d0b2df0582f262e50dccc9f3586ded1d0560ff4b46db82806a74b2493e9b92ad"));
            put("onBehalfOf", "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
            put("signer", "d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
        }};
        essentials.put("signatures", new ArrayList<>(Arrays.asList(signature1, signature2)));
        String[] encryptedData = CryptographyService.encrypt(new ObjectMapper().writeValueAsString(new Contract("Contract", "timeCharter", essentials, clauses)));
        Block newLastBlock = blockRepository.findLastBlock();
        blockRepository.save(new Block(String.valueOf(Long.valueOf(newLastBlock.getIndex()) + 1), encryptedData[0], newLastBlock.getHash()));
        String encryptedSecret = CryptographyService.encryptWithPublicKey(encryptedData[1], testUser.getPublicKey());
        HashMap<String, String> userCorrespondingIndices = testUser.getCorrespondingIndices();
        userCorrespondingIndices.put(String.valueOf(Long.valueOf(newLastBlock.getIndex()) + 1), encryptedSecret);
        testUser.setCorrespondingIndices(userCorrespondingIndices);
        userRepository.save(testUser);
    }
}
