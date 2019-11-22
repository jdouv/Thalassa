using System.Collections.Generic;
using Thalassa.Models;
using Newtonsoft.Json.Linq;

namespace Thalassa.Business.Services
{
    public interface IVesselService
    {
        Vessel FindByName(string name);
        Vessel FindByImoNumber(string imoNumber);
        void Insert(Vessel vessel);
        JObject Insert(JObject json, string privateKey);
        JObject Update(JObject json);
        List<Vessel> GetVesselsRegistry(string privateKey);
    }
}