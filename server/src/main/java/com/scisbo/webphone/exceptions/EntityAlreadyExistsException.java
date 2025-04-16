package com.scisbo.webphone.exceptions;

import lombok.Getter;

@Getter
public class EntityAlreadyExistsException extends RuntimeException {

    public static final String MESSAGE_PATTERN = "Entity %s with %s '%s' already exists";

    private final Object entity;
    private final String fieldName;
    private final Object fieldValue;

    public EntityAlreadyExistsException(Object entity, String fieldName, Object fieldValue) {
        super(String.format(MESSAGE_PATTERN, entity, fieldName, fieldValue));
        this.entity = entity;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

}
