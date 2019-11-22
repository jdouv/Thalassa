using System;
using System.Collections.Generic;
using Thalassa.Models;
using System.Linq;

namespace Thalassa.DataAccess
{
    public class VesselsDataAccess : DbSetup
    {
        public void Insert(Vessel vessel)
        {
            Db.Insert<Vessel>(vessel);
        }

        public void Update(Vessel vessel)
        {
            Db.UpdateById<Vessel>(vessel.Id, vessel);
        }
        
        public Vessel FindByName(string name)
        {
            return Db.Query<Vessel>().FirstOrDefault(vessel => vessel.Name == name);
        }
        
        public Vessel FindByImoNumber(string imoNumber)
        {
            return Db.Query<Vessel>().FirstOrDefault(vessel => vessel.ImoNumber == imoNumber);
        }
        
        public List<Vessel> FindAllByLoggedInUser(string publicKey)
        {
            return Db.CreateStatement<Vessel>("FOR user IN Users FILTER user._key == '" + publicKey + "' FOR company in Companies FILTER company._key == user.company FOR vessels in Vessels FILTER vessels._key IN company.vessels RETURN vessels").ToList();
        }
    }
}