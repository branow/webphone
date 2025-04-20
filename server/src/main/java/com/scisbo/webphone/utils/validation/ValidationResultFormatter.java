package com.scisbo.webphone.utils.validation;

import java.util.List;

import org.springframework.validation.FieldError;

/**
 * Interface for formatting validation results into a structured format.
 * */
public interface ValidationResultFormatter {

    /**
     * Formats a list of {@link FieldError} objects into a structured error format.
     *
     * @param errors the list of field-level validation errors
     * @return a list of {@link InvalidField} objects
     * */
    List<InvalidField> formatFieldErrors(List<FieldError> errors);

}
