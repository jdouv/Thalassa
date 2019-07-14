using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using ArangoDB.Client;
using ArangoDB.Client.Data;

namespace DataAccess
{
    public abstract class DbSetup
    {
        protected readonly IArangoDatabase Db;

        private static NetworkCredential GetCredential()
        {
            return new NetworkCredential("root", "");
        }

        private static readonly Lazy<DatabaseSharedSetting> SharedSetting = new Lazy<DatabaseSharedSetting>(() =>
        {
            var sharedSetting = new DatabaseSharedSetting {Database = "Thalassa", Url = "http://localhost.:8529"};
            var credential = GetCredential();
            sharedSetting.SystemDatabaseCredential = new NetworkCredential(credential.UserName, credential.Password);
            sharedSetting.Credential = new NetworkCredential(credential.UserName, credential.Password);

            using (var db = new ArangoDatabase(sharedSetting))
            {
                if (!db.ListDatabases().Contains(sharedSetting.Database))
                    db.CreateDatabase(sharedSetting.Database, new List<DatabaseUser>
                    {
                        new DatabaseUser
                        {
                            Username = credential.UserName,
                            Passwd = credential.Password
                        }
                    });

                var collections = db.ListCollections().Select(c => c.Name).ToArray();
                var collectionsToCreate = new[] {
                    new Tuple<string, CollectionType>("Users", CollectionType.Document),
                    new Tuple<string, CollectionType>("Blockchain", CollectionType.Document),
                    new Tuple<string, CollectionType>("Vessels", CollectionType.Document)
                };

                foreach (var (item1, item2) in collectionsToCreate)
                    if (collections.Contains(item1) == false)
                        db.CreateCollection(item1, type: item2);
            }

            return sharedSetting;
        });

        protected DbSetup()
        {
            var sharedSetting = SharedSetting.Value;
            Db = new ArangoDatabase(sharedSetting);
        }
    }
}