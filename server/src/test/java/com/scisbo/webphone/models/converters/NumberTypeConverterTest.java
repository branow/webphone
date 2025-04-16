package com.scisbo.webphone.models.converters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.exceptions.InvalidValueException;
import com.scisbo.webphone.models.NumberType;

@SpringJUnitConfig(NumberTypeConverter.class)
public class NumberTypeConverterTest {

    @Autowired
    private NumberTypeConverter converter;

    @ParameterizedTest
    @MethodSource("provideTestRead")
    public void testRead(String value, NumberType expected) {
        NumberType actual = this.converter.read(value, null);
        assertEquals(expected, actual);
    }

    @Test
    public void testRead_invalidValue_throwsException() {
        assertThrows(InvalidValueException.class, () -> this.converter.read("invalid", null));
    }

    @ParameterizedTest
    @MethodSource("provideTestWrite")
    public void testWrite(NumberType value, String expected) {
        String actual = this.converter.write(value, null);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestRead() {
        return Stream.of(
            Arguments.of("work", NumberType.WORK),
            Arguments.of("home", NumberType.HOME),
            Arguments.of("mobile", NumberType.MOBILE)
        );
    }

    private static Stream<Arguments> provideTestWrite() {
        return Stream.of(
            Arguments.of(NumberType.WORK, "work"),
            Arguments.of(NumberType.HOME, "home"),
            Arguments.of(NumberType.MOBILE, "mobile")
        );
    }

}
