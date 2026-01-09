//package com.placement.management.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.*;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.io.File;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins(
//                        "http://localhost:5173", // Vite React
//                        "http://localhost:3000",
//                        "http://localhost:3001"
//                )
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }
//
////    @Override
////    public void addResourceHandlers(ResourceHandlerRegistry registry) {
////        // This gets the absolute path to your project root folder
////        Path rootPath = Paths.get("uploads/resumes/");
////        String absolutePath = rootPath.toFile().getAbsolutePath();
////
////        // Map the URL /uploads/** to the physical folder on your disk
////        registry.addResourceHandler("/uploads/**")
////                .addResourceLocations("file:" + absolutePath + "/");
////    }
//
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // This points to the "uploads/resumes" folder in your project root
//        String uploadPath = System.getProperty("user.dir") + "/uploads/resumes/";
//
//        // Add a trailing slash and use "file:///" for Windows compatibility
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:///" + uploadPath);
//    }
//
//}

package com.placement.management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Points to the "uploads" folder in your project root
        String uploadRoot = Paths.get("uploads").toAbsolutePath().toString();

        // This covers EVERYTHING inside the uploads folder:
        // /uploads/resumes/filename.pdf
        // /uploads/notifications/filename.pdf
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadRoot + "/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000" , "http://localhost:3001")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}