package com.scisbo.webphone.log.core;

import org.springframework.stereotype.Component;

import com.scisbo.webphone.log.config.LoggingConfiguration;

import org.springframework.core.convert.ConversionService;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.expression.spel.support.StandardTypeConverter;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import lombok.RequiredArgsConstructor;

/**
 * Factory for creating {@link SpelLogger} instances.
 */
@Component
@RequiredArgsConstructor
public class SpelLoggerFactory {

    private final LoggingConfiguration configuration;
    private final SpelExpressionParser spelExpressionParser;
    private final ConversionService conversionService;

    public SpelLogger getLogger(Class<?> clazz) {
        return getLogger(clazz, new SimpleSpelLoggerContext());
    }

    public SpelLogger getLogger(Class<?> clazz, SpelLoggerContext context) {
        StandardEvaluationContext sec = (StandardEvaluationContext) context.getEvaluationContext();
        sec.setTypeConverter(new StandardTypeConverter(this.conversionService));
        return new SpelLogger(
            clazz,
            sec,
            this.configuration,
            this.spelExpressionParser
        );
    }

}
