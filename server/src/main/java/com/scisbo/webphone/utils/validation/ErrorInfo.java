package com.scisbo.webphone.utils.validation;

import java.util.Map;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * Represents detailed information about a specific validation error.
 * */
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ErrorInfo {

    /**
     * The code representing the validation rule that was violated (e.g., "NotNull", "Size").
     * */
    String code;

    /**
     * The human-readable error message (e.g., "must not be blank")
     * */
    String message;

    /**
     * A map containing the arguments associated with the validation rule.
     * DecimalMax, DecimalMin -> inclusive, value
     * Digits -> fraction, integer
     * Min, Max -> value
     * Size -> min, max;
     * Pattern, Email -> regexp;
     * */
    Map<String, Object> arguments;

}
