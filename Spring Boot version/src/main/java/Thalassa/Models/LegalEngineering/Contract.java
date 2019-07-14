package Thalassa.Models.LegalEngineering;

import Thalassa.Models.LegalEngineering.Clauses.Clause;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;
import java.util.LinkedList;

public class Contract {

    private String type, title;
    private HashMap<String, Object> essentials;
    private LinkedList<Clause> clauses;

    public Contract() {
    }

    @JsonCreator
    public Contract(@JsonProperty("type") String type,
                    @JsonProperty("title") String title,
                    @JsonProperty("essentials") HashMap<String, Object> essentials,
                    @JsonProperty("clauses") LinkedList<Clause> clauses) {
        this.type = type;
        this.title = title;
        this.essentials = essentials;
        this.clauses = clauses;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public HashMap<String, Object> getEssentials() {
        return essentials;
    }

    public void setEssentials(HashMap<String, Object> essentials) {
        this.essentials = essentials;
    }

    public LinkedList<Clause> getClauses() {
        return clauses;
    }

    public void setClauses(LinkedList<Clause> clauses) {
        this.clauses = clauses;
    }
}