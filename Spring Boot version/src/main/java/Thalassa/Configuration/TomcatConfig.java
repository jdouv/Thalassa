package Thalassa.Configuration;

import Thalassa.Services.ConstantsService;
import org.apache.catalina.Context;
import org.apache.coyote.http11.Http11NioProtocol;
import org.apache.coyote.http2.Http2Protocol;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.IOException;

@Configuration
public class TomcatConfig {

    private final ConstantsService constantsService;

    public TomcatConfig(ConstantsService constantsService) {
        this.constantsService = constantsService;
    }

    @Bean
    public ServletWebServerFactory servletContainer() throws IOException {

        // Set service constants
        constantsService.setConstants();

        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                context.addConstraint(new SecurityConstraint() {{
                    setUserConstraint("CONFIDENTIAL");
                    addCollection(new SecurityCollection() {{addPattern("/*");}} );
                }});
            }
        };

        tomcat.addConnectorCustomizers(connector -> {
            connector.setPort(8443);
            connector.setScheme("https");
            connector.setSecure(true);
            connector.addUpgradeProtocol(new Http2Protocol());
            Http11NioProtocol protocol = (Http11NioProtocol) connector.getProtocolHandler();

            protocol.setSSLEnabled(true);
            protocol.setKeystoreType("PKCS12");
            protocol.setKeystoreFile(Constants.CERTIFICATE_PATH);
            protocol.setKeystorePass(Constants.CERTIFICATE_PASSWORD);
            protocol.setKeyAlias(Constants.CERTIFICATE_PASSWORD);
        });

        return tomcat;
    }
}