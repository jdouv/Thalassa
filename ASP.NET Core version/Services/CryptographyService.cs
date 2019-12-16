using System.Text;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Modes;
using Org.BouncyCastle.Crypto.Paddings;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Crypto.Signers;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Utilities.Encoders;
using Sodium;

namespace Thalassa.Services
{
    // This class utilizes Bouncy Castle’s and Libsodium’s capabilities to generate keys, encrypt-decrypt and sign-verify data.
    public static class CryptographyService
    {
        // Generates Ed25519 key pair using Bouncy Castle
        public static string[] GenerateKeys()
        {
            var keyPairGenerator = new Ed25519KeyPairGenerator();
            keyPairGenerator.Init(new Ed25519KeyGenerationParameters(new SecureRandom()));
            var keyPair = keyPairGenerator.GenerateKeyPair();
            var privateKey = (Ed25519PrivateKeyParameters) keyPair.Private;
            var publicKey = privateKey.GeneratePublicKey();

            return new[] {Hex.ToHexString(publicKey.GetEncoded()), Hex.ToHexString(privateKey.GetEncoded())};
        }

        // Gets public key from private key using Bouncy Castle
        public static string GetPublicKeyFromPrivate(string privateKey)
        {
            return Hex.ToHexString(new Ed25519PrivateKeyParameters(Hex.Decode(privateKey), 0).GeneratePublicKey().GetEncoded());
        }

        // Performs AES encryption with Bouncy Castle and returns the encrypted data along with the secret key
        public static string[] Encrypt(string data)
        {
            var keyGenerator = new CipherKeyGenerator();
            keyGenerator.Init(new KeyGenerationParameters(new SecureRandom(), 256));
            var secretKey = keyGenerator.GenerateKey();

            var dataBytes = Encoding.UTF8.GetBytes(data);
            BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new CbcBlockCipher(new AesEngine()));
            cipher.Init(true, new KeyParameter(secretKey));
            var rv = new byte[cipher.GetOutputSize(dataBytes.Length)];
            var tam = cipher.ProcessBytes(dataBytes, 0, dataBytes.Length, rv, 0);
            cipher.DoFinal(rv, tam);

            return new[] {Hex.ToHexString(rv), Hex.ToHexString(secretKey)};
        }

        // Performs AES decryption with Bouncy Castle using the secret key generated during encryption
        public static string Decrypt(string data, string secretKey)
        {
            var dataBytes = Hex.Decode(data);
            BufferedBlockCipher cipher = new PaddedBufferedBlockCipher(new CbcBlockCipher(new AesEngine()));
            cipher.Init(false, new KeyParameter(Hex.Decode(secretKey)));
            var rv = new byte[cipher.GetOutputSize(dataBytes.Length)];
            var tam = cipher.ProcessBytes(dataBytes, 0, dataBytes.Length, rv, 0);
            cipher.DoFinal(rv, tam);

            return Encoding.UTF8.GetString(rv);
        }

        // Encrypts data with receiver’s public key using Libsodium
        public static string EncryptWithPublicKey(string data, string publicKey)
        {
            var publicKeyConverted = PublicKeyAuth.ConvertEd25519PublicKeyToCurve25519PublicKey(Hex.Decode(publicKey));
            return Hex.ToHexString(SealedPublicKeyBox.Create(Encoding.UTF8.GetBytes(data), publicKeyConverted));
        }

        // Decrypts data with receiver’s private key using Libsodium
        public static string DecryptWithPrivateKey(string data, string privateKey)
        {
            var privateKeyConverted = PublicKeyAuth.ConvertEd25519SecretKeyToCurve25519SecretKey(Hex.Decode(privateKey));
            var publicKey = Hex.Decode(GetPublicKeyFromPrivate(privateKey));
            var publicKeyConverted = PublicKeyAuth.ConvertEd25519PublicKeyToCurve25519PublicKey(publicKey);
            return Encoding.UTF8.GetString(SealedPublicKeyBox.Open(Hex.Decode(data), privateKeyConverted, publicKeyConverted));
        }

        // Sings data with signer’s private key using Bouncy Castle
        public static string Sign(string data, string privateKey)
        {
            var signer = new Ed25519Signer();
            signer.Init(true, new Ed25519PrivateKeyParameters(Hex.Decode(privateKey), 0));
            signer.BlockUpdate(Encoding.UTF8.GetBytes(data), 0, Encoding.UTF8.GetBytes(data).Length);

            return Hex.ToHexString(signer.GenerateSignature());
        }

        // Verifies signature with signer’s public key using Bouncy Castle
        public static bool Verify(string data, string signature, string publicKey)
        {
            var verifier = new Ed25519Signer();
            verifier.Init(false, new Ed25519PublicKeyParameters(Hex.Decode(publicKey), 0));
            verifier.BlockUpdate(Encoding.UTF8.GetBytes(data), 0, Encoding.UTF8.GetBytes(data).Length);

            return verifier.VerifySignature(Hex.Decode(signature));
        }
    }
}