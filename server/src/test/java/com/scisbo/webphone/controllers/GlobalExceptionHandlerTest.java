package com.scisbo.webphone.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.scisbo.webphone.common.web.RestUtils;
import com.scisbo.webphone.dtos.controller.response.ErrorResponse;
import com.scisbo.webphone.exceptions.EntityAlreadyExistsException;
import com.scisbo.webphone.exceptions.EntityNotFoundException;
import com.scisbo.webphone.exceptions.InvalidValueException;
import com.scisbo.webphone.exceptions.PhotoUploadException;
import com.scisbo.webphone.utils.validation.ValidationResultFormatter;

@SpringJUnitConfig({
    GlobalExceptionHandler.class,
    GlobalExceptionHandlerTest.TestController.class,
})
public class GlobalExceptionHandlerTest {

    @Autowired
    private TestController controller;

    @Autowired
    private GlobalExceptionHandler handler;

    @MockitoBean
    private ValidationResultFormatter validationResultFormatter;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(handler)
            .build();
    }

    @ParameterizedTest(name = "[{index}] Exception {0}")
    @MethodSource("provideTestHandle")
    public void testHandle(Exception e, HttpStatus status, ErrorResponse expected) throws Exception {
        when(validationResultFormatter.formatFieldErrors(any(List.class))).thenReturn(List.of());
        this.controller.setException(e);
        this.mockMvc.perform(get("/"))
                .andExpect(status().is(status.value()))
                .andExpect((result) -> {
                    var response = result.getResponse().getContentAsString();
                    var actual = RestUtils.fromJson(response, ErrorResponse.class);
                    expected.setTimestamp(actual.getTimestamp());
                    assertEquals(expected, actual);
                });
    }

    @RestController
    public static class TestController {

        private Exception exception;

        public void setException(Exception exception) {
            this.exception = exception;
        }

        @GetMapping
        public ResponseEntity<?> get() throws Exception {
            throw exception;
        }

    }

    // User as input method for some exceptions
    public void testMethod(String value) {}

    private static Stream<Arguments> provideTestHandle() throws Exception {
        return Stream.of(
            Arguments.of(
                new MissingPathVariableException(
                    "data", new MethodParameter(
                        GlobalExceptionHandlerTest.class.getMethod("testMethod", String.class),
                        0
                    )
                ),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.bad.request")
                    .message("Required URI template variable 'data' for method parameter type String is not present")
                    .build()
            ),
            Arguments.of(
                new MissingServletRequestParameterException("data", "String"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.bad.request")
                    .message("Required request parameter 'data' for method parameter type String is not present")
                    .build()
            ),
            Arguments.of(
                new MissingServletRequestPartException("message"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.bad.request")
                    .message("Required part 'message' is not present.")
                    .build()
            ),
            Arguments.of(
                new ServletRequestBindingException("ServletRequestBindingException message"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.bad.request")
                    .message("ServletRequestBindingException message")
                    .build()
            ),
            Arguments.of(
                new IllegalArgumentException("Invalid Argument"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.bad.request")
                    .message("Invalid Argument")
                    .build()
            ),
            Arguments.of(
                new HttpMessageNotReadableException("message", (HttpInputMessage) null),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.bad.request")
                    .message("message")
                    .build()
            ),
            Arguments.of(
                new InvalidValueException("name", "object"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.invalid.value")
                    .message("Invalid name: object")
                    .details(Map.of("name", "name", "value", "object"))
                    .build()
            ),
            Arguments.of(
                new PhotoUploadException("url", null),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.photo.upload")
                    .message("Failed to upload photo at url")
                    .details(Map.of("url", "url"))
                    .build()
            ),
            Arguments.of(
                new EntityAlreadyExistsException("entity", "field", "value"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.entity.already.exists")
                    .message("Entity entity with field 'value' already exists")
                    .details(Map.of("entity", "entity", "fieldName", "field", "fieldValue", "value"))
                    .build()
            ),
            Arguments.of(
                new EntityNotFoundException("entity", "field", "value"),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.entity.not.found")
                    .message("Entity entity not found by field 'value'")
                    .details(Map.of("entity", "entity", "fieldName", "field", "fieldValue", "value"))
                    .build()
            ),
            Arguments.of(
                new MethodArgumentNotValidException(
                    new MethodParameter(GlobalExceptionHandlerTest.class.getMethod("testMethod", String.class), 0),
                    getBindingResult(
                        "user",
                        Map.of(
                            "email", "Invalid email format",
                            "name", "Too short name"
                        )
                    )
                ),
                HttpStatus.BAD_REQUEST,
                ErrorResponse.builder()
                    .type("error.validation")
                    .message("Invalid email format; Too short name")
                    .details(List.of())
                    .build()
            ),
            Arguments.of(
                new AccessDeniedException("AccessDeniedException message"),
                HttpStatus.FORBIDDEN,
                ErrorResponse.builder()
                    .type("error.access.denied")
                    .message("AccessDeniedException message")
                    .build()
            ),
            Arguments.of(
                new NoHandlerFoundException("GET", "/home", new HttpHeaders()),
                HttpStatus.NOT_FOUND,
                ErrorResponse.builder()
                    .type("error.not.found")
                    .message("No endpoint GET /home.")
                    .build()
            ),
            Arguments.of(
                new HttpRequestMethodNotSupportedException("GET"),
                HttpStatus.METHOD_NOT_ALLOWED,
                ErrorResponse.builder()
                    .type("error.method.not.supported")
                    .message("Request method 'GET' is not supported")
                    .build()
            ),
            Arguments.of(
                new HttpMediaTypeNotAcceptableException("HttpMediaTypeNotAcceptableException message"),
                HttpStatus.NOT_ACCEPTABLE,
                ErrorResponse.builder()
                    .type("error.media.type.not.acceptable")
                    .message("HttpMediaTypeNotAcceptableException message")
                    .build()
            ),
            Arguments.of(
                new HttpMediaTypeNotSupportedException("HttpMediaTypeNotSupportedException message"),
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                ErrorResponse.builder()
                    .type("error.media.type.not.supported")
                    .message("HttpMediaTypeNotSupportedException message")
                    .build()
            ),
            Arguments.of(
                new Exception("Unknown exception"),
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorResponse.builder()
                    .type("error.server")
                    .message("An unexpected error occurred")
                    .build()
            )
        );
    }

    private static BindingResult getBindingResult(String objectName, Map<String, String> fieldErrors) {
        BindingResult bindingResult = new BeanPropertyBindingResult(null, objectName);
        for (Map.Entry<String, String> entry : fieldErrors.entrySet()) {
            bindingResult.addError(new FieldError(objectName, entry.getKey(), entry.getValue()));
        }
        return bindingResult;
    }

}
