using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Common.LegalEngineering.Clauses.FixedClauses
{
    public class OffHire : Clause
    {
        private new const string Title = "Off-Hire";
        private const string Paragraph1 = "In the event of the $$@loss of time$$ from $$@<deficiency$$ or" +
                                          " $$@<breakdown$$ of $$.systems(breakdown)$$, $$@<fire$$, breakdown or" +
                                          " damages to $$.hull(breakdown)$$, $$.machinery(breakdown)$$ or" +
                                          " $$.equipment(breakdown)$$, $$@<grounding$$, $$@<detention$$ by average" +
                                          " accidents to ship or cargo, $$@<drydocking$$ for the purpose of" +
                                          " examination or painting bottom, $$@<cyber event$$, or by $$@<(~)any" +
                                          " other cause$$ preventing the full working of the vessel, the payment of" +
                                          " $$==hire$$ shall $$=>cease(hire)$$ for the $$time.$$ thereby" +
                                          " $$**lost(hire)$$.";
        private const string Paragraph2 = "“Cyber event” means any act by a third party which affects the vessel’s" +
                                          " on-board computers, computer systems or computer software through or by" +
                                          " the use of code, computer virus, process or any other electronic means" +
                                          " whatsoever, without the consent of the owners.";

        private new static readonly LinkedList<Dictionary<string, dynamic>> Paragraphs = new LinkedList<Dictionary<string, dynamic>>(
            new[] {new Dictionary<string, dynamic> {["number"] = 1, ["legen"] = Paragraph1}, 
                new Dictionary<string, dynamic> {["number"] = 2, ["legen"] = Paragraph2}});

        public OffHire() : base(Title, Paragraphs) {}


        public string EnableClause(IEnumerable<string> context)
        {
            var causes = new List<string>();
            string hireCeaseDays = null;

            // The following process analyzes the context data based on its identifiers
            var causeContexts = context.ToList();
            foreach (var element in causeContexts)
            {
                if (!element.Equals("@loss of time")) continue;
                foreach (var causeContext in causeContexts)
                {
                    if (causeContext.Equals("@<deficiency") || causeContext.Equals("@<breakdown"))
                    {
                        var text = new StringBuilder();
                        text.Append(causeContext.Substring(2)).Append(" of ");
                        var elements = new List<string>();
                        foreach (var causeElement in causeContexts)
                        {
                            if (causeElement.Equals(".systems(breakdown)") ||
                                causeElement.Equals(".machinery(breakdown)") ||
                                causeElement.Equals(".equipment(breakdown)"))
                                elements.Add(causeElement.Substring(1, causeElement.IndexOf("(", StringComparison.Ordinal) - 1));
                        }
                        text = AdjustText(text, elements);
                        causes.Add(text.ToString());
                    }

                    if (causeContext.Equals("@<fire") || causeContext.Equals("@<grounding") ||
                        causeContext.Equals("@<detention") || causeContext.Equals("@<drydocking") ||
                        causeContext.Equals("@<cyber event") || causeContext.Equals("@<(~)any other cause"))
                    {
                        causes.Add(causeContext.Equals("@<(~)any other cause")
                            ? causeContext.Substring(5)
                            : causeContext.Substring(2));
                    }

                    if (causeContext.Substring(0, 2).Equals("@>"))
                        hireCeaseDays = causeContext.Substring(2);
                }
            }

            // The following process assembles the final message to be returned based on the data provided above
            Debug.Assert(hireCeaseDays != null, nameof(hireCeaseDays) + " != null");
            var days = hireCeaseDays.Equals("1") ? "day" : "days";
            var causesText = new StringBuilder();
            causesText = AdjustText(causesText, causes);

            return "Due to " + causesText + ", which resulted in loss of time, the payment of hire ceases for " + hireCeaseDays + " " + days + ".";
        }

        private static StringBuilder AdjustText(StringBuilder text, IReadOnlyList<string> elements)
        {
            text.Append(elements[0]);
            if (elements.Count == 2)
                text.Append(" and ").Append(elements[1]);
            else if (elements.Count > 2)
            {
                text.Append(", ");
                for (var i = 2; i < elements.Count - 1; i++)
                    text.Append(elements[i]).Append(", ");
                var textTemp = text.ToString();
                text = new StringBuilder(textTemp.Substring(0, textTemp.LastIndexOf(",", StringComparison.Ordinal)));
                text.Append(" and ").Append(elements[^1]);
            }

            return text;
        }
    }
}