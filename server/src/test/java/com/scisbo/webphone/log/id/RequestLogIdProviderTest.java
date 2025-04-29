package com.scisbo.webphone.log.id;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.stereotype.Component;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import lombok.RequiredArgsConstructor;

@SpringJUnitConfig({
    RequestLogIdProvider.class,
    RequestLogIdProviderTest.Config.class,
})
public class RequestLogIdProviderTest {

    @Autowired
    private Config.TestController controller;

    @Autowired
    private Config.TestFilter filter;

    private MockMvc mvc;


    @BeforeEach
    public void setUp() {
        this.mvc = MockMvcBuilders
            .standaloneSetup(this.controller)
            .addFilter(this.filter)
            .build();
    }

    @Test
    public void test() throws Exception {
        this.mvc.perform(get("/home"));
        assertEquals(this.filter.idBefore, this.filter.idAfter);
        assertEquals(this.filter.idBefore, this.controller.id);
    }

    @TestConfiguration
    public static class Config {

        @RestController
        @RequiredArgsConstructor
        public static class TestController {

            private final LogIdProvider provider;

            public String id;

            @GetMapping("/home")
            public String home() {
                System.out.println("################### Controller ");
                this.id = this.provider.getId();
                return "home";
            }

        }

        @Component
        @RequiredArgsConstructor
        public static class TestFilter implements Filter {

            private final LogIdProvider provider;

            public String idBefore;
            public String idAfter;

            @Override
            public void doFilter(
                ServletRequest request,
                ServletResponse response,
                FilterChain chain
            ) throws IOException, ServletException {
                this.idBefore = this.provider.getId();
                chain.doFilter(request, response);
                this.idAfter = this.provider.getId();
            }

        }

    }

}
