using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;
using Thalassa.Models;
using Thalassa.DataAccess;
using Newtonsoft.Json.Linq;

namespace Thalassa.Services
{
    public class UserService : IUserService
    {
        private readonly UsersDataAccess _usersDataAccess;

        public UserService(UsersDataAccess usersDataAccess)
        {
            _usersDataAccess = usersDataAccess;
        }

        public bool ValidateRegister(JObject json)
        {
            return (!Validate(json).ContainsKey("invalidFields"));
        }

        private static string GenerateToken(User user)
        {
            if (user == null) return null;
            
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateJwtSecurityToken(
                "https://localhost:5001",
                "https://localhost:5001",
                new ClaimsIdentity(new[]
                {
                    new Claim("sub", user.PublicKey),
                    new Claim("jti", Guid.NewGuid().ToString()),
                    new Claim("firstName", user.FirstName),
                    new Claim("position", user.Position)
                }),
                DateTime.UtcNow,
                DateTime.UtcNow.AddDays(1),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.Default.GetBytes(Constants.JwtKey)),
                    SecurityAlgorithms.HmacSha512)
            );

            return tokenHandler.WriteToken(token);
        } 
        
        public JObject Register(JObject json)
        {
            var user = json["fields"].ToObject<User>();
            json = Validate(json);
            if (json.ContainsKey("invalidFields")) return json;
            
            user.PublicKey = CryptographyService.GetPublicKeyFromPrivate(user.PrivateKey);
            user.PrivateKey = null; // since the service lies on blockchain, private keys must not be stored
            user.Enabled = true;
            user.CorrespondingIndices = new Dictionary<string, string>();
            // For now, the newly created user is considered to belong to the demo company created during initialization.
            if (user.Position.Equals("companyVesselsRegistryManager"))
                user.Company = "1234567890";
            
            _usersDataAccess.Insert(user);
            json["saved"] = _usersDataAccess.FindByPublicKey(user.PublicKey) != null;
            if (!json["saved"].ToObject<bool>()) return json;

            json["token"] = GenerateToken(user);
            json["view"] = new StreamReader("Resources/Views/" + user.Position + ".js").ReadToEnd();
            return json;
        }

        public JObject Login(JObject json)
        {
            var privateKey = json["fields"]["privateKey"].Value<string>();
            json = Validate(json);
            if (json.ContainsKey("invalidFields")) return json;
            var publicKey = CryptographyService.GetPublicKeyFromPrivate(privateKey);
            var user = _usersDataAccess.FindByPublicKey(publicKey);

            if (user != null)
            {
                json["token"] = GenerateToken(user);
                json["view"] = new StreamReader("Resources/Views/" + user.Position + ".js").ReadToEnd();
                return json;
            }
            
            json["noUser"] = "noSuchCredentials";
            return json;
        }

        public void Insert(User user)
        {
            user.PrivateKey = null; // since the service lies on blockchain, private keys must not be stored
            user.Enabled = true;
            user.CorrespondingIndices = new Dictionary<string, string>();
            _usersDataAccess.Insert(user);
        }
        
        public User FindByPublicKey(string publicKey) {
            return _usersDataAccess.FindByPublicKey(publicKey);
        }

        public User FindByPosition(string position)
        {
            return _usersDataAccess.FindByPosition(position);
        }

        public User FindByEmail(string email) {
            return _usersDataAccess.FindByEmail(email);
        }

        public void Update(User user)
        {
            _usersDataAccess.Update(user);
        }

        private JObject Validate(JObject oldJson)
        {
            var json = new JObject();

            foreach (var (key, value) in (JObject) oldJson["fields"])
            {
                var validation = ValidateValue(oldJson["type"].Value<string>(), key, value.ToObject<string>());
                if (validation.Count == 0) continue;
                if (!json.ContainsKey("invalidFields"))
                    json["invalidFields"] = new JObject();
                json["invalidFields"][key] = validation[key];
            }

            return json;
        }

        private Dictionary<string, string> ValidateValue(string type, string key, string value)
        {
            var dictionary = new Dictionary<string, string>();
            
            if (key.Equals("privateKey"))
            {
                if (value.Length > 0)
                {
                    if (!Regex.IsMatch(value, "^[0-9a-fA-F]+$") && value.Length % 2 != 0)
                        dictionary[key] = "errorPrivateKeyInvalid";
                }
                else
                    dictionary[key] = "errorRequiredPrivateKey";
            }

            if (!type.Equals("register")) return dictionary;

            switch (key)
            {
                case "firstName":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredFirstName";
                    else if (!Regex.IsMatch(value, "\\p{L}+"))
                        dictionary[key] = "errorInputNotLetters";
                    else if (value.Length > 100)
                        dictionary[key] = "errorMaxFirstName";
                    break;
                case "lastName":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredLastName";
                    else if (!Regex.IsMatch(value, "\\p{L}+"))
                        dictionary[key] = "errorInputNotLetters";
                    else if (value.Length > 100)
                        dictionary[key] = "errorMaxLastName";
                    break;
                case "email":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredEmail";
                    else if (!Regex.IsMatch(value, "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"))
                        dictionary[key] = "errorEmailInvalid";
                    else if (_usersDataAccess.FindByEmail(value) != null)
                        dictionary[key] = "errorEmailAlreadyInUse";
                    break;
                case "position":
                    if (value.Length < 1)
                        dictionary[key] = "errorRequiredPosition";
                    else if (!Regex.IsMatch(value, "\\p{L}+"))
                        dictionary[key] = "errorInputNotLetters";
                    break;
                case "privateKey":
                    break;
                default:
                    throw new ArgumentException("Unexpected json key during validation: " + key + ".");
            }

            return dictionary;
        }
    }
}