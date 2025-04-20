package com.scisbo.webphone.dtos.controller.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(Include.NON_NULL)
public class ErrorResponse {

    LocalDateTime timestamp;
    String type;
    String message;
    Object details;

    public ErrorResponse() {
        this(null, null);
    }

    public ErrorResponse(String type, String message) {
        this(type, message, null);
    }

    public ErrorResponse(String type, String message, Object details) {
        this.timestamp = LocalDateTime.now();
        this.type = type;
        this.message = message;
        this.details = details;
    }

}
