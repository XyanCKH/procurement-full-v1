namespace Procurement.Infrastructure.Services
{
    public class DuplicateVendorDetector
    {
        public static double CalculateLevenshteinSimilarity(string source, string target)
        {
            if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target))
            {
                return 0.0;
            }

            var s = source.Trim().ToLowerInvariant();
            var t = target.Trim().ToLowerInvariant();

            if (s == t) return 1.0;

            int n = s.Length;
            int m = t.Length;
            int[,] d = new int[n + 1, m + 1];

            if (n == 0) return m == 0 ? 1.0 : 0.0;
            if (m == 0) return 0.0;

            for (int i = 0; i <= n; i++) d[i, 0] = i;
            for (int j = 0; j <= m; j++) d[0, j] = j;

            for (int i = 1; i <= n; i++)
            {
                for (int j = 1; j <= m; j++)
                {
                    int cost = (t[j - 1] == s[i - 1]) ? 0 : 1;
                    d[i, j] = Math.Min(
                        Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                        d[i - 1, j - 1] + cost);
                }
            }

            int distance = d[n, m];
            int maxLength = Math.Max(n, m);
            return 1.0 - ((double)distance / maxLength);
        }

        public static string? ExtractEmailDomain(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            var parts = email.Split('@');
            if (parts.Length == 2 && !string.IsNullOrWhiteSpace(parts[1]))
            {
                return parts[1].Trim().ToLowerInvariant();
            }
            return null;
        }
    }
}
