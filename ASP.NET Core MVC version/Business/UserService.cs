using System.Collections.Generic;
using Common;
using DataAccess;

namespace Business
{
    public class UserService : IUserService
    {
        private readonly UsersDataAccess _usersDataAccess;

        public UserService(UsersDataAccess usersDataAccess)
        {
            _usersDataAccess = usersDataAccess;
        }

        public void Insert(User user) {
            user.PrivateKey = null; // since Thalassa lies on blockchain, private keys must not be stored
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
    }
}