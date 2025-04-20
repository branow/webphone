package com.scisbo.webphone.utils.validation;

import java.util.List;

import lombok.Data;
import lombok.Builder;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

/**
 * Represents a single invalid field with associated errors.
 * */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidField {

    /**
     * Then name of the field that failed validation (e.g., "username", "email").
     * */
    String name;

    /**
     * The value that was rejected during validation for this field.
     * */
    Object value;

    /**
     * A list of error details associated with the invalid field.
     * */
    List<ErrorInfo> errors;

}
