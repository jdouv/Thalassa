package Thalassa.Configuration.Jwt;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;
import Thalassa.Configuration.Constants;
import Thalassa.Models.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenUtil implements Serializable {

    private static final long serialVersionUID = -2550185165626007488L;
    private static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;

    @Value("https://localhost:8443")
    private String issuer;

    @Value("https://localhost:8443")
    private String audience;

    <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(Jwts.parser().setSigningKey(Constants.JWT_KEY).parseClaimsJws(token).getBody());
    }

    public String generateToken(User user) {
        Claims claims = Jwts.claims()
                .setSubject(user.getPublicKey())
                .setIssuer(issuer)
                .setAudience(audience)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .setNotBefore(new Date(System.currentTimeMillis()))
                .setId(UUID.randomUUID().toString());
        claims.put("firstName", user.getFirstName());

        return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS512, Constants.JWT_KEY).compact();
    }

    boolean validateToken(String token, UserDetails userDetails) {
        return (getClaimFromToken(token, Claims::getSubject).equals(userDetails.getUsername()) && // subject equals user’s public key
                !getClaimFromToken(token, Claims::getExpiration).before(new Date()) && // token has expired
                getClaimFromToken(token, Claims::getIssuer).equals(issuer) && // issuer is valid
                getClaimFromToken(token, Claims::getAudience).equals(audience)); // audience is valid
    }
}