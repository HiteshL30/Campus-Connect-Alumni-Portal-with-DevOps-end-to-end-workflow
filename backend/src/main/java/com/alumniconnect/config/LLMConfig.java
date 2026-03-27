package com.alumniconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

@Configuration
@EnableRetry
public class LLMConfig {
    // LLM Services are now managed via @Service and @ConditionalOnProperty in their respective classes.
}
