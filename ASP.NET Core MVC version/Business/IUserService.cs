using Common;

namespace Business
{
    public interface IUserService
    {
        User FindByEmail(string email);
        User FindByPublicKey(string publicKey);
        User FindByPosition(string position);
        void Insert(User user);
        void Update(User user);
    }
}