using Thalassa.Models;
using Newtonsoft.Json.Linq;

namespace Thalassa.Business.Services
{
    public interface IUserService
    {
        string GenerateToken(User user);
        User FindByEmail(string email);
        User FindByPublicKey(string publicKey);
        User FindByPosition(string position);
        bool ValidateRegister(JObject json);
        JObject Register(JObject json);
        JObject Login(JObject json);
        void Insert(User user);
        void Update(User user);
    }
}