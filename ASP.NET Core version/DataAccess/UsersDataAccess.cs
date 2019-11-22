using Thalassa.Models;
using System.Linq;

namespace Thalassa.DataAccess
{
    public class UsersDataAccess : DbSetup
    {
        public void Insert(User user)
        {
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