package com.scisbo.webphone.utils.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.validation.BindingResult;
import org.springframework.validation.DataBinder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import jakarta.validation.constraints.AssertFalse;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@SpringJUnitConfig(SimpleValidationResultFormatter.class)
public class SimpleValidationResultFormatterTest {

    @Autowired
    private SimpleValidationResultFormatter formatter;

    @Test
    public void testFormatFieldErrors() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        var dto = TestDto.builder()
            .assertTrue(false)
            .assertFalse(true)
            .decimalMax(5.51)
            .decimalMin(0.19)
            .digits(123.1234)
            .email("some-email@")
            .max(6)
            .min(-1)
            .pattern("some-very-long-pattern")
            .build();

        DataBinder binder = new DataBinder(dto);
        binder.setValidator(validator);
        binder.validate();
        BindingResult result = binder.getBindingResult();
        var errors = result.getFieldErrors();

        var actual = formatter.formatFieldErrors(errors);
        var expected = getFormatFieldErrorsExpected();

        assertEquals(expected.size(), actual.size());
        for (int i = 0; i < expected.size(); i++) {
            assertEquals(expected.get(i), actual.get(i));
        }
    }

    @Data
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TestDto {

        @AssertFalse(message = "assert false")
        boolean assertFalse;

        @AssertTrue(message = "assert true")
        boolean assertTrue;

        @DecimalMax(value = "5.5", inclusive = true, message = "decimal max")
        double decimalMax;

        @DecimalMin(value = "0.2", inclusive = true, message = "decimal min")
        double decimalMin;

        @Digits(integer = 2, fraction = 3, message = "digits")
        double digits;

        @Email(regexp = ".*@.*", message = "email")
        String email;

        @Max(value = 5, message = "max")
        int max;

        @Min(value = 0, message = "min")
        int min;

        @Size(max = 10, min = 2, message = "size")
        @Pattern(regexp = "[a-z]+", message = "pattern")
        String pattern;

    }

    private static List<InvalidField> getFormatFieldErrorsExpected() {
        return List.of(
            InvalidField.builder()
                .name("assertFalse")
                .value(true)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("AssertFalse")
                        .message("assert false")
                        .arguments(Map.of())
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("assertTrue")
                .value(false)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("AssertTrue")
                        .message("assert true")
                        .arguments(Map.of())
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("decimalMax")
                .value(5.51)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("DecimalMax")
                        .message("decimal max")
                        .arguments(Map.of("value", 5.5, "inclusive", true))
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("decimalMin")
                .value(0.19)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("DecimalMin")
                        .message("decimal min")
                        .arguments(Map.of("value", 0.2, "inclusive", true))
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("digits")
                .value(123.1234)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("Digits")
                        .message("digits")
                        .arguments(Map.of("integer", 2, "fraction", 3))
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("email")
                .value("some-email@")
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("Email")
                        .message("email")
                        .arguments(Map.of("regexp", ".*@.*"))
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("max")
                .value(6)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("Max")
                        .message("max")
                        .arguments(Map.of("value", 5l))
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("min")
                .value(-1)
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("Min")
                        .message("min")
                        .arguments(Map.of("value", 0l))
                        .build()
                ))
                .build(),
            InvalidField.builder()
                .name("pattern")
                .value("some-very-long-pattern")
                .errors(List.of(
                    ErrorInfo.builder()
                        .code("Pattern")
                        .message("pattern")
                        .arguments(Map.of("regexp", "[a-z]+"))
                        .build(),
                    ErrorInfo.builder()
                        .code("Size")
                        .message("size")
                        .arguments(Map.of("max", 10, "min", 2))
                        .build()
                ))
                .build()
        );
    }

}
