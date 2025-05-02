package com.scisbo.webphone.log.core;

import org.springframework.core.convert.ConversionService;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.expression.spel.support.StandardTypeConverter;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.log.config.LoggingConfiguration;
import com.scisbo.webphone.log.id.DefaultLogIdProvider;
import com.scisbo.webphone.log.id.LogIdProvider;

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
        return getLogger(clazz, new SimpleSpelLoggerContext(), new DefaultLogIdProvider());
    }

    public SpelLogger getLogger(Class<?> clazz, LogIdProvider idProvider) {
        return getLogger(clazz, new SimpleSpelLoggerContext(), idProvider);
    }

    public SpelLogger getLogger(Class<?> clazz, SpelLoggerContext context, LogIdProvider idProvider) {
        if (idProvider instanceof DefaultLogIdProvider) {
            idProvider = configuration.getLogIdProvider();
        }

        StandardEvaluationContext sec = (StandardEvaluationContext) context.getEvaluationContext();
        sec.setTypeConverter(new StandardTypeConverter(this.conversionService));

        return new SpelLogger(
            clazz,
            idProvider,
            sec,
            this.spelExpressionParser
        );
    }

}
