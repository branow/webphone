package com.scisbo.webphone.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@SpringJUnitConfig({
    SpaForwardingFilterTest.Controller.class,
    SpaForwardingFilter.class
})
@TestPropertySource(properties = "server.servlet.context-path=")
public class SpaForwardingFilterTest {

    @Autowired
    private Controller controller;

    @Autowired
    private SpaForwardingFilter filter;

    private MockMvc mvc;


    @BeforeEach
    public void setUp() {
        this.mvc = MockMvcBuilders
            .standaloneSetup(this.controller)
            .addFilter(this.filter)
            .build();
    }

    @ParameterizedTest(name = "[{index}] filter {0} : {1}")
    @MethodSource("provideTest")
    public void test(String uri, String response) throws Exception {
        var result = this.mvc
            .perform(get(uri))
            .andExpect(status().isOk());
        if (response != null) {
            result.andExpect(content().string(response));
        }
    }

    private static Stream<Arguments> provideTest() {
        return Stream.of(
            Arguments.of("/index.html", "file: /index.html"),
            Arguments.of("/assets/another.html", "file: /assets/another.html"),
            Arguments.of("/assets/js/script.js", "file: /assets/js/script.js"),
            Arguments.of("/dialpan", ""),
            Arguments.of("/call/active/1234", ""),
            Arguments.of("/api", "api: /api"),
            Arguments.of("/api/history/user/1234", "api: /api/history/user/1234")
        );
    }

    @RestController
    public static class Controller {

        @GetMapping("/api/**")
        public String api(HttpServletRequest req) {
            return "api: " + req.getRequestURI();
        }

        @GetMapping("/**")
        public String file(HttpServletRequest req) {
            return "file: " + req.getRequestURI();
        }

    }

}
