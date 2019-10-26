package Thalassa.Models;

import com.arangodb.springframework.annotation.Document;
import com.arangodb.springframework.annotation.Field;
import org.springframework.data.annotation.Id;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Document("Blockchain")
public class Block {

    @Id
    private String index;
    @Field("Hash")
    private String hash;
    @Field("Timestamp")
    private long timestamp;
    @Field("Data")
    private String data;
    @Field("Previous hash")
    private String previousHash;

    public Block() {
    }

    public Block(String index, String data, String previousHash) throws Exception {
        this.index = index;
        this.timestamp = System.currentTimeMillis();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = calculateHash();
    }

    public Block(String index, String data) throws Exception {
        this.index = index;
        this.timestamp = System.currentTimeMillis();
        this.data = data;
        this.hash = calculateHash();
    }

    public String getIndex() {
        return index;
    }

    public String getHash() {
        return hash;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public String calculateHash() throws Exception {
        String blockData = previousHash == null ? index + timestamp + data : index + timestamp + data + previousHash;
        return new BigInteger(1, MessageDigest.getInstance("SHA-256").digest(blockData.getBytes(StandardCharsets.UTF_8))).toString(16);
    }
}