package com.scisbo.webphone.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SpaForwardingFilter extends OncePerRequestFilter {

    @Value("${server.servlet.context-path}")
    private String contextPath;


    @Override
    public void doFilterInternal(
        HttpServletRequest req,
        HttpServletResponse res,
        FilterChain chain
    ) throws ServletException, IOException {
        var uri = req.getRequestURI();

        if (isFileUri(uri) || isApiUri(uri)) {
            chain.doFilter(req, res);
            return;
        }

        req.getRequestDispatcher("/index.html").forward(req, res);
    }

    private boolean isFileUri(String uri) {
        return uri.contains(".");
    }

    private boolean isApiUri(String uri) {
        return uri.startsWith(this.contextPath + "/api");
    }

}
