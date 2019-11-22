using ArangoDB.Client;
using Newtonsoft.Json;

namespace Thalassa.Models
{
    [CollectionProperty(CollectionName = "Vessels")]
    public class Vessel
    {
        [JsonProperty(PropertyName = "id", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(Identifier = IdentifierType.Key)]
        public string Id { get; set; }
        
        [JsonProperty(PropertyName = "imoNumber", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(PropertyName = "imoNumber")]
        public string ImoNumber { get; set; }
       
        [JsonProperty(PropertyName = "name", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(PropertyName = "name")]
        public string Name { get; set; }
        
        [JsonProperty(PropertyName = "flag", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(PropertyName = "flag")]
        public string Flag { get; set; }
       
        [JsonProperty(PropertyName = "company", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(PropertyName = "company")]
        public string Company { get; set; }
        
        [JsonProperty(PropertyName = "yearBuilt", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(PropertyName = "yearBuilt")]
        public string YearBuilt { get; set; }
       
        [JsonProperty(PropertyName = "dwt", NullValueHandling = NullValueHandling.Ignore),
        DocumentProperty(PropertyName = "dwt")]
        public string Dwt { get; set; }
        
        [JsonProperty(PropertyName = "underConstruction", NullValueHandling = NullValueHandling.Ignore),
         DocumentProperty(PropertyName = "underConstruction")]
        public bool UnderConstruction { get; set; }
    }
}