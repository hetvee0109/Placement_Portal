package com.placement.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Resolve the absolute path to your 'uploads' folder
        // This ensures the server finds the folder regardless of where the app is launched from.
        String uploadRoot = Paths.get("uploads").toAbsolutePath().toString().replace("\\", "/");
        String resourceLocation = "file:" + uploadRoot + "/";

        // 2. Map the URL /uploads/** to the physical 'uploads' folder
        // This allows the TPO to view files at: http://localhost:8080/uploads/offer_letters/filename.pdf
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);

        // 3. Keep support for legacy notification file paths if necessary
        registry.addResourceHandler("/api/notifications/files/**")
                .addResourceLocations(resourceLocation);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Essential to allow your React app (Port 3000/5173) to talk to Spring Boot (Port 8080)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}