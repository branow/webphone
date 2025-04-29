package com.scisbo.webphone.log.core;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.slf4j.spi.LoggingEventBuilder;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import com.scisbo.webphone.log.id.LogIdProvider;


@SpringJUnitConfig
public class SpelLoggerTest {

    @MockitoBean
    private EvaluationContext context;

    @MockitoBean
    private LogIdProvider idProvider;

    @MockitoBean
    private SpelExpressionParser parser;


    @Test
    public void testLog() {
        var spel = "SpEL message";
        var level = Level.INFO;
        var message = "message to log";
        var id = "123";

        Expression expression = mock(Expression.class);

        when(this.parser.parseExpression(eq(spel), any(TemplateParserContext.class)))
            .thenReturn(expression);
        when(expression.getValue(this.context, String.class)).thenReturn(message);

        when(this.idProvider.getId()).thenReturn(id);

        try (MockedStatic<LoggerFactory> factory = mockStatic(LoggerFactory.class)) {
            Logger logger = mock(Logger.class);
            factory.when(() -> LoggerFactory.getLogger(getClass()))
                .thenReturn(logger);

            LoggingEventBuilder builder = mock(LoggingEventBuilder.class);
            when(logger.atLevel(level)).thenReturn(builder);

            new SpelLogger(getClass(), this.idProvider, this.context, this.parser).log(level, spel);

            verify(builder).log("[123] " + message);
        }

    }

    @Test
    public void testLog_withEmptyId() {
        var spel = "SpEL message";
        var level = Level.INFO;
        var message = "message to log";
        var id = "";

        Expression expression = mock(Expression.class);

        when(this.parser.parseExpression(eq(spel), any(TemplateParserContext.class)))
            .thenReturn(expression);
        when(expression.getValue(this.context, String.class)).thenReturn(message);

        when(this.idProvider.getId()).thenReturn(id);

        try (MockedStatic<LoggerFactory> factory = mockStatic(LoggerFactory.class)) {
            Logger logger = mock(Logger.class);
            factory.when(() -> LoggerFactory.getLogger(getClass()))
                .thenReturn(logger);

            LoggingEventBuilder builder = mock(LoggingEventBuilder.class);
            when(logger.atLevel(level)).thenReturn(builder);

            new SpelLogger(getClass(), this.idProvider, this.context, this.parser).log(level, spel);

            verify(builder).log(message);
        }

    }

}
