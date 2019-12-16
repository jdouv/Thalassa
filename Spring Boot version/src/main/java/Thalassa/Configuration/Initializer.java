package Thalassa.Configuration;

import Thalassa.Repositories.BlockRepository;
import Thalassa.Repositories.UserRepository;
import Thalassa.Services.BlockchainService;
import Thalassa.Services.CompanyService;
import Thalassa.Services.CryptographyService;
import Thalassa.Services.UserService;
import Thalassa.Services.VesselService;
import Thalassa.Models.Company;
import Thalassa.Models.LegalEngineering.Clauses.Clause;
import Thalassa.Models.LegalEngineering.Clauses.FixedClauses.FixedClausesFactory;
import Thalassa.Models.LegalEngineering.Contract;
import Thalassa.Models.User;
import Thalassa.Models.Block;
import Thalassa.Models.Vessel;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import sun.misc.Unsafe;
import javax.annotation.PostConstruct;
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
    private final CompanyService companyService;
    private final UserService userService;
    private final VesselService vesselService;

    public Initializer(BlockRepository blockRepository,
                       UserRepository userRepository,
                       BlockchainService blockchainService,
                       CompanyService companyService,
                       UserService userService,
                       VesselService vesselService) {
        this.blockRepository = blockRepository;
        this.userRepository = userRepository;
        this.companyService = companyService;
        this.blockchainService = blockchainService;
        this.userService = userService;
        this.vesselService = vesselService;
    }

    @PostConstruct
    void initialize() throws Exception {

        // Add Bouncy Castle provider
        java.security.Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

        // Suppress warnings
        Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
        theUnsafe.setAccessible(true);
        Unsafe unsafe = (Unsafe) theUnsafe.get(null);
        unsafe.putObjectVolatile(Class.forName("jdk.internal.module.IllegalAccessLogger"),
                unsafe.staticFieldOffset(Class.forName("jdk.internal.module.IllegalAccessLogger")
                        .getDeclaredField("logger")), null);

        // Set admin for demo purposes
        if (userService.findByPosition("admin") == null)
            userService.save(new User() {{
                setPublicKey("efa3036945807cc349ae55b2b503d8832c0250bb8782d32b74af6a63850fedaa");
                setFirstName("Admin");
                setLastName("Admin");
                setEmail("admin@example.com");
                setPosition("admin");
                setEnabled(true);
                setCorrespondingIndices(new HashMap<>());
            }});

        // Set company vessels registry manager for demo purposes
        if (userService.findByPosition("companyVesselsRegistryManager") == null)
            userService.save(new User() {{
                setPublicKey("0783582ff507282b0ae01d2e1551530f347acb59180aabbbcc5ff359a7c3c323");
                setFirstName("Bernard");
                setLastName("Johnson");
                setEmail("bernard@example.com");
                setCompany("1234567890");
                setPosition("companyVesselsRegistryManager");
                setEnabled(true);
                setCorrespondingIndices(new HashMap<>());
            }});

        // Insert dummy data (vessel) for demo purposes
        if (vesselService.findByIMONumber("1234567890") == null)
            vesselService.save(new Vessel() {{
                setImoNumber("1234567890");
                setName("e-Harmony");
                setFlag("US");
                setCompany("1234567890");
                setYearBuilt("2019");
                setDwt("300000");
                setUnderConstruction(false);
            }});

        //Set company for demo purposes
        if (companyService.findByName("Maran Tankers Management Inc.") == null)
            companyService.save(new Company() {{
                setRegistryNumber("1234567890");
                setName("Maran Tankers Management Inc.");
                setType("tankerManagementServices");
                setEmail("maran@example.com");
                setAddress("Maran Avenue 123, New York 133 00, NY, United States");
                setVessels(new LinkedList<>() {{add(vesselService.findByName("e-Harmony").getId());}});
            }});

        // Set plain user for demo purposes
        User testUser = new User() {{
            setPublicKey("d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
            setFirstName("John");
            setLastName("Doe");
            setEmail("john@example.com");
            setCompany("1234567890");
            setPosition("legalEngineer");
            setEnabled(true);
            setCorrespondingIndices(new HashMap<>());
        }};

        ObjectMapper mapper = new ObjectMapper();

        User dbUser = userService.findByPublicKey("d083057717d54238428da204ba14ddb3ef287a7aa0e3abe1f9ad6c7874bfc446");
        // If there is already a user with this public key
        if (dbUser != null)
            testUser = dbUser;
        else
            userService.save(testUser);

        blockchainService.initializeBlockchain();

        // Insert dummy data (contract) for demo purposes
        if (!blockRepository.findLastBlock().getIndex().equals("0")) return;
        HashMap<String, Object> essentials = new HashMap<>() {{
            put("type", "timeCharter");
            put("preamble", "THIS TIME CHARTER, made and concluded in the datetime mentioned above between the parties described in the contracting parties section, shall be performed subject to all the terms and conditions included in the clauses section along with any additional clauses and addenda.");
            put("vessel", "1234567890");
        }};
        LinkedList<Clause> clauses = new LinkedList<>(Collections.singletonList(FixedClausesFactory.getOffHireClause()));
        Contract contractNoSignatures = new Contract("Contract", "timeCharter", essentials, clauses);
        String contractToString = mapper.writeValueAsString(contractNoSignatures);
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
        String[] encryptedData = CryptographyService.encrypt(mapper.writeValueAsString(new Contract("Contract", "timeCharter", essentials, clauses)));
        Block newLastBlock = blockRepository.findLastBlock();
        blockRepository.save(new Block(String.valueOf(Long.parseLong(newLastBlock.getIndex()) + 1), encryptedData[0], newLastBlock.getHash()));
        String encryptedSecret = CryptographyService.encryptWithPublicKey(encryptedData[1], testUser.getPublicKey());
        HashMap<String, String> userCorrespondingIndices = testUser.getCorrespondingIndices();
        userCorrespondingIndices.put(String.valueOf(Long.parseLong(newLastBlock.getIndex()) + 1), encryptedSecret);
        testUser.setCorrespondingIndices(userCorrespondingIndices);
        userRepository.save(testUser);
    }
}
