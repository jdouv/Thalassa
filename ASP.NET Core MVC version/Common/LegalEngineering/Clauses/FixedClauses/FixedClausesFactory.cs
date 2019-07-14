namespace Common.LegalEngineering.Clauses.FixedClauses
{
    public static class FixedClausesFactory
    {
        public static Clause GetOffHireClause()
        {
            return new OffHire();
        }
    }
}