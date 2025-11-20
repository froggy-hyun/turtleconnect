package com.turtletongtong.turtleconnect.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger(OpenAPI) 설정 파일.
 * JWT 인증을 위한 SecurityScheme 등록.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        String jwtScheme = "JWT Token";

        SecurityRequirement securityRequirement =
                new SecurityRequirement().addList(jwtScheme);

        SecurityScheme securityScheme =
                new SecurityScheme()
                        .name(jwtScheme)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT");

        return new OpenAPI()
                .info(new Info()
                        .title("TurtleConnect API")
                        .description("거북섬 프로젝트 API 문서")
                        .version("1.0"))
                .addSecurityItem(securityRequirement)
                .components(new Components().addSecuritySchemes(jwtScheme, securityScheme));
    }
}
