package com.placement.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Get the absolute path to the "uploads" folder in your project root
        String uploadRoot = Paths.get("uploads").toAbsolutePath().toString().replace("\\", "/");

        // 2. Ensure the path ends with a slash and has the 'file:' protocol
        String resourceLocation = "file:" + uploadRoot + "/";

        // This allows access via http://localhost:8080/uploads/resumes/filename.pdf
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);

        // This allows access via http://localhost:8080/api/notifications/files/filename.pdf
        // This matches the URL we used in the React "VIEW ATTACHED PDF" button
        registry.addResourceHandler("/api/notifications/files/**")
                .addResourceLocations(resourceLocation);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}