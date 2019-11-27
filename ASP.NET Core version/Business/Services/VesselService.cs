using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Thalassa.Models;
using Thalassa.DataAccess;
using Newtonsoft.Json.Linq;

namespace Thalassa.Business.Services
{
    public class VesselService : IVesselService
    {
        private readonly VesselsDataAccess _vesselsDataAccess;
        private readonly CompaniesDataAccess _companiesDataAccess;
        private readonly UsersDataAccess _usersDataAccess;

        public VesselService(VesselsDataAccess vesselsDataAccess, CompaniesDataAccess companiesDataAccess, UsersDataAccess usersDataAccess)
        {
            _vesselsDataAccess = vesselsDataAccess;
            _companiesDataAccess = companiesDataAccess;
            _usersDataAccess = usersDataAccess;
        }

        public Vessel FindByName(string name)
        {
            return _vesselsDataAccess.FindByName(name);
        }
        
        public Vessel FindByImoNumber(string imoNumber)
        {
            return _vesselsDataAccess.FindByImoNumber(imoNumber);
        }
        
        public List<Vessel> GetVesselsRegistry(string privateKey)
        {
            return _vesselsDataAccess.FindAllByLoggedInUser(CryptographyService.GetPublicKeyFromPrivate(privateKey));
        }
        
        public JObject Insert(JObject json, string privateKey)
        {
            json = Validate(json);
            if (json.ContainsKey("invalidFields")) return json;
            var vessel = json.ToObject<Vessel>();
            vessel.Company = _usersDataAccess.FindByPublicKey(CryptographyService.GetPublicKeyFromPrivate(privateKey)).Company;
            
            try
            {
                _vesselsDataAccess.Insert(vessel);
                var company = _companiesDataAccess.FindByRegistryNumber(vessel.Company);
                var vessels = company.Vessels;
                vessels.AddLast(vessel.Id);
                company.Vessels = vessels;
                _companiesDataAccess.Update(company);
                json["saved"] = true;
                return json;
            }
            catch (Exception e)
            {
                json["saved"] = false;
                json["errorDetails"] = e.Message;
                return json;
            }
        }

        public JObject Update(JObject json)
        {
            var newJson = Validate(json);
            if (newJson.ContainsKey("invalidFields")) return newJson;
            var vessel = json.ToObject<Vessel>();
            
            try
            {
                _vesselsDataAccess.Update(vessel);
                newJson["updated"] = true;
                return newJson;
            }
            catch (Exception e)
            {
                newJson["updated"] = false;
                newJson["errorDetails"] = e.Message;
                return newJson;
            }
        }
        
        public void Insert(Vessel vessel)
        {
            _vesselsDataAccess.Insert(vessel);
        }

        private JObject Validate(JObject oldJson)
        {
            var json = new JObject();

            if (oldJson["underConstruction"].Value<bool>()) return json;
            foreach (var (key, value) in oldJson)
            {
                var validation = ValidateValue(key, value.ToObject<string>());
                if (validation.Count == 0) continue;
                if (!json.ContainsKey("invalidFields"))
                    json["invalidFields"] = new JObject();
                json["invalidFields"][key] = validation[key];
            }

            return json;
        }

        private Dictionary<string, string> ValidateValue(string key, string value)
        {
            var dictionary = new Dictionary<string, string>();
            
            switch (key)
            {
                case "imoNumber":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredVesselImoNumber";
                    else if (!Regex.IsMatch(value, "\\d+"))
                        dictionary[key] = "errorInputNotLetters";
                    else if (value.Length > 100)
                        dictionary[key] = "errorMaxVesselImoNumber";
                    break;
                case "name":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredVesselName";
                    else if (value.Length > 100)
                        dictionary[key] = "errorMaxVesselName";
                    break;
                case "flag":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredVesselFlag";
                    else if (!Regex.IsMatch(value, "\\p{L}+"))
                        dictionary[key] = "errorInputNotLetters";
                    else if (value.Length > 2)
                        dictionary[key] = "errorSizeVesselFlag";
                    break;
                case "yearBuilt":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredVesselYearBuilt";
                    else if (!Regex.IsMatch(value, "\\d+"))
                        dictionary[key] = "errorInputNotLetters";
                    else if (value.Length != 4)
                        dictionary[key] = "errorSizeVesselYearBuilt";
                    break;
                case "dwt":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredVesselDwt";
                    else if (!Regex.IsMatch(value, "\\d+"))
                        dictionary[key] = "errorInputNotLetters";
                    else if (value.Length > 10)
                        dictionary[key] = "errorMaxVesselDwt";
                    break;
                case "id":
                case "company":
                case "underConstruction":
                    break;
                default:
                    throw new ArgumentException("Unexpected json key during validation: " + key + ".");
            }

            return dictionary;
        }
    }
}