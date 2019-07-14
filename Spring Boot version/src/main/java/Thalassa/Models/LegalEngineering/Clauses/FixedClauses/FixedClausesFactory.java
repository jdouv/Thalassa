package Thalassa.Models.LegalEngineering.Clauses.FixedClauses;

import Thalassa.Models.LegalEngineering.Clauses.Clause;

public class FixedClausesFactory {

    public static Clause getOffHireClause() {
        return new OffHire();
    }
}