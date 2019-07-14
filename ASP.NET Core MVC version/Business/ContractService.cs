using System;
using System.Collections.Generic;
using Common;
using Common.LegalEngineering;
using Common.LegalEngineering.Clauses;
using Common.LegalEngineering.Clauses.FixedClauses;
using DataAccess;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Business
{
    public class ContractService : IContractService
    {
        private readonly UsersDataAccess _usersDataAccess;
        private readonly BlockchainDataAccess _blockchainDataAccess;
        private readonly VesselsDataAccess _vesselsDataAccess;

        public ContractService(UsersDataAccess usersDataAccess, BlockchainDataAccess blockchainDataAccess, VesselsDataAccess vesselsDataAccess)
        {
            _usersDataAccess = usersDataAccess;
            _blockchainDataAccess = blockchainDataAccess;
            _vesselsDataAccess = vesselsDataAccess;
        }
        
        // Creates, encrypts and saves a new contract in the database as block
        // Currently not used - implementation pending
        public void ConcludeContract(Contract contract)
        {
            // Parse contract into json string
            var jsonToString = JsonConvert.SerializeObject(contract);

            // Encrypt string
            var encryptedData = CryptographyService.Encrypt(jsonToString);
            var encryptedContract = encryptedData[0];
            var secretKey = encryptedData[1];

            // Save block in the database
            var lastBlock = _blockchainDataAccess.FindLast();
            var lastBlockIndex = lastBlock.Index;
            var lastBlockHash = lastBlock.Hash;
            var newBlockIndex = (Convert.ToInt64(lastBlockIndex) + 1).ToString();
            _blockchainDataAccess.Insert(new Block(newBlockIndex, encryptedContract, lastBlockHash));

            // Encrypt and send the secret key to all users included in the contract
            var signatures = (List<dynamic>) contract.Essentials["signatures"];
            foreach (var hashMap in signatures)
            {
                var signature = (Dictionary<string, dynamic>) hashMap;
                foreach (var (key, value) in signature)
                {
                    if (!key.Equals("signer") && !key.Equals("onBehalfOf")) continue;
                    var encryptedSecret = CryptographyService.EncryptWithPublicKey(secretKey, (string) value);
                    var userToBeUpdated = _usersDataAccess.FindByPublicKey((string) value);
                    var userCorrespondingIndices = userToBeUpdated.CorrespondingIndices;
                    userCorrespondingIndices[newBlockIndex] = encryptedSecret;
                    _usersDataAccess.Update(userToBeUpdated);
                }
            }
        }

        // Returns logged in user’s already concluded contracts
        public List<Dictionary<string, dynamic>> GetUserContracts(string privateKey)
        {
            var user = _usersDataAccess.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(privateKey));
            var userCorrespondingIndices = user.CorrespondingIndices;
            var contracts = new List<Dictionary<string, dynamic>>();

            // Find all indices that correspond to this user
            foreach (var (index, encryptedSecretKey) in userCorrespondingIndices)
            {
                var block = _blockchainDataAccess.FindByIndex(index);
                var decryptedSecretKey = CryptographyService.DecryptWithPrivateKey(encryptedSecretKey, privateKey);
                var decryptedData = CryptographyService.Decrypt(block.Data, decryptedSecretKey);

                // If decrypted data is a contract indeed
                var dataToString = JObject.Parse(decryptedData);
                if (!dataToString.ContainsKey("type") || !dataToString["type"].Value<string>().Equals("Contract")) continue;
                var contract = new Dictionary<string, dynamic>
                {
                    ["title"] = dataToString["title"].Value<string>(),
                    ["index"] = block.Index,
                    ["hash"] = block.Hash,
                    ["timestamp"] = block.GetDatetimeFromTimestamp()
                };
                // Add contract to contracts list
                contracts.Add(contract);
            }
            return contracts;
        }
        
        // Returns a contract by its block index and validates its signatures
        public Dictionary<string, dynamic> GetContract(string index, string privateKey)
        {
            var user = _usersDataAccess.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(privateKey));
            var encryptedSecretKey = user.CorrespondingIndices[index];
            var block = _blockchainDataAccess.FindByIndex(index);
            var composedContract = new Dictionary<string, dynamic>
            {
                ["index"] = block.Index, ["hash"] = block.Hash, ["timestamp"] = block.GetDatetimeFromTimestamp()
            };

            var decryptedSecretKey = CryptographyService.DecryptWithPrivateKey(encryptedSecretKey, privateKey);
            var dataToString = JObject.Parse(CryptographyService.Decrypt(block.Data, decryptedSecretKey));

            // If decrypted data is a contract indeed
            if (!dataToString.ContainsKey("type") || !dataToString["type"].Value<string>().Equals("Contract"))
                return null;

            var contractNoSignatures = JObject.Parse(CryptographyService.Decrypt(block.Data, decryptedSecretKey));
            // Delete all signatures, since the signature will be validated on a “clean” contract
            ((JObject)contractNoSignatures["essentials"]).Property("signatures").Remove();
            
            if (dataToString["essentials"]["type"].Value<string>().Equals("timeCharter"))
                dataToString["essentials"]["vessel"] =
                    JToken.FromObject(_vesselsDataAccess.FindByImoNumber(dataToString["essentials"]["vessel"].Value<string>()));

            foreach (var signature in dataToString["essentials"]["signatures"])
            {
                foreach (var (key, value) in ((JObject) signature).ToObject<Dictionary<string, dynamic>>())
                    if (key.Equals("signer") || key.Equals("onBehalfOf"))
                        signature[key] = JToken.FromObject(_usersDataAccess.FindByPublicKey(value));
                var signatureToValidate = signature["signature"].Value<string>();
                var publicKey = signature["signer"]["PublicKey"].Value<string>();
                signature["valid"] =
                    CryptographyService.Verify(contractNoSignatures.ToString(Formatting.None), signatureToValidate, publicKey);
            }
            
            // Convert each paragraph to readable format and add it to the contract
            foreach (var clause in dataToString["clauses"])
            foreach (var paragraph in clause["paragraphs"])
                    paragraph["readable"] = Clause.GetParagraphReadable(paragraph.ToObject<Dictionary<string, dynamic>>()["legen"]);

            composedContract["contract"] = dataToString;
            return composedContract;
        }
        
        // Tests demo contract’s off-hire clause
        public string TestEnableOffHireClause()
        {
            var random = new Random();

            var causes = new List<string>
            {
                ".systems(breakdown)",
                ".machinery(breakdown)",
                ".equipment(breakdown)",
                "@<grounding",
                "@<detention",
                "@<drydocking",
                "@<cyber event"
            };

            // Set a random number of days (loss of time)
            var first = random.Next(10) + 1;
            while (first == 0)
                first = random.Next(10) + 1;
            var context = new List<string> {"@loss of time", "@>" + first};

            // Get random items from causes list
            var second = random.Next(6) + 1;
            while (second == 0)
                second = random.Next(6) + 1;
            for (var i = 0; i <= second; i++)
            {
                var randomInt = random.Next(causes.Count);
                var value = causes[randomInt];
                while (context.Contains(value))
                {
                    randomInt = random.Next(causes.Count);
                    value = causes[randomInt];
                }
                context.Add(causes[randomInt]);
            }
            for (var i = 0; i < context.Count - 1; i++)
            {
                if (!context[i].Contains("breakdown")) continue;
                context.Add("@<breakdown");
                break;
            }

            return new OffHire().EnableClause(context);
        }
    }
}