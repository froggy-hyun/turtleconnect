package com.turtletongtong.turtleconnect.global.advice;

import com.turtletongtong.turtleconnect.global.error.ErrorResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * 모든 API 응답을 Envelope 형태로 감싸기 위한 Advice.
 * ErrorResponse가 반환되는 경우 success=false로 감싸고,
 * 일반 객체는 success=true로 감싼다.
 */
@RestControllerAdvice
public class ApiResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    public record ApiResponse(boolean success, Object data, ErrorResponse error) {}

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        String path = request.getURI().getPath();

        if (path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/api-docs")
                || path.equals("/actuator/health")) {
            return body;
        }

        if (StringHttpMessageConverter.class.isAssignableFrom(selectedConverterType)) {
            return body;
        }

        if (body instanceof ErrorResponse errorResponse) {
            return new ApiResponse(false, null, errorResponse);
        }

        return new ApiResponse(true, body, null);
    }
}
