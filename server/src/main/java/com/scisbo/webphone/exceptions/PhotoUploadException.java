package com.scisbo.webphone.exceptions;

import lombok.Getter;

@Getter
public class PhotoUploadException extends RuntimeException {

    public static final String MESSAGE_PATTERN = "Failed to upload photo at %s";

    private final String url;

    public PhotoUploadException(String url, Throwable cause) {
        super(String.format(MESSAGE_PATTERN, url), cause);
        this.url = url;
    }

}

