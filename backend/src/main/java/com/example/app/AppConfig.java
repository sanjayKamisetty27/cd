package com.example.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.Interface.*;

@Configuration
public class AppConfig {

    @Bean
    public DAO dao() {
        return new DAO();
    }
}
