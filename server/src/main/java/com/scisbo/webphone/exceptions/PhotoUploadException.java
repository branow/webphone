package com.scisbo.webphone.exceptions;

import lombok.Getter;

@Getter
public class PhotoUploadException extends RuntimeException {

    public static final String MESSAGE_PATTERN = "Failed to upload photo: %s";

    private final String name;

    public PhotoUploadException(String name, Throwable cause) {
        super(String.format(MESSAGE_PATTERN, name), cause);
        this.name = name;
    }

}

