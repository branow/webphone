package com.scisbo.webphone.log.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.event.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.scisbo.webphone.log.core.SpelLogger;
import com.scisbo.webphone.log.core.SpelLoggerFactory;
import com.scisbo.webphone.log.id.DefaultLogIdProvider;

@SpringJUnitConfig({
    LoggingFilterTest.Controller.class,
    LoggingFilter.class
})
public class LoggingFilterTest {

    @MockitoBean
    private SpelLoggerFactory loggerFactory;

    @MockitoBean
    private SpelLogger logger;

    @Autowired
    private Controller controller;

    @Autowired
    private LoggingFilter filter;

    private MockMvc mockMvc;


    @BeforeEach
    public void setUp() {
        when(this.loggerFactory.getLogger(eq(LoggingFilter.class), any(DefaultLogIdProvider.class)))
            .thenReturn(this.logger);
        this.mockMvc = MockMvcBuilders
            .standaloneSetup(this.controller)
            .addFilter(this.filter)
            .build();
    }

    @Test
    public void testHello() throws Exception {
        this.mockMvc.perform(get("/api/1.0/hello").queryParam("q", "1"));
        verify(logger).log(Level.INFO, "Request: GET /api/1.0/hello?q=1");
        verify(logger).log(Level.INFO, "Response: 200");
    }

    @Test
    public void testError500() throws Exception {
        this.mockMvc.perform(get("/api/1.0/error/500"));
        verify(logger).log(Level.INFO, "Request: GET /api/1.0/error/500");
        verify(logger).log(Level.ERROR, "Response: 500 Error 500");
    }

    @Test
    public void testError400() throws Exception {
        this.mockMvc.perform(get("/api/1.0/error/400"));
        verify(logger).log(Level.INFO, "Request: GET /api/1.0/error/400");
        verify(logger).log(Level.WARN, "Response: 400 Error 400");
    }

    @Test
    public void testError404() throws Exception {
        this.mockMvc.perform(get("/api/1.0/error/404"));
        verify(logger).log(Level.INFO, "Request: GET /api/1.0/error/404");
        verify(logger).log(Level.WARN, "Response: 404 [empty]");
    }

    @RestController
    @RequestMapping("/api/1.0/")
    public static class Controller {

        @GetMapping("/hello")
        public String hello() {
            return "Hello World";
        }

        @GetMapping("/error/500")
        @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        public String error500() {
            return "Error 500";
        }

        @GetMapping("/error/400")
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public String error400() {
            return "Error 400";
        }

    }
}
