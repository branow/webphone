package com.scisbo.webphone.common.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Locale;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

public class TestValidationUtils {

    private static Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private static String BUNDLE = "ValidationMessages";

    public static <T> void testProperty(String prop, List<T> objects, List<String> expected) {
        objects.forEach(object -> testProperty(prop, object, expected));
    }

    public static <T> void testProperty(String prop, T obj, List<String> expected) {
        var actual = validator.validateProperty(obj, prop).stream()
            .map(ConstraintViolation::getMessage)
            .sorted()
            .toList();
        expected = expected.stream().sorted().toList();
        assertEquals(expected, actual);
    }

    public static List<String> resolveMessages(List<String> keys) {
        ResourceBundle bundle = ResourceBundle.getBundle(BUNDLE, Locale.getDefault());
        return keys.stream().map(bundle::getString).toList();
    }

    public static List<String> formatMessages(List<String> messages, Map<String, Object> args) {
        return messages.stream().map(key -> formatMessage(key, args)).toList();
    }

    private static String formatMessage(String message, Map<String, Object> args) {
        for (var entry: args.entrySet()) {
            message = message.replace("{" + entry.getKey() + "}", entry.getValue().toString());
        }
        return message;
    }

}
