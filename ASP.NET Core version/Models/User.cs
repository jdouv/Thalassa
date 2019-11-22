using System.Collections.Generic;
using ArangoDB.Client;
using Newtonsoft.Json;

namespace Thalassa.Models
{
    [CollectionProperty(CollectionName = "Users")]
    public class User
    {
        [JsonProperty(PropertyName = "publicKey"), DocumentProperty(Identifier = IdentifierType.Key)]
        public string PublicKey { get; set; }
        
        [JsonProperty(PropertyName = "firstName"), DocumentProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }
        
        [JsonProperty(PropertyName = "lastName"), DocumentProperty(PropertyName = "lastName")]
        public string LastName { get; set; }
        
        [JsonProperty(PropertyName = "email"), DocumentProperty(PropertyName = "email")]
        public string Email { get; set; }
        
        [JsonProperty(PropertyName = "position"), DocumentProperty(PropertyName = "position")]
        public string Position { get; set; }
        
        [JsonProperty(PropertyName = "company", NullValueHandling = NullValueHandling.Ignore),
         DocumentProperty(PropertyName = "company")]
        public string Company { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string PrivateKey { get; set; }
        
        [JsonProperty(PropertyName = "correspondingIndices"), DocumentProperty(PropertyName = "correspondingIndices")]
        public Dictionary<string, string> CorrespondingIndices { get; set; }
        
        [JsonProperty(PropertyName = "enabled"), DocumentProperty(PropertyName = "enabled")]
        public bool Enabled { get; set; }
    }
}