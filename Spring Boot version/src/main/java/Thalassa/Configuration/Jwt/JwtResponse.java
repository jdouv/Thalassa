package Thalassa.Configuration.Jwt;

import java.io.Serializable;

public class JwtResponse implements Serializable {

    private static final long serialVersionUID = -8091879091924046844L;
    private final String jwtToken;
    private final String view;

    public JwtResponse(String jwtToken, String view) {
        this.jwtToken = jwtToken;
        this.view = view;
    }

    public String getToken() {
        return this.jwtToken;
    }

    public String getView() {
        return view;
    }
}