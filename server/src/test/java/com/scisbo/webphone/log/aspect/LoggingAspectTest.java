package com.scisbo.webphone.log.aspect;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.slf4j.spi.LoggingEventBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.log.annotation.Log;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.annotation.LogTrigger;
import com.scisbo.webphone.log.config.DefaultLoggingAutoConfiguration;
import com.scisbo.webphone.log.core.SpelLoggerFactory;
import com.scisbo.webphone.log.id.DefaultLogIdProvider;
import com.scisbo.webphone.log.id.LogIdProvider;
import com.scisbo.webphone.log.id.LogIdProviders;
import com.scisbo.webphone.log.id.NoneLogIdProvider;

@SpringJUnitConfig({
    LoggingAspect.class,
    LoggingAspectTest.Config.class,
    DefaultLoggingAutoConfiguration.class,
    SpelLoggerFactory.class,
    LogIdProviders.class,
    DefaultLogIdProvider.class,
})
public class LoggingAspectTest {

    @MockitoBean
    private NoneLogIdProvider idProvider;

    @MockitoBean
    private CustomLogIdProvider customIdProvider;

    @Autowired
    private Math math;

    private MockedStatic<LoggerFactory> factory;
    private Logger logger;
    private LoggingEventBuilder builder;

    @BeforeEach
    public void setUp() {
        this.logger = mock(Logger.class);
        this.builder = mock(LoggingEventBuilder.class);
        this.factory = mockStatic(LoggerFactory.class);
        this.factory.when(() -> LoggerFactory.getLogger(Math.class)).thenReturn(this.logger);
    }

    @AfterEach
    public void cleanUp() {
        this.factory.close();
    }

    @Test
    public void test_divide1() {
        when(this.logger.atLevel(Level.INFO)).thenReturn(this.builder);
        when(this.idProvider.getId()).thenReturn("123");

        assertEquals(3, this.math.divide1(6, 2));
        verify(this.builder, times(2)).log("[123] dividing 6 / 2");
    }

    @Test
    public void test_divide2() {
        when(this.logger.atLevel(Level.DEBUG)).thenReturn(this.builder);
        when(this.idProvider.getId()).thenReturn("");

        assertEquals(3, this.math.divide2(6, 2));
        verify(this.builder).log("dividing 6 / 2 = 3");
    }

    @Test
    public void test_divide3() {
        when(this.logger.atLevel(Level.TRACE)).thenReturn(this.builder);
        when(this.idProvider.getId()).thenReturn("");

        assertEquals(3, this.math.divide3(6, 2));
        verify(this.builder).log("dividing 6 / 2");
    }

    @Test
    public void test_divide4() {
        when(this.logger.atLevel(Level.INFO)).thenReturn(this.builder);
        when(this.customIdProvider.getId()).thenReturn("321");

        assertEquals(3, this.math.divide4(6, 2));
        verify(this.builder).log("[321] dividing 6 / 2 = 3");
    }

    @Test
    public void test_divide5() {
        when(this.logger.atLevel(Level.ERROR)).thenReturn(this.builder);
        when(this.idProvider.getId()).thenReturn("123");

        assertThrows(ArithmeticException.class, () -> this.math.divide5(6, 0));
        verify(this.builder).log("[123] dividing 6 / 0: [java.lang.ArithmeticException: / by zero]");
    }

    @TestConfiguration
    @EnableAspectJAutoProxy
    public static class Config {
        @Bean
        public Math math() {
            return new Math();
        }
    }

    public static class Math {

        @Log("dividing #{#a} / #{#b}")
        public int divide1(int a, int b) {
            return a / b;
        }

        @Log(message = "dividing #{#a} / #{#b} = #{#result}", triggers = { LogTrigger.AFTER }, level = Level.DEBUG)
        public int divide2(int a, int b) {
            return a / b;
        }

        @LogBefore(value = "dividing #{#a} / #{#b}", level = Level.TRACE)
        public int divide3(int a, int b) {
            return a / b;
        }

        @LogAfter(message = "dividing #{#a} / #{#b} = #{#result}", id = CustomLogIdProvider.class)
        public int divide4(int a, int b) {
            return a / b;
        }
        
        @LogError("dividing #{#a} / #{#b}: [#{#error}]")
        public int divide5(int a, int b) {
            return a / b;
        }

    }

    public interface CustomLogIdProvider extends LogIdProvider {}

}
