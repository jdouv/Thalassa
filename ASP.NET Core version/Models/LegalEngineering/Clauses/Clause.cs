using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace Thalassa.Models.LegalEngineering.Clauses
{
    public class Clause
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("paragraphs")]
        public LinkedList<Dictionary<string, dynamic>> Paragraphs { get; set; }
        
        public Clause(string title, LinkedList<Dictionary<string, dynamic>> paragraphs)
        {
            Title = title;
            Paragraphs = paragraphs;
        }

        // Finds legen syntax in given text
        public List<string> ParagraphAnalysis(string text)
        {
            var list = new List<string>();
            foreach (Match match in new Regex("\\$\\$(.*?)\\$\\$").Matches(text))
                list.Add(match.Groups[1].Value);
            return list;
        }

        // Converts legen paragraph to readable paragraph
        public static string GetParagraphReadable(string paragraph)
        {
            var sb = new StringBuilder(paragraph);
            foreach (Match match in new Regex("\\$\\$(.*?)\\$\\$").Matches(paragraph))
            {
                var toChange = match.Groups[1].Value;
                if (toChange.Substring(0, 1).Equals("@"))
                    toChange = toChange.Substring(1);
                if (toChange.Substring(0, 1).Equals("<"))
                    toChange = toChange.Substring(1);
                if (toChange.Substring(0, 1).Equals("."))
                    toChange = toChange.Substring(1);
                if (toChange.EndsWith("."))
                    toChange = toChange.Substring(0, toChange.Length - 1);
                if (toChange.Substring(0, 2).Equals("=="))
                    toChange = toChange.Substring(2);
                if (toChange.Substring(0, 2).Equals("=>"))
                    toChange = toChange.Substring(2);
                if (toChange.Substring(0, 2).Equals("**"))
                    toChange = toChange.Substring(2);
                if (toChange.Substring(0, 3).Equals("(~)"))
                    toChange = toChange.Substring(3);
                if (toChange.Contains("("))
                    toChange = toChange.Substring(0, toChange.IndexOf("(", StringComparison.Ordinal));
                sb.Replace(match.Value, toChange);
            }

            return sb.ToString();
        }
    }
}