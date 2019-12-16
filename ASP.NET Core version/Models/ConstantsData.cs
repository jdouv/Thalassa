using ArangoDB.Client;

namespace Thalassa.Models
{
    // This class handles essential data (stored in database) needed during service initialization.
    [CollectionProperty(CollectionName = "Constants")]
    public class ConstantsData
    {
        [DocumentProperty(PropertyName = "certificate")]
        public string Certificate { get; set; }
        
        [DocumentProperty(PropertyName = "certificateFileName")]
        public string CertificateFileName { get; set; }
        
        [DocumentProperty(PropertyName = "certificatePassword")]
        public string CertificatePassword { get; set; }
        
        [DocumentProperty(PropertyName = "jwtKey")]
        public string JwtKey { get; set; }
    }
}