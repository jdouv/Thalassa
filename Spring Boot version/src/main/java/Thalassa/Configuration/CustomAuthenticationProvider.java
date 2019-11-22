package Thalassa.Configuration;

import Thalassa.DataManagement.Services.CryptographyService;
import Thalassa.DataManagement.Services.UserService;
import Thalassa.Models.User;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Configurable
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserService userService;

    public CustomAuthenticationProvider(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        User user = userService.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(authentication.getCredentials() + ""));

        if (!user.getPublicKey().equals(authentication.getPrincipal() + ""))
            throw new BadCredentialsException("1000");

        List<GrantedAuthority> grantedAuths = AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_" + user.getPosition());
        return new UsernamePasswordAuthenticationToken(user.getPublicKey(), user.getPrivateKey(), grantedAuths);
    }

    @Override
    public boolean supports(Class<?> auth) {
        return auth.equals(UsernamePasswordAuthenticationToken.class);
    }
}