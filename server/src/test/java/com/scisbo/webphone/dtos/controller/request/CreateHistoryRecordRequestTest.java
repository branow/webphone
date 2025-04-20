package com.scisbo.webphone.dtos.controller.request;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import com.scisbo.webphone.common.validation.TestValidationUtils;

public class CreateHistoryRecordRequestTest {

    @ParameterizedTest(name = "[{index}] Validating property: {0}")
    @MethodSource("provideTestValidation")
    public void testValidation(
        String prop,
        List<CreateContactRequest> objects,
        List<String> keys,
        Map<String, Object> args
    ) {
        var expected = TestValidationUtils.formatMessages(TestValidationUtils.resolveMessages(keys), args);
        TestValidationUtils.testProperty(prop, objects, expected);
    }

    private static Stream<Arguments> provideTestValidation() {
        return Stream.of(
            Arguments.of(
                "number",
                List.of(
                    CreateHistoryRecordRequest.builder().number("1").build(),
                    CreateHistoryRecordRequest.builder().number("1".repeat(12)).build(),
                    CreateHistoryRecordRequest.builder().number("1234567890#*").build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "number",
                List.of(
                    CreateHistoryRecordRequest.builder().build()
                ),
                List.of("number.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "number",
                List.of(
                    CreateHistoryRecordRequest.builder().number("").build(),
                    CreateHistoryRecordRequest.builder().number("   ").build()
                ),
                List.of("number.mandatory", "number.pattern"),
                Map.of()
            ),
            Arguments.of(
                "number",
                List.of(
                    CreateHistoryRecordRequest.builder().number("1".repeat(13)).build()
                ),
                List.of("number.size"),
                Map.of("max", 12)
            ),
            Arguments.of(
                "number",
                List.of(
                    CreateHistoryRecordRequest.builder().number("a").build(),
                    CreateHistoryRecordRequest.builder().number("-").build(),
                    CreateHistoryRecordRequest.builder().number("_").build(),
                    CreateHistoryRecordRequest.builder().number("A").build(),
                    CreateHistoryRecordRequest.builder().number("123 ").build()
                ),
                List.of("number.pattern"),
                Map.of()
            ),
            Arguments.of(
                "status",
                List.of(
                    CreateHistoryRecordRequest.builder().build(),
                    CreateHistoryRecordRequest.builder().status("").build(),
                    CreateHistoryRecordRequest.builder().status("  ").build()
                ),
                List.of("call.status.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "startDate",
                List.of(
                    CreateHistoryRecordRequest.builder().build()
                ),
                List.of("call.start-date.mandatory"),
                Map.of()
            )
        );
    }

}
