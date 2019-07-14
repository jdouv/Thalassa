package Thalassa.Models;

import com.arangodb.springframework.annotation.Document;
import com.arangodb.springframework.annotation.Field;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Document("Vessels")
public class Vessel {

    @Id
    @NotBlank(message =  "{error.requiredVesselImoNumber}")
    @Size(max = 10, message = "{error.maxVesselImoNumber}")
    private String imoNumber;
    @Field("Name")
    @NotBlank(message =  "{error.requiredVesselName}")
    @Size(max = 30, message = "{error.maxVesselName}")
    private String name;
    @Field("Flag")
    @NotBlank(message =  "{error.requiredVesselFlag}")
    @Size(min = 2, max = 2, message = "{error.sizeVesselFlag}")
    private String flag;
    @Field("Year built")
    @NotBlank(message =  "{error.requiredVesselYearBuilt}")
    @Size(min = 4, max = 4, message = "{error.sizeVesselYearBuilt}")
    private String yearBuilt;
    @Field("DWT")
    @NotBlank(message =  "{error.requiredVesselDwt}")
    @Size(max = 10, message = "{error.maxVesselDwt}")
    private String dwt;

    @JsonCreator
    public Vessel(@JsonProperty("imoNumber")String imoNumber,
                  @JsonProperty("name") String name,
                  @JsonProperty("flag") String flag,
                  @JsonProperty("yearBuilt") String yearBuilt,
                  @JsonProperty("dwt") String dwt) {
        this.imoNumber = imoNumber;
        this.name = name;
        this.flag = flag;
        this.yearBuilt = yearBuilt;
        this.dwt = dwt;
    }

    public String getImoNumber() {
        return imoNumber;
    }

    public void setImoNumber(String imoNumber) {
        this.imoNumber = imoNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getYearBuilt() {
        return yearBuilt;
    }

    public void setYearBuilt(String yearBuilt) {
        this.yearBuilt = yearBuilt;
    }

    public String getDwt() {
        return dwt;
    }

    public void setDwt(String dwt) {
        this.dwt = dwt;
    }
}