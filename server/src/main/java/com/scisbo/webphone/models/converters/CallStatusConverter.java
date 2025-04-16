package com.scisbo.webphone.models.converters;

import java.util.Arrays;

import org.springframework.data.convert.PropertyValueConverter;
import org.springframework.data.convert.ValueConversionContext;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.exceptions.InvalidValueException;
import com.scisbo.webphone.models.CallStatus;

@Component
public class CallStatusConverter implements PropertyValueConverter<CallStatus, String, ValueConversionContext<?>> {

    /**
     * Converts a string representation of a call status to the corresponding 
     * {@link CallStatus} enum.
     *
     * @param value     the string value representing a call status
     * @param context   the conversion context (not used, can be {@code null})
     * @return the matching {@code CallStatus} enum value
     * @throws InvalidValueException if the provided value does not match any 
     * {@code CallStatus}
     * */
    @Override
    public CallStatus read(String value, ValueConversionContext<?> context) {
        return Arrays.stream(CallStatus.values())
            .filter(callStatus -> callStatus.getStatus().equals(value))
            .findFirst()
        .orElseThrow(() -> new InvalidValueException("call status", value));
    }

    /**
     * Converts a {@link CallStatus} enum to its string representation.
     *
     * @param value     the {@code CallStatus} enum value
     * @param context   the conversion context (not used, can be {@code null})
     * @return the string representation of the given {@code CallStatus}
     * */
    @Override
    public String write(CallStatus value, ValueConversionContext<?> context) {
        return value.getStatus();
    }

}
