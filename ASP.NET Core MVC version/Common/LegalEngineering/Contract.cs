using System.Collections.Generic;
using Common.LegalEngineering.Clauses;
using Newtonsoft.Json;

namespace Common.LegalEngineering
{
    public class Contract
    {
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("essentials")]
        public Dictionary<string, dynamic> Essentials { get; set; }
        [JsonProperty("clauses")]
        public LinkedList<Clause> Clauses { get; set; }

        public Contract(string type, string title, Dictionary<string, object> essentials, LinkedList<Clause> clauses)
        {
            Type = type;
            Title = title;
            Essentials = essentials;
            Clauses = clauses;
        }
    }
}