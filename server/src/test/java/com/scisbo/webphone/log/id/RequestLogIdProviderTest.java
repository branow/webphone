package com.scisbo.webphone.log.id;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
    RequestLogIdProviderTest.TestController.class,
    RequestLogIdProviderTest.TestFilter.class,
})
public class RequestLogIdProviderTest {

    @Autowired
    private TestController controller;

    @Autowired
    private TestFilter filter;

    private MockMvc mvc;

    @BeforeEach
    public void setUp() {
        this.mvc = MockMvcBuilders
            .standaloneSetup(controller)
            .addFilter(filter)
            .build();
    }

    @Test
    public void test() throws Exception {
        this.mvc.perform(get("/home"));
        assertEquals(this.filter.idBefore, this.filter.idAfter);
        assertEquals(this.filter.idBefore, this.controller.id);
    }

    @RestController
    @RequiredArgsConstructor
    public static class TestController {

        private final LogIdProvider provider;

        public String id;

        @GetMapping("/home")
        public String home() {
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
