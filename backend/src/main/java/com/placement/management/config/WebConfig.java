package com.placement.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173", // Vite React
                        "http://localhost:3000",
                        "http://localhost:3001"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // This maps the URL path /uploads/** to the actual folder on your PC
//        String uploadPath = new File("backend/uploads/resumes").getAbsolutePath();
//
//        registry.addResourceHandler("/uploads/resumes/**")
//                .addResourceLocations("file:" + uploadPath + "/");
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Point to the physical location on your C: drive
        String rootPath = System.getProperty("user.dir");
        String uploadPath = "file:" + rootPath + "/uploads/resumes/";

        registry.addResourceHandler("/uploads/resumes/**")
                .addResourceLocations(uploadPath);
    }
}
