package com.scisbo.webphone.log.id;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * Provides a unique UUID for each HTTP request.
 * */
@Component
public class RequestLogIdProvider implements LogIdProvider {

    private static final String ATTR = "logId";


    @Override
    public String getId() {
        RequestAttributes attrs = Optional.ofNullable(RequestContextHolder.getRequestAttributes())
            .orElseThrow(() -> new IllegalStateException("Cannot access request attributes"));
        return Optional.ofNullable(getId(attrs))
            .orElseGet(() -> generateId(attrs));
    }

    private String generateId(RequestAttributes attrs) {
        String id = UUID.randomUUID().toString();
        return setId(id, attrs);
    }

    private String getId(RequestAttributes attrs) {
        return (String) attrs.getAttribute(ATTR, RequestAttributes.SCOPE_REQUEST);
    }

    private String setId(String id, RequestAttributes attrs) {
        attrs.setAttribute(ATTR, id, RequestAttributes.SCOPE_REQUEST);
        return id;
    }

}
