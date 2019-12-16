package Thalassa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class Thalassa extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Thalassa.class);
    }

    public static void main(String[] args) {
        System.setProperty("file.encoding", "UTF-8");
        System.setProperty("spring.profiles.active", "production");
        SpringApplication.run(Thalassa.class, args);
    }
}