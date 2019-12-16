package Thalassa.Models;

import com.arangodb.springframework.annotation.Document;

// This class handles essential data (stored in database) needed during service initialization.
@Document("Constants")
public class ConstantsData {

    public String certificate;
    public String certificateFileName;
    public String certificatePassword;
    public String jwtKey;

    public String getCertificate() {
        return certificate;
    }

    public void setCertificate(String certificate) {
        this.certificate = certificate;
    }

    public String getCertificateFileName() {
        return certificateFileName;
    }

    public void setCertificateFileName(String certificateFileName) {
        this.certificateFileName = certificateFileName;
    }

    public String getCertificatePassword() {
        return certificatePassword;
    }

    public void setCertificatePassword(String certificatePassword) {
        this.certificatePassword = certificatePassword;
    }

    public String getJwtKey() {
        return jwtKey;
    }

    public void setJwtKey(String jwtKey) {
        this.jwtKey = jwtKey;
    }
}