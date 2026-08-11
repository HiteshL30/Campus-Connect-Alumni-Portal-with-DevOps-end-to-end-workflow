package com.alumniconnect.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.alumniconnect.controller", "com.alumniconnect.service", "com.alumniconnect.repository"})
public class WebConfig implements WebMvcConfigurer {
    // This ensures controllers are scanned
}
