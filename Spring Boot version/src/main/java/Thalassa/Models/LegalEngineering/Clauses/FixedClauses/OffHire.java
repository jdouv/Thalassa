package Thalassa.Models.LegalEngineering.Clauses.FixedClauses;

import Thalassa.Models.LegalEngineering.Clauses.Clause;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class OffHire extends Clause {

    private static final String title = "Off-Hire",
            paragraph1 = "In the event of the $$@loss of time$$ from $$@<deficiency$$ or $$@<breakdown$$ of" +
                    " $$.systems(breakdown)$$, $$@<fire$$, breakdown or damages to $$.hull(breakdown)$$,"+
                    " $$.machinery(breakdown)$$ or $$.equipment(breakdown)$$, $$@<grounding$$, $$@<detention$$"+
                    " by average accidents to ship or cargo, $$@<drydocking$$ for the purpose of examination or" +
                    " painting bottom, $$@<cyber event$$, or by $$@<(~)any other cause$$ preventing the full working" +
                    " of the vessel, the payment of $$==hire$$ shall $$=>cease(hire)$$ for the $$time.$$ thereby" +
                    " $$**lost(time)$$.",
            paragraph2 = "“Cyber event” means any act by a third party which affects the vessel’s on-board computers," +
                    " computer systems or computer software through or by the use of code, computer virus, process or" +
                    " any other electronic means whatsoever, without the consent of the owners.";

    public OffHire() {
        super(title, new LinkedList<>(Arrays.asList(new HashMap<>() {{
            put("number", 1);
            put("legen", paragraph1);
        }}, new HashMap<>() {{
            put("number", 2);
            put("legen", paragraph2);
        }})));
    }

    public String enableClause(List<String> context) {
        List<String> causes = new ArrayList<>();
        String hireCeaseDays = null;

        // The following process analyzes the context data based on its identifiers
        for (String element : context) {
            if (element.equals("@loss of time")) {
                for (String causeContext : context) {
                    if (causeContext.equals("@<deficiency") || causeContext.equals("@<breakdown")) {
                        StringBuilder text = new StringBuilder();
                        text.append(causeContext.substring(2)).append(" of ");
                        List<String> elements = new ArrayList<>();
                        for (String causeElement : context) {
                            if (causeElement.equals(".systems(breakdown)") || causeElement.equals(".machinery(breakdown)") ||
                                    causeElement.equals(".equipment(breakdown)"))
                                elements.add(causeElement.substring(1, causeElement.indexOf("(")));
                        }
                        text = adjustText(text, elements);
                        causes.add(text.toString());
                    }
                    if (causeContext.equals("@<fire") || causeContext.equals("@<grounding") ||
                            causeContext.equals("@<detention") || causeContext.equals("@<drydocking") ||
                            causeContext.equals("@<cyber event") || causeContext.equals("@<(~)any other cause")) {
                        if (causeContext.equals("@<(~)any other cause"))
                            causes.add(causeContext.substring(5));
                        else
                            causes.add(causeContext.substring(2));
                    }
                    if (causeContext.substring(0, 2).equals("@>"))
                        hireCeaseDays = causeContext.substring(2);
                }
            }
        }

        // The following process assembles the final message to be returned based on the data provided above
        String days = Objects.requireNonNull(hireCeaseDays).equals("1") ? "day" : "days";
        StringBuilder causesText = new StringBuilder();
        causesText = adjustText(causesText, causes);

        return "Due to " + causesText + ", which resulted in loss of time, the payment of hire ceases for " + hireCeaseDays + " " + days + ".";
    }

    private StringBuilder adjustText(StringBuilder text, List<String> elements) {
        text.append(elements.get(0));
        if (elements.size() == 2)
            text.append(" and ").append(elements.get(1));
        else if (elements.size() > 2) {
            text.append(", ");
            for (int i = 2; i < elements.size() - 1; i++)
                text.append(elements.get(i)).append(", ");
            String textTemp = text.toString();
            text = new StringBuilder(textTemp.substring(0, textTemp.lastIndexOf(",")));
            text.append(" and ").append(elements.get(elements.size() - 1));
        }
        return text;
    }
}