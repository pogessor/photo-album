package com.dancsopeter.photoalbum.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI photoAlbumOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Photo Album API")
                        .description("REST API for managing a photo album with AI-powered descriptions")
                        .version("0.0.1-SNAPSHOT"));
    }
}