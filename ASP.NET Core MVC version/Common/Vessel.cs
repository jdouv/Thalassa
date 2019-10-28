using System.ComponentModel.DataAnnotations;
using ArangoDB.Client;
using Newtonsoft.Json;
using Thalassa.App_GlobalResources;

namespace Common
{
    [CollectionProperty(CollectionName = "Vessels")]
    public class Vessel
    {
        [JsonProperty("imoNumber"),
         DocumentProperty(Identifier = IdentifierType.Key),
         Required(ErrorMessageResourceName = "Error_RequiredVesselImoNumber", ErrorMessageResourceType = typeof(Messages)),
         StringLength(10, ErrorMessageResourceName = "Error_MaxVesselImoNumber", ErrorMessageResourceType = typeof(Messages))]
        public string ImoNumber { get; set; }
        [JsonProperty("name"),
         DocumentProperty(PropertyName = "Name"),
         Display(Name = "Vessels_Name", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredVesselName", ErrorMessageResourceType = typeof(Messages)),
         StringLength(30, ErrorMessageResourceName = "Error_MaxVesselName", ErrorMessageResourceType = typeof(Messages))]
        public string Name { get; set; }
        [JsonProperty("flag"),
         DocumentProperty(PropertyName = "Flag"),
         Display(Name = "Vessels_Flag", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredVesselFlag", ErrorMessageResourceType = typeof(Messages)),
         StringLength(2, ErrorMessageResourceName = "Error_SizeVesselFlag", ErrorMessageResourceType = typeof(Messages), MinimumLength = 2)]
        public string Flag { get; set; }
        [JsonProperty("yearBuilt"),
         DocumentProperty(PropertyName = "Year built"),
         Display(Name = "Vessels_YearBuilt", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredVesselYearBuilt", ErrorMessageResourceType = typeof(Messages)),
         StringLength(4, ErrorMessageResourceName = "Error_SizeVesselYearBuilt", ErrorMessageResourceType = typeof(Messages), MinimumLength = 4)]
        public string YearBuilt { get; set; }
        [JsonProperty("dwt"),
         DocumentProperty(PropertyName = "DWT"),
         Display(Name = "Vessels_Dwt", ResourceType = typeof(Messages)),
         Required(ErrorMessageResourceName = "Error_RequiredVesselDwt", ErrorMessageResourceType = typeof(Messages)),
         StringLength(10, ErrorMessageResourceName = "Error_MaxVesselDwt", ErrorMessageResourceType = typeof(Messages))]
        public string Dwt { get; set; }

        public Vessel(string imoNumber, string name, string flag, string yearBuilt, string dwt)
        {
            ImoNumber = imoNumber;
            Name = name;
            Flag = flag;
            YearBuilt = yearBuilt;
            Dwt = dwt;
        }
    }
}