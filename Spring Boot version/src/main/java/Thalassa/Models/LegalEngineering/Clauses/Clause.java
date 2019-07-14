package Thalassa.Models.LegalEngineering.Clauses;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Clause {

    private String title;
    private LinkedList<HashMap<String, Object>> paragraphs;

    @JsonCreator
    public Clause(@JsonProperty("title") String title, @JsonProperty("paragraphs") LinkedList<HashMap<String, Object>> paragraphs) {
        this.title = title;
        this.paragraphs = paragraphs;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LinkedList<HashMap<String, Object>> getParagraphs() {
        return paragraphs;
    }

    public void setParagraphs(LinkedList<HashMap<String, Object>> paragraphs) {
        this.paragraphs = paragraphs;
    }

    // Finds legen syntax in given text
    public List<String> paragraphAnalysis(String text) {
        List<String> list = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\$\\$(.*?)\\$\\$");
        Matcher matcher = pattern.matcher(text);
        while (matcher.find())
            list.add(matcher.group(1));
        return list;
    }

    // Converts legen paragraph to readable paragraph
    public String getParagraphReadable(String paragraph) {
        Pattern pattern = Pattern.compile("\\$\\$(.*?)\\$\\$");
        StringBuilder sb = new StringBuilder();
        Matcher matcher = pattern.matcher(paragraph);
        while (matcher.find()) {
            String toChange = matcher.group(1);
            if (toChange.substring(0, 1).equals("@"))
                toChange = toChange.substring(1);
            if (toChange.substring(0, 1).equals("<"))
                toChange = toChange.substring(1);
            if (toChange.substring(0, 1).equals("."))
                toChange = toChange.substring(1);
            if (toChange.endsWith("."))
                toChange = toChange.substring(0, toChange.length() - 1);
            if (toChange.substring(0, 2).equals("=="))
                toChange = toChange.substring(2);
            if (toChange.substring(0, 2).equals("=>"))
                toChange = toChange.substring(2);
            if (toChange.substring(0, 2).equals("**"))
                toChange = toChange.substring(2);
            if (toChange.substring(0, 3).equals("(~)"))
                toChange = toChange.substring(3);
            if (toChange.contains("("))
                toChange = toChange.substring(0, toChange.indexOf("("));
            matcher.appendReplacement(sb, toChange);
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}