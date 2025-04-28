package com.scisbo.webphone.log.web;

import java.io.IOException;
import java.util.Optional;

import org.slf4j.event.Level;
import org.springframework.web.util.ContentCachingResponseWrapper;

import com.scisbo.webphone.log.core.SpelLogger;
import com.scisbo.webphone.log.core.SpelLoggerFactory;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LoggingFilter implements Filter {

    private final SpelLoggerFactory factory;

    private SpelLogger logger;


    @Override
    public void doFilter(
        ServletRequest req,
        ServletResponse res,
        FilterChain chain
    ) throws ServletException, IOException {
        ensureLoggerInitialized();
        var request = (HttpServletRequest) req;
        var response = (HttpServletResponse) res;
        var responseWrapper = new ContentCachingResponseWrapper(response);

        logRequest(request);

        try {
            chain.doFilter(request, responseWrapper);
        } finally {
            logResponse(responseWrapper);
            responseWrapper.copyBodyToResponse();
        }
    }

    private void ensureLoggerInitialized() {
        this.logger = Optional.ofNullable(this.logger)
            .orElseGet(() -> this.factory.getLogger(getClass()));
    }

    private void logRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (request.getQueryString() != null) {
            path += "?" + request.getQueryString();
        }
        String message = String.format("Request: %s %s", request.getMethod(), path);
        this.logger.log(Level.INFO, message);
    }

    private void logResponse(ContentCachingResponseWrapper response) {
        int status = response.getStatus();

        if (status >= 500) {
            this.logger.log(Level.ERROR, "Response: " + status + " " + getResponseBody(response));
        } else if (status >= 400) {
            this.logger.log(Level.WARN, "Response: " + status + " " + getResponseBody(response));
        } else {
            this.logger.log(Level.INFO, "Response: " + status);
        }
    }

    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] body = response.getContentAsByteArray();
        return body.length > 0 ? new String(body) : "[empty]";
    }

}
