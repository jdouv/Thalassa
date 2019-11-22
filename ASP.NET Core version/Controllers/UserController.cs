using System.IO;
using System.Text;
using Thalassa.Business.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Thalassa.Controllers
{
    [ApiController, Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Checks if the e-mail provided by the user during registration already exists and returns boolean
        [HttpPost("EmailExists")]
        public bool EmailExists()
        {
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            return _userService.FindByEmail(reader.ReadToEnd()) != null;
        }

        // Generates user’s public and private keys
        [HttpPost("GenerateKeys")]
        public JObject GenerateKeys()
        {
            string[] keys;
            // Generate keys and check if public key is already used
            do keys = CryptographyService.GenerateKeys();
            while (_userService.FindByPublicKey(keys[0]) != null);

            return new JObject {["publicKey"] = keys[0], ["privateKey"] = keys[1]};
        }

        // Validates registration form before final registration
        [HttpPost("RegisterIsValid")]
        public bool RegisterIsValid([FromBody] JObject json)
        {
            return _userService.ValidateRegister(json);
        }
        
        [HttpPost("Register")]
        public object Register([FromBody] JObject json)
        {
            var result = _userService.Register(json);
            if (!(result is string s)) return result;
            
            HttpContext.Session.SetString("loggedInPrivateKey", json["fields"]["privateKey"].Value<string>());
            HttpContext.Session.SetString("JWToken", s);

            return result;
        }

        [HttpPost("Login")]
        public object Login([FromBody] JObject json)
        {
            var result = _userService.Login(json);
            if (!(result is string resultString)) return result;
            
            HttpContext.Session.SetString("loggedInPrivateKey", json["fields"]["privateKey"].Value<string>());
            HttpContext.Session.SetString("JWToken", resultString);

            return result;
        }

        // Returns localized messages
        [HttpGet("Localization")]
        public JObject Localization()
        {
            return JObject.Parse(new StreamReader("locales.json").ReadToEnd());
        }
        
        [Route("Logout")]
        public void Logout()
        {
            foreach (var cookie in Request.Cookies.Keys)
                Response.Cookies.Delete(cookie);
            HttpContext.Session.Clear();
        }
    }
}