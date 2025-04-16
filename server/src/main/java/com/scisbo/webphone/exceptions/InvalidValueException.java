package com.scisbo.webphone.exceptions;

import lombok.Getter;

@Getter
public class InvalidValueException extends RuntimeException {

    public static final String MESSAGE_PATTERN = "Invalid %s: %s";

    private final String name;
    private final Object value;

    public InvalidValueException(String name, Object value) {
        super(String.format(MESSAGE_PATTERN, name, value));
        this.name = name;
        this.value = value;
    }

}
