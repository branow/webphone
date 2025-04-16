package com.scisbo.webphone.models.converters;

import java.util.Arrays;

import org.springframework.data.convert.PropertyValueConverter;
import org.springframework.data.convert.ValueConversionContext;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.exceptions.InvalidValueException;
import com.scisbo.webphone.models.NumberType;

@Component
public class NumberTypeConverter implements PropertyValueConverter<NumberType, String, ValueConversionContext<?>> {

    /**
     * Converts a string representation of a number type to the corresponding 
     * {@link NumberType} enum.
     *
     * @param value     the string value representing a number type
     * @param context   the conversion context (not used, can be {@code null})
     * @return the matching {@code NumberType} enum value
     * @throws InvalidValueException if the provided value does not match any 
     * {@code NumberType}
     * */
    @Override
    public NumberType read(String value, ValueConversionContext<?> context) {
        return Arrays.stream(NumberType.values())
            .filter(type -> type.getValue().equals(value))
            .findFirst()
        .orElseThrow(() -> new InvalidValueException("number type", value));
    }

    /**
     * Converts a {@link NumberType} enum to its string representation.
     *
     * @param value     the {@code NumberType} enum value
     * @param context   the conversion context (not used, can be {@code null})
     * @return the string representation of the given {@code NumberType}
     * */
    @Override
    public String write(NumberType value, ValueConversionContext<?> context) {
        return value.getValue();
    }

}
