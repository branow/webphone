package com.scisbo.webphone.dtos.controller.request;

import java.util.stream.Stream;
import java.util.Map;
import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import com.scisbo.webphone.common.validation.TestValidationUtils;

import org.junit.jupiter.params.provider.Arguments;

public class SipRequestTest {

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
                "username",
                List.of(
                    SipRequest.builder().build(),
                    SipRequest.builder().username("").build(),
                    SipRequest.builder().username("   ").build()
                ),
                List.of("sip.username.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "username",
                List.of(
                    SipRequest.builder().username("a".repeat(101)).build()
                ),
                List.of("sip.username.size"),
                Map.of("max", 100)
            ),
            Arguments.of(
                "username",
                List.of(
                    SipRequest.builder().username("a".repeat(1)).build(),
                    SipRequest.builder().username("a".repeat(100)).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "password",
                List.of(
                    SipRequest.builder().build(),
                    SipRequest.builder().password("").build(),
                    SipRequest.builder().password("   ").build()
                ),
                List.of("sip.password.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "password",
                List.of(
                    SipRequest.builder().password("a".repeat(101)).build()
                ),
                List.of("sip.password.size"),
                Map.of("max", 100)
            ),
            Arguments.of(
                "password",
                List.of(
                    SipRequest.builder().password("a".repeat(1)).build(),
                    SipRequest.builder().password("a".repeat(100)).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "domain",
                List.of(
                    SipRequest.builder().build(),
                    SipRequest.builder().domain("").build(),
                    SipRequest.builder().domain("   ").build()
                ),
                List.of("sip.domain.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "domain",
                List.of(
                    SipRequest.builder().domain("a".repeat(201)).build()
                ),
                List.of("sip.domain.size"),
                Map.of("max", 200)
            ),
            Arguments.of(
                "domain",
                List.of(
                    SipRequest.builder().domain("a".repeat(1)).build(),
                    SipRequest.builder().domain("a".repeat(200)).build()
                ),
                List.of(),
                Map.of()
            ),
            Arguments.of(
                "proxy",
                List.of(
                    SipRequest.builder().build(),
                    SipRequest.builder().proxy("").build(),
                    SipRequest.builder().proxy("   ").build()
                ),
                List.of("sip.proxy.mandatory"),
                Map.of()
            ),
            Arguments.of(
                "proxy",
                List.of(
                    SipRequest.builder().proxy("a".repeat(201)).build()
                ),
                List.of("sip.proxy.size"),
                Map.of("max", 200)
            ),
            Arguments.of(
                "proxy",
                List.of(
                    SipRequest.builder().proxy("a".repeat(1)).build(),
                    SipRequest.builder().proxy("a".repeat(200)).build()
                ),
                List.of(),
                Map.of()
            )
        );
    }


}
