using Common;

namespace Business
{
    public interface IVesselService
    {
        void Insert(Vessel vessel);
        Vessel FindByImoNumber(string imoNumber);
    }
}