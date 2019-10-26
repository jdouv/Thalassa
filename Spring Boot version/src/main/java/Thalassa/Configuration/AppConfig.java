package Thalassa.Configuration;

import com.arangodb.ArangoDB;
import com.arangodb.springframework.annotation.EnableArangoRepositories;
import com.arangodb.springframework.config.ArangoConfiguration;
import com.arangodb.springframework.core.convert.DefaultArangoTypeMapper;
import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

@Configuration
@EnableArangoRepositories(basePackages = "Thalassa.DataManagement.Repositories")
public class AppConfig extends DefaultArangoTypeMapper implements WebMvcConfigurer, ArangoConfiguration {

    @Override
    public ArangoDB.Builder arango() {
        return new ArangoDB.Builder().host("localhost", 8529).user("root").password(null);
    }

    @Override
    public String database() {
        return "Thalassa";
    }

    @Override
    public String typeKey() {
        return null;
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.jsp("/", ".jsp");
    }

    @Bean
    public MessageSource messageSource() {
        return new ReloadableResourceBundleMessageSource() {{
            setBasename("classpath:messages");
            setDefaultEncoding("UTF-8");
            setUseCodeAsDefaultMessage(true);
            setCacheSeconds(1);
        }};
    }

    @Bean
    public LocalValidatorFactoryBean getValidator() {
        return new LocalValidatorFactoryBean() {{setValidationMessageSource(messageSource());}};
    }

    @Bean
    public LocaleResolver localeResolver() {
        return new CookieLocaleResolver() {{setCookieName("Locale");}};
    }

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint securityConstraint = new SecurityConstraint();
                securityConstraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");
                securityConstraint.addCollection(collection);
                context.addConstraint(securityConstraint);
            }
        };
        tomcat.addAdditionalTomcatConnectors(new Connector("org.apache.coyote.http11.Http11NioProtocol") {{
            setScheme("http");
            setPort(8080);
            setSecure(false);
            setRedirectPort(8443);
        }});
        return tomcat;
    }
}