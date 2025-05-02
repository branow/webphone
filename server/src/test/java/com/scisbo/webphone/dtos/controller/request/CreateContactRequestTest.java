package com.scisbo.webphone.dtos.controller.request;

import java.util.stream.Stream;
import java.util.List;
import java.util.Map;
import java.util.Collections;

import com.scisbo.webphone.common.validation.TestValidationUtils;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.Arguments;

public class CreateContactRequestTest {

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
                "name",
                List.of(
                    CreateContactRequest.builder().name("some name").build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "name",
                List.of(
                    CreateContactRequest.builder().build()
                ),
                List.of("contact.name.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "name",
                List.of(
                    CreateContactRequest.builder().name("").build(),
                    CreateContactRequest.builder().name("  ").build()
                ),
                List.of("contact.name.mandatory", "contact.name.size"),
                Map.of("min", 3, "max", 100)
            ),
            Arguments.of(
                "name",
                List.of(
                    CreateContactRequest.builder().name("ab").build(),
                    CreateContactRequest.builder().name("a".repeat(101)).build()
                ),
                List.of("contact.name.size"),
                Map.of("min", 3, "max", 100)
            ),
            Arguments.of(
                "bio",
                List.of(
                    CreateContactRequest.builder().bio("a".repeat(500)).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "bio",
                List.of(
                    CreateContactRequest.builder().bio("a".repeat(501)).build()
                ),
                List.of("contact.bio.size"),
                Map.of("min", 0, "max", 500)
            ),
            Arguments.of(
                "numbers",
                List.of(
                    CreateContactRequest.builder()
                        .numbers(Collections.nCopies(10,
                            NumberRequest.builder().type("work").number("1111").build())
                        ).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "numbers",
                List.of(
                    CreateContactRequest.builder().build(),
                    CreateContactRequest.builder().numbers(List.of()).build()
                ),
                List.of("contact.numbers.empty"),
                Map.of()
            ),
            Arguments.of(
                "numbers",
                List.of(
                    CreateContactRequest.builder()
                        .numbers(Collections.nCopies(11,
                            NumberRequest.builder().type("work").number("1111").build())
                        ).build()
                ),
                List.of("contact.numbers.size"),
                Map.of("min", 0, "max", 10)
            )
        );
    }

}
