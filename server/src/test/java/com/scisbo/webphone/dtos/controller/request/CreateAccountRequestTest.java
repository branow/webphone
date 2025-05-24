package com.scisbo.webphone.dtos.controller.request;

import java.util.stream.Stream;
import java.util.Map;
import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import com.scisbo.webphone.common.validation.TestValidationUtils;

import org.junit.jupiter.params.provider.Arguments;

public class CreateAccountRequestTest {

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
                "user",
                List.of(
                    CreateAccountRequest.builder().build(),
                    CreateAccountRequest.builder().user("").build(),
                    CreateAccountRequest.builder().user("   ").build()
                ),
                List.of("account.user.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "user",
                List.of(
                    CreateAccountRequest.builder().user("a".repeat(101)).build()
                ),
                List.of("account.user.size"),
                Map.of("max", 100)
            ),
            Arguments.of(
                "user",
                List.of(
                    CreateAccountRequest.builder().user("a".repeat(1)).build(),
                    CreateAccountRequest.builder().user("a".repeat(100)).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "username",
                List.of(
                    CreateAccountRequest.builder().build(),
                    CreateAccountRequest.builder().username("").build(),
                    CreateAccountRequest.builder().username("   ").build()
                ),
                List.of("account.username.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "username",
                List.of(
                    CreateAccountRequest.builder().username("a".repeat(101)).build()
                ),
                List.of("account.username.size"),
                Map.of("max", 100)
            ),
            Arguments.of(
                "username",
                List.of(
                    CreateAccountRequest.builder().username("a".repeat(1)).build(),
                    CreateAccountRequest.builder().username("a".repeat(100)).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "active",
                List.of(
                    CreateAccountRequest.builder().build()
                ),
                List.of("account.active.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "active",
                List.of(
                    CreateAccountRequest.builder().active(false).build(),
                    CreateAccountRequest.builder().active(true).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "sip",
                List.of(
                    CreateAccountRequest.builder().build()
                ),
                List.of("account.sip.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "sip",
                List.of(
                    CreateAccountRequest.builder().sip(SipRequest.builder().build()).build()
                ),
                List.of(),
                Map.of()
            )
        );
    }


}
