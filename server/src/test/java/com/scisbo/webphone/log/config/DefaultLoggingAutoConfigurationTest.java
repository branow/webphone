package com.scisbo.webphone.log.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.log.id.NoneLogIdProvider;
import com.scisbo.webphone.log.id.RequestLogIdProvider;

public class DefaultLoggingAutoConfigurationTest {

    @SpringJUnitConfig(DefaultLoggingAutoConfiguration.class)
    public static class DefaultTest {

        @Test
        public void testLoggingConfiguration(@Autowired LoggingConfiguration config) {
            assertEquals(NoneLogIdProvider.class, config.getLogIdProvider().getClass());
        }

        @Test
        public void testSpelExpressionParser(@Autowired SpelExpressionParser parser) {
            assertEquals(SpelExpressionParser.class, parser.getClass());
        }

    }

    @SpringJUnitConfig({ Config.class, DefaultLoggingAutoConfiguration.class })
    public static class CustomTest {

        @Test
        public void testLoggingConfiguration(@Autowired LoggingConfiguration config) {
            assertEquals(RequestLogIdProvider.class, config.getLogIdProvider().getClass());
        }

        @Test
        public void testSpelExpressionParser(@Autowired SpelExpressionParser parser) {
            assertEquals(CustomParser.class, parser.getClass());
        }

    }

    @Configuration
    public static class Config {

        @Bean
        public LoggingConfiguration bean1() {
            return LoggingConfiguration.builder()
                .logIdProvider(new RequestLogIdProvider())
                .build();
        }

        @Bean
        public SpelExpressionParser bean2() {
            return new CustomParser();
        }

    }

    public static class CustomParser extends SpelExpressionParser {}

}
