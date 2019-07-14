using System.Linq;
using Common;

namespace DataAccess
{
    public class UsersDataAccess : DbSetup
    {
        public void Insert(User user)
        {
            user.PrivateKey = null; // since Thalassa lies on blockchain, private keys must not be stored
            Db.Insert<User>(user);
        }
        
        public User FindByPublicKey(string publicKey)
        {
            return Db.Document<User>(publicKey);
        }
        
        public User FindByPosition(string position)
        {
            return Db.Query<User>().FirstOrDefault(user => user.Position == position);
        }
        
        public User FindByEmail(string email)
        {
            return Db.Query<User>().FirstOrDefault(user => user.Email == email);
        }

        public void Update(User user)
        {
            Db.Update<User>(user);
        }
    }
}