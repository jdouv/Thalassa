using System.Text;

namespace Business
{
    public static class Utils
    {
        // Converts normal text to camel case by calling the relevant method
        public static string ToCamelCase(string text)
        {
            return CamelPascal(text, false);
        }

        // Converts normal text to Pascal case by calling the relevant method
        public static string ToPascalCase(string text) {
            return CamelPascal(text, true);
        }

        private static string CamelPascal(string text, bool capitalizeFirst) {
            if (text == null) return null;

            var modifiedText = new StringBuilder();

            foreach (var word in text.Split(" ")) {
                if (string.IsNullOrEmpty(word)) continue;
                modifiedText.Append(word.Substring(0, 1).ToUpper());
                modifiedText.Append(word.Substring(1).ToLower());
            }

            var finalText = modifiedText.ToString();

            if (capitalizeFirst) return finalText;
            return finalText.Substring(0, 1).ToLower() + finalText.Substring(1);
        }
    }
}