package com.scisbo.webphone.utils.validation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.validation.FieldError;

@Component
public class SimpleValidationResultFormatter implements ValidationResultFormatter {

    @Override
    public List<InvalidField> formatFieldErrors(List<FieldError> errors) {
        List<InvalidField> fields = new ArrayList<>();
        for (var error: errors) {
            InvalidField field = formatFieldError(error);
            fields.stream()
                .filter(presentField -> Objects.equals(presentField.getName(), field.getName()))
                .findFirst()
                .ifPresentOrElse(
                    presentField -> merge(presentField, field),
                    () -> fields.add(field)
                );
        }
        fields.sort((f1, f2) -> f1.getName().compareTo(f2.getName()));
        return fields;
    }

    private void merge(InvalidField field1, InvalidField field2) {
        List<ErrorInfo> errors = Stream.concat(field1.getErrors().stream(), field2.getErrors().stream())
            .sorted((e1, e2) -> e1.getCode().compareTo(e2.getCode()))
            .toList();
        field1.setErrors(errors);
    }

    public InvalidField formatFieldError(FieldError error) {
        return InvalidField.builder()
            .name(error.getField())
            .value(error.getRejectedValue())
            .errors(List.of(parseErrorInfo(error)))
            .build();
    }

    public ErrorInfo parseErrorInfo(FieldError error) {
        return ErrorInfo.builder()
            .code(error.getCode())
            .message(error.getDefaultMessage())
            .arguments(parseArguments(error))
            .build();
    }

    public Map<String, Object> parseArguments(FieldError error) {
        Object[] args = error.getArguments();
        return switch(error.getCode()) {
            case "DecimalMax", "DecimalMin" -> Map.of("inclusive", args[1], "value", toDouble(args[2]));
            case "Digits" -> Map.of("fraction", toInt(args[1]), "integer", toInt(args[2]));
            case "Min", "Max" -> Map.of("value", toLong(args[1]));
            case "Size" -> Map.of("max", toInt(args[1]), "min", toInt(args[2]));
            case "Pattern", "Email" -> Map.of("regexp", args[2].toString());
            default -> Map.of();
        };
    }

    // The following methods are required because the object's class is private static
    // org.springframework.validation.beanvalidation.SpringValidatorAdapter.ResolveAttribute class.

    private static long toLong(Object o) {
        return Long.valueOf(o.toString());
    }

    private static int toInt(Object o) {
        return Integer.valueOf(o.toString());
    }

    private static double toDouble(Object o) {
        return Double.valueOf(o.toString());
    }

}
