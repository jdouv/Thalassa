package Thalassa.Configuration;

import com.arangodb.ArangoDB;
import com.arangodb.springframework.annotation.EnableArangoRepositories;
import com.arangodb.springframework.config.ArangoConfiguration;
import com.arangodb.springframework.core.convert.DefaultArangoTypeMapper;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableArangoRepositories(basePackages = Constants.SERVICE_NAME + "Repositories")
public class AppConfig extends DefaultArangoTypeMapper implements ArangoConfiguration {

    @Override
    public ArangoDB.Builder arango() {
        return new ArangoDB.Builder().host("localhost", 8529).user("root").password(null);
    }

    @Override
    public String database() {
        return Constants.SERVICE_NAME;
    }

    @Override
    public String typeKey() {
        return null;
    }

    @Bean
    public ServletContextInitializer servletContextInitializer() {
        return servletContext -> servletContext.getSessionCookieConfig().setName("Session");
    }
}