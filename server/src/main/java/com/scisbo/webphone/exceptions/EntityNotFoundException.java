package com.scisbo.webphone.exceptions;

import lombok.Getter;

@Getter
public class EntityNotFoundException extends RuntimeException {

    public static final String MESSAGE_PATTERN = "Entity %s not found by %s '%s'";

    private final Object entity;
    private final String fieldName;
    private final Object fieldValue;

    public EntityNotFoundException(Object entity, String fieldName, Object fieldValue) {
        super(String.format(MESSAGE_PATTERN, entity, fieldName, fieldValue));
        this.entity = entity;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

}
