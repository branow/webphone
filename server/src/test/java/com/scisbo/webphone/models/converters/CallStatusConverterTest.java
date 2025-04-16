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
import com.scisbo.webphone.models.CallStatus;

@SpringJUnitConfig(CallStatusConverter.class)
public class CallStatusConverterTest {

    @Autowired
    private CallStatusConverter converter;

    @ParameterizedTest
    @MethodSource("provideTestRead")
    public void testRead(String value, CallStatus expected) {
        CallStatus actual = this.converter.read(value, null);
        assertEquals(expected, actual);
    }

    @Test
    public void testRead_invalidValue_throwsException() {
        assertThrows(InvalidValueException.class, () -> this.converter.read("invalid", null));
    }

    @ParameterizedTest
    @MethodSource("provideTestWrite")
    public void testWrite(CallStatus value, String expected) {
        String actual = this.converter.write(value, null);
        assertEquals(expected, actual);
    }

    private static Stream<Arguments> provideTestRead() {
        return Stream.of(
            Arguments.of("incoming", CallStatus.INCOMING),
            Arguments.of("outcoming", CallStatus.OUTCOMING),
            Arguments.of("missed", CallStatus.MISSED),
            Arguments.of("failed", CallStatus.FAILED)
        );
    }

    private static Stream<Arguments> provideTestWrite() {
        return Stream.of(
            Arguments.of(CallStatus.INCOMING, "incoming"),
            Arguments.of(CallStatus.OUTCOMING, "outcoming"),
            Arguments.of(CallStatus.MISSED, "missed"),
            Arguments.of(CallStatus.FAILED, "failed")
        );
    }

}
