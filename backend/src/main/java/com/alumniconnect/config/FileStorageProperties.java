package com.alumniconnect.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "file")
@Data
public class FileStorageProperties {
    private String uploadDir = "uploads/resumes";
    private long maxFileSize = 5242880; // 5MB in bytes
}
