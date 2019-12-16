package Thalassa.Services;

import Thalassa.Configuration.Constants;
import Thalassa.Models.ConstantsData;
import Thalassa.Repositories.ConstantsDataRepository;
import Thalassa.Thalassa;
import com.muquit.libsodiumjna.SodiumLibrary;
import com.sun.jna.Platform;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class ConstantsServiceImpl implements ConstantsService {

    private final ConstantsDataRepository constantsDataRepository;

    public ConstantsServiceImpl(ConstantsDataRepository constantsDataRepository) {
        this.constantsDataRepository = constantsDataRepository;
    }

    // Sets/retrieves essential data from database during service initialization
    @Override
    public void setConstants() throws IOException {
        ConstantsData result = constantsDataRepository.find();

        if (result != null)
            setConstantsInner(result);
        else {
            // This section should be absent in a production environment.
            // Sensitive data must not be stored in code.
            var constantsData = new ConstantsData() {{
                setCertificate("30820adf02010330820a9806092a864886f70d010701a0820a8904820a8530820a813082056d06092a864886f70d010701a082055e0482055a3082055630820552060b2a864886f70d010c0a0102a08204fb308204f73029060a2a864886f70d010c0103301b041408ff61e23e2bffc5d6dc8ad4c1d2eb4d4e8d491d020300c350048204c8aaa79b3a6e2087a541bae8a64d8f1ed7ac99cb3c466e7e0b5f5bf7735e3c85edfc9cd2848d64485cfaf634bb9cfea566d06a6bd1fcfe10608a6ebada1a1bb1d7bd8132db6e559338f3c32234151acb99ba89e6e4940ba5b7c1bc7743b46a8313eb9bbf37c47fbf966d33ac15443dc3d22345f5fd69894cc5df94bf7a5655528c49de7fb2b16c8c651e2a53c423c99a222fe60e3d952fbfa8c00a61535b0cd3062f2225c75be932e949c0a6de3c9aeed9f82d0c5cc240b60d6dc9404cf38fbe90b64ed3955bf90e3c4130fe05dc33ca0ada9d64790a0295f3336748ed3eae8e17cfc0c7d7b62a4cbd7550b7a2ada0434046f86562b529d860e451bae3af221b955422b5bff4bb7a1136e8af2c0585bdb92c23468dd6f83e110378e603859e224aaaf41edac925c3e445a356f2c481874aebc2f972d77b6a80bb8afe358f326482ee92bba40ec5841e18964a24edb07585720ae54a97be7617ef741854f1dbc9025754c4716925d516167e98ed345e77b1036546d44f030cf7a5e3420253ccf1fc6c056f26ecc0706a72f594fe66da8d7cae758ffe91d13d3920294cfb484b31f3b36dd616642cf692567b6cac314260edd8fe5cbeb1816bc695e8182cf7c2fd6b3838750cc69737a16ae38a813b9d6e0bca3f8a475ae5e802f89f39103286dbf7e794c002e1fc1f67b6d772f6062697d220bd9a5e4ad3f6ec6f91b24d6adb519540937e12bd3541ab680bc78ebb81885fcde9335992d3c245c801da7859e8d5299b1c69a44125f1f959a6c41fb8a7ab5364c9968a7bc0b27cff868690131acbc3854a93ca93e28ffd4b2f9df40e207a48b88a8c741efacad25aa405f58ace51bf9990f96cfeb66ebabc3649aad36ad1174da7bf7b9f96aa71a04e1972d3ae88de68498cec41ef2ca63e0eeb2788e4a71f850f9e45de131222df1d4c06066885572901515d0377edd50ddd93eb8a3c581807e6fdfc171605cceaa98146de1ac5055226374d6197a00fe6694683faf3503b86e6f7143d7dd19d71cecd35196793cc7a0483a319963eafa343d9f1e21c9a8a30cab657909492395abff5cffe5e1855c6339ed5418fdaa2fa105e7a4ed0366d6fe57a5a509b4d815b19cac1d36c799359dd9f6b42691247f095eb7a2cfd2f162ca36885c4f42d00765a3846535733cde9693756f8742ec305f19b2e7b56d65757441a54a522a189376692148783b7cf2a77c7e99120285e645d54891a4348ae2607725472bbee514c8fc934e32b003578d9f5444243b6092c67e3be8e4293227688785d7a7e331f29f1d1e25d153f01061a33d04282bddafeccee8f8071f1542158232fa2ed6dd560ad8b6984f8f38948f8b940cf619ef922be7a9d05fa05de8192d357ce45d99493961b26ff7eae2dc810a2fbb06af2bd41b600c88c4ffcb56f5d76656c1383aa10bf7bc443ddf87c41d395136a620329ace90604d2347e1a6485cdf8025c094c3682953ddc87abdee46e99e7cc5d8e79f3720014fa8005bde2f52f4fd8ef1b212541595b32899224c991905796176d6f7d359200790e6e6ac36de63a26bbde7096ad70e93b8836a06c82e9a60c72c46820d777f315c45d714c1934d981478643d5c144de1a7163ffaad970bca7ee9c0c3b2ff8e9dc3db16eb1f2de8dd4a66d030b90a685785a20bbf6f251bfb47ecd51b9b64de9316b947d5e5f41780c63e0c00d1c97b11bb4c2256c4d0bd3630285623144301f06092a864886f70d01091431121e10007400680061006c0061007300730061302106092a864886f70d0109153114041254696d6520313537343236353434333637393082050c06092a864886f70d010706a08204fd308204f9020100308204f206092a864886f70d0107013029060a2a864886f70d010c0106301b0414c9cf8067e476db9e9379f7f17194325bbc0c7b41020300c350808204b890c8d826dfe69526ba1dd685859a6c4d653940e452e864816b017ffccfd9759d4cbb1f5bc46bab9730a566a7c64dd33be4f2497e930a5c8833119e5b529db409dbe82c9e1da9d73ce1ee9ba84d6ebcae87fa3affbe39616e6c73a625530be6c9b3ff2e9dcfa7086a072ed77453b5abd6082e9aa8009f5b59a5206476d28f2eabb0d8af8424b074938c910092e68cf9ab04216d8bec974345b73819dec98e2e7b87fa1f1e05492411d9bdcef66729653f19f5fef1bf09854355483b5a0a45f318c5487929c0811d51fca9912be24da2f82bec333ae74d7ce8b6d4f6500598572993261be8a3569ccc6101dfe9fb792e8edcaf4e7270aae10b9a5bcf3e40979f173d41a3cf4dc8a1a4223a3026cac2c52bc57af0970052610c64f56cfd97288541774c8f1391782d4013353ebf116c3f10b095a9fcc25dae99ddd5984f2a182cc92c2074ebe0769c83943e40c43b85aeafa4a07c870210bd8f34c4014faf6c5cbe02cee0508ec85d3adebab3ccb1475a8b1d60320fed621739844f8e9ac99b1c183eba7afa36dac4e7b8edb5bdba3a6e87e50104e4f5736239ed2d02df9e0b10a8b619bd46693e227d7e275baaf873125e760c9f8d59a03361b36545fe1674a57ad9db93992dbacfb1003d80a1d3e8e78f996a625e4657a52a4137c1f82c9ac1006097361b04fe233d186c2c574109fd8900ced5e5338034045ee32b536d1113d9b0f57440aefefab4f4543d3249c95c62000cf2a0b0588b5298ba54e895708816823030da471cc4e11677991dbf01d151212f832eef9827c8e90e9af6ff254ff4fecea5780b82d0bb8dc28599a56da877ec2ebe771b10883e2bd8bf334a2a1993ed142f05aa49dcc0fad41e6b6492f700e54ef5edd3ea2b5b6ea9de6ac3e220dfedb3cad24831b7851be7954f14347f44367c9187255ef2b8682dfe255af990ff538abd19ef3b9410df9489603f6af818de24a78cdae9a4831e63b2602d375c5ac6d13eb991b9f4786f30e5b16c3cb2ed515ab94a3f761937327674a490764c4811c87e42c9ad4aead362e863ddc5168bd3e0525308cccca36248b277ac54d127b09ee325d7ee6fa195b158d7b1db544e1f8dd99ca4e9dcdc39773451768161611ffcb2eed5481bd1617cb7104d10eafbc4d85e231c834aea6d215c1dcdcdb4b3ce26000d3b9bef2f00dc52b0e9b6010bdb295eb7cd74e3ad73d3df184f127376f7edb625f8ba493a72ed124d0e0ebdef544aa3e1e2456de1b533885c2e27090eebf1e082cdfdaa1aa81cc63a295515c62b937244874f2db57c99648851eb2ef30e733b50169022b2c484d3265980e65339679c3e580afe884f42d37815ba389f27d65edf34f82e8d4ea547b155e2a59b4652ce6174bf3439a7db6ccae59d8676722fe1fe681157b31f463f54430367b30c5fde248128e2e0ff9cae9a9265f03e328146500897cba615db9130e0bf11879e92451438f4b1234f0c4bd41788f5c77537f861f1fa6f967c86094826bfa9810e15901d79b2b4a389b7d5a81686afe273ff3c1aa8abfd0f3a887517bb7389dc9a193b527ea3d2bcaf3a325e169c98515eec39d7585500fb0bb78b0b47158af8ef2d473c60128dd803b595350c657ee0c05f63cfe87a29c1b237c50c28215cf1198eb0e9c8ea324af149116c495f3a7cdd48e8981c4f0b52c8a7b73be05190aea70a351baebda8b2303e3021300906052b0e03021a05000414ebdae28ba260c663be814fce51243a48c929dbbf04142a99841edf78ce815a90020b44b8d66050bf96aa02030186a0");
                setCertificateFileName("thalassa_cert.p12");
                setCertificatePassword("thalassa");
                setJwtKey("demoSecretForJwtGeneration");
            }};

            constantsDataRepository.save(constantsData);
            setConstantsInner(constantsData);
        }

        setTempDir();
    }

    private void setConstantsInner(ConstantsData constantsData) {
        Constants.CERTIFICATE = constantsData.getCertificate();
        Constants.CERTIFICATE_FILE_NAME = constantsData.getCertificateFileName();
        Constants.CERTIFICATE_PASSWORD = constantsData.getCertificatePassword();
        Constants.JWT_KEY = constantsData.getJwtKey();
    }

    // Configures the service’s temporary directory
    private void setTempDir() throws IOException {
        String tempDirPath = System.getProperty("java.io.tmpdir") + Constants.SERVICE_NAME + "Temp";

        // Delete any previous temporary directory
        if (Files.exists(Paths.get(tempDirPath)))
            deleteTempDir();

        // Create temporary directory
        boolean tempDir = new File(tempDirPath).mkdir();
        if (!tempDir)
            throw new IOException("The temporary directory could not be created.");
        Constants.CERTIFICATE_PATH = tempDirPath + System.getProperty("file.separator") + Constants.CERTIFICATE_FILE_NAME;

        // Copy certificate to temporary directory
        new FileOutputStream(Constants.CERTIFICATE_PATH).write(Hex.decode(Constants.CERTIFICATE));

        String libsodiumFile;
        String arch = null;

        // Set Libsodium library file name
        if (System.getProperty("os.arch").contains("86"))
            arch = "x86";
        else if (System.getProperty("os.arch").contains("64"))
            arch = "x64";
        if (Platform.isMac())
            libsodiumFile = "libsodium.dylib";
        else if (Platform.isWindows())
            libsodiumFile = "libsodium_" + arch + ".dll";
        else
            libsodiumFile = "libsodium_" + arch + ".so";

        // Copy Libsodium library to temporary directory
        File tempFile = new File(System.getProperty("java.io.tmpdir") + Constants.SERVICE_NAME + "Temp", libsodiumFile);
        InputStream in = Thalassa.class.getResource("/libsodium/" + libsodiumFile).openStream();
        Files.copy(in, tempFile.toPath());

        // Set Libsodium library path
        SodiumLibrary.setLibraryPath(tempFile.getAbsolutePath());

        // Delete temporary directory on exit
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                deleteTempDir();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }));
    }

    private void deleteTempDir() throws IOException {
        String tempDirPath = System.getProperty("java.io.tmpdir") + Constants.SERVICE_NAME + "Temp";

        if (Files.exists(Paths.get(tempDirPath))) {
            File folder = new File(tempDirPath);
            File[] files = folder.listFiles();
            if (files != null)
                for (File file : files)
                    if (!file.delete())
                        throw new IOException("The temporary file " + file.getName() + " in the could not be deleted.");
            if (!folder.delete())
                throw new IOException("The temporary folder could not be deleted.");
        }
    }
}