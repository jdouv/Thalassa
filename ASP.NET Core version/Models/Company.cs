using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ArangoDB.Client;
using Newtonsoft.Json;

namespace Thalassa.Models
{
    [CollectionProperty(CollectionName = "Companies")]
    public class Company
    {
        [JsonProperty("registryNumber"),
         DocumentProperty(Identifier = IdentifierType.Key),
         Required(ErrorMessage = "errorRequiredRegistryNumber"),
         StringLength(30, ErrorMessage = "errorMaxRegistryNumber")]
        public string RegistryNumber { get; set; }
       
        [JsonProperty("name"),
         DocumentProperty(PropertyName = "name"),
         Required(ErrorMessage = "errorRequiredCompanyName")]
        public string Name { get; set; }
        
        [JsonProperty("type"),
         DocumentProperty(PropertyName = "type"),
         Required(ErrorMessage = "errorRequiredCompanyType")]
        public string Type { get; set; }
        
        [DocumentProperty(PropertyName = "email"),
         Required(ErrorMessage = "errorRequiredEmail"),
         RegularExpression("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
             ErrorMessage = "errorEmailInvalid")]
        public string Email { get; set; }
        
        [JsonProperty("address"),
         DocumentProperty(PropertyName = "address"),
         Required(ErrorMessage = "errorRequiredAddress")]
        public string Address { get; set; }
        
        [JsonProperty(PropertyName = "vessels", NullValueHandling = NullValueHandling.Ignore),
         DocumentProperty(PropertyName = "vessels")]
        public LinkedList<string> Vessels { get; set; }
    }
}