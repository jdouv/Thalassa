package Thalassa.Accessories.Services;

import com.muquit.libsodiumjna.SodiumLibrary;
import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.crypto.BufferedBlockCipher;
import org.bouncycastle.crypto.CipherKeyGenerator;
import org.bouncycastle.crypto.KeyGenerationParameters;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.crypto.generators.Ed25519KeyPairGenerator;
import org.bouncycastle.crypto.modes.CBCBlockCipher;
import org.bouncycastle.crypto.paddings.PaddedBufferedBlockCipher;
import org.bouncycastle.crypto.params.Ed25519KeyGenerationParameters;
import org.bouncycastle.crypto.params.Ed25519PrivateKeyParameters;
import org.bouncycastle.crypto.params.Ed25519PublicKeyParameters;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.crypto.Signer;
import org.bouncycastle.crypto.signers.Ed25519Signer;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

// This class utilizes Bouncy Castle’s and Libsodium’s capabilities to generate keys, encrypt-decrypt and sign-verify data.
@Service
public interface CryptographyService {

    // Generates Ed25519 key pair using Bouncy Castle
    static String[] generateKeys() {
        Ed25519KeyPairGenerator keyPairGenerator = new Ed25519KeyPairGenerator();
        keyPairGenerator.init(new Ed25519KeyGenerationParameters(new SecureRandom()));
        AsymmetricCipherKeyPair keyPair = keyPairGenerator.generateKeyPair();
        Ed25519PrivateKeyParameters privateKey = (Ed25519PrivateKeyParameters) keyPair.getPrivate();
        Ed25519PublicKeyParameters publicKey = privateKey.generatePublicKey();

        return new String[] {Hex.toHexString(publicKey.getEncoded()), Hex.toHexString(privateKey.getEncoded())};
    }

    // Gets public key from private key using Bouncy Castle
    static String getPublicKeyFromPrivate(final String privateKey) {
        return Hex.toHexString(new Ed25519PrivateKeyParameters(Hex.decode(privateKey), 0).generatePublicKey().getEncoded());
    }

    // Performs AES encryption with Bouncy Castle and returns the encrypted data along with the secret key
    static String[] encrypt(final String data) throws Exception {
        CipherKeyGenerator keyGenerator = new CipherKeyGenerator();
        keyGenerator.init(new KeyGenerationParameters(new SecureRandom(), 256));
        byte[] secretKey = keyGenerator.generateKey();

        byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
        BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new CBCBlockCipher(new AESEngine()));
        cipher.init(true, new KeyParameter(secretKey));
        byte[] rv = new byte[cipher.getOutputSize(dataBytes.length)];
        int tam = cipher.processBytes(dataBytes, 0, dataBytes.length, rv, 0);
        cipher.doFinal(rv, tam);

        return new String[] {Hex.toHexString(rv), Hex.toHexString(secretKey)};
    }

    // Performs AES decryption with Bouncy Castle using the secret key generated during encryption
    static String decrypt(final String data, final String secretKey) throws Exception {
        byte[] dataBytes = Hex.decode(data);
        BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new CBCBlockCipher(new AESEngine()));
        cipher.init(false, new KeyParameter(Hex.decode(secretKey)));
        byte[] rv = new byte[cipher.getOutputSize(dataBytes.length)];
        int tam = cipher.processBytes(dataBytes, 0, dataBytes.length, rv, 0);
        cipher.doFinal(rv, tam);

        return new String(rv);
    }

    // Encrypts data with receiver’s public key using Libsodium
    static String encryptWithPublicKey(final String data, final String publicKey) throws Exception {
        byte[] publicKeyConverted = SodiumLibrary.cryptoSignEdPkTOcurvePk(Hex.decode(publicKey));
        return Hex.toHexString(SodiumLibrary.cryptoBoxSeal(data.getBytes(), publicKeyConverted));
    }

    // Decrypts data with receiver’s private key using Libsodium
    static String decryptWithPrivateKey(final String data, final String privateKey) throws Exception {
        byte[] privateKeyConverted = SodiumLibrary.cryptoSignEdSkTOcurveSk(Hex.decode(privateKey));
        return new String(SodiumLibrary.cryptoBoxSealOpen(Hex.decode(data), SodiumLibrary.cryptoPublicKey(privateKeyConverted), privateKeyConverted));
    }

    // Sings data with signer’s private key using Bouncy Castle
    static String sign(final String data, final String privateKey) throws Exception {
        Signer signer = new Ed25519Signer();
        signer.init(true, new Ed25519PrivateKeyParameters(Hex.decode(privateKey), 0));
        signer.update(data.getBytes(), 0, data.getBytes().length);

        return Hex.toHexString(signer.generateSignature());
    }

    // Verifies signature with signer’s public key using Bouncy Castle
    static boolean verify(final String signature, final String data, final String publicKey) {
        Signer verifier = new Ed25519Signer();
        verifier.init(false, new Ed25519PublicKeyParameters(Hex.decode(publicKey), 0));
        verifier.update(data.getBytes(), 0, data.getBytes().length);

        return verifier.verifySignature(Hex.decode(signature));
    }
}