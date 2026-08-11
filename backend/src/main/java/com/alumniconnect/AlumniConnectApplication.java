package com.alumniconnect;

import com.alumniconnect.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(FileStorageProperties.class)
@org.springframework.scheduling.annotation.EnableScheduling
@org.springframework.retry.annotation.EnableRetry
@org.springframework.context.annotation.ComponentScan(basePackages = {"com.alumniconnect"})
public class AlumniConnectApplication {
    public static void main(String[] args) {
        System.out.println(">>> APPLICATION STARTED <<<");
        SpringApplication.run(AlumniConnectApplication.class, args);
    }
}
