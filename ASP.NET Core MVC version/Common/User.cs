using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ArangoDB.Client;
using Newtonsoft.Json;
using Thalassa.App_GlobalResources;

namespace Common
{
    [CollectionProperty(CollectionName = "Users")]
    public class User
    {
        [DocumentProperty(Identifier = IdentifierType.Key)] public string PublicKey { get; set; }
        
        [DocumentProperty(PropertyName = "First name"),
         Display(Name = "Users_FirstName", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredFirstName", ErrorMessageResourceType = typeof(Messages)),
         StringLength(30, ErrorMessageResourceName = "Error_MaxFirstName", ErrorMessageResourceType = typeof(Messages))]
        public string FirstName { get; set; }
        
        [DocumentProperty(PropertyName = "Last name"),
         Display(Name = "Users_LastName", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredLastName", ErrorMessageResourceType = typeof(Messages)),
         StringLength(30, ErrorMessageResourceName = "Error_MaxLastName", ErrorMessageResourceType = typeof(Messages))]
        public string LastName { get; set; }
        
        [DocumentProperty(PropertyName = "E-mail"),
         Display(Name = "Users_Email", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredEmail", ErrorMessageResourceType = typeof(Messages)),
         RegularExpression("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
             ErrorMessageResourceName = "Error_EmailInvalid", ErrorMessageResourceType = typeof(Messages))]
        public string Email { get; set; }
        
        [DocumentProperty(PropertyName = "Position"),
         Display(Name = "Users_Position", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredPosition", ErrorMessageResourceType = typeof(Messages))]
        public string Position { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore),
         Display(Name = "Users_PrivateKey", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredPrivateKey", ErrorMessageResourceType = typeof(Messages))]
        public string PrivateKey { get; set; }
        
        [DocumentProperty(PropertyName = "Corresponding indices")]
        public Dictionary<string, string> CorrespondingIndices { get; set; }
        
        [DocumentProperty(PropertyName = "Enabled")]
        public bool Enabled { get; set; }
    }
}