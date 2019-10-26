using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using ArangoDB.Client;
using Newtonsoft.Json;

namespace Common
{
    [CollectionProperty(CollectionName = "Blockchain")]
    public class Block
    {
        [DocumentProperty(Identifier = IdentifierType.Key)]
        public string Index { get; set; }
        [DocumentProperty(PropertyName = "Hash")]
        public string Hash { get; set; }
        [DocumentProperty(PropertyName = "Timestamp")]
        public long Timestamp { get; set; }
        [DocumentProperty(PropertyName = "Data")]
        public string Data { get; set; }
        [DocumentProperty(PropertyName = "Previous hash"), JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string PreviousHash { get; set; }

        [JsonConstructor]
        public Block() {}
        
        public Block(string index, string data, string previousHash)
        {
            Index = index;
            Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Data = data;
            PreviousHash = previousHash;
            Hash = CalculateHash();
        }

        public Block(string index, string data)
        {
            Index = index;
            Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Data = data;
            Hash = CalculateHash();
        }

        public string CalculateHash()
        {
            var blockData = Index + Timestamp + Data + PreviousHash;
            var result = new SHA256CryptoServiceProvider().ComputeHash(Encoding.UTF8.GetBytes(blockData));
            var sb = new StringBuilder();
            foreach (var t in result)
                sb.Append(t.ToString("x2"));

            return sb.ToString();
        }
    }
}