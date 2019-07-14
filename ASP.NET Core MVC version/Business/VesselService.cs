using Common;
using DataAccess;

namespace Business
{
    public class VesselService : IVesselService
    {
        private readonly VesselsDataAccess _vesselsDataAccess;

        public VesselService(VesselsDataAccess vesselsDataAccess)
        {
            _vesselsDataAccess = vesselsDataAccess;
        }

        public void Insert(Vessel vessel)
        {
            _vesselsDataAccess.Insert(vessel);
        }
        
        public Vessel FindByImoNumber(string imoNumber)
        {
            return _vesselsDataAccess.FindByImoNumber(imoNumber);
        }
    }
}