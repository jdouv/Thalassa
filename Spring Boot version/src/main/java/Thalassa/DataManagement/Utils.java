package Thalassa.DataManagement;

public final class Utils {

    // Converts normal text to camel case by calling the relevant method
    public static String toCamelCase(final String text) {
        return camelOrPascal(text, false);
    }

    // Converts normal text to Pascal case by calling the relevant method
    public static String toPascalCase(final String text) {
        return camelOrPascal(text, true);
    }

    private static String camelOrPascal(final String text, final boolean capitalizeFirst) {
        if (text == null) return null;

        final StringBuilder modifiedText = new StringBuilder(text.length());

        for (final String word : text.split(" ")) {
            if (!word.isEmpty()) {
                modifiedText.append(Character.toUpperCase(word.charAt(0)));
                modifiedText.append(word.substring(1).toLowerCase());
            }
        }

        String finalText = modifiedText.toString();

        if (capitalizeFirst) return finalText;
        return finalText.substring(0, 1).toLowerCase() + finalText.substring(1);
    }
}
