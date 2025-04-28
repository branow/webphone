package com.scisbo.webphone.log.core;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import com.scisbo.webphone.log.config.LoggingConfiguration;

/**
 * A logger that evaluates SpEL expressions for dynamic log messages.
 */
public class SpelLogger {

    private final Logger logger;
    private final EvaluationContext context;
    private final LoggingConfiguration configuration;
    private final SpelExpressionParser parser;


    public SpelLogger(
        Class<?> clazz,
        EvaluationContext context,
        LoggingConfiguration configuration,
        SpelExpressionParser parser
    ) {
        this.logger = LoggerFactory.getLogger(clazz);
        this.context = context;
        this.configuration = configuration;
        this.parser = parser;
    }

    /**
     * Log the given SpEL-based message a the specified log level.
     *
     * @param level The log level.
     * @param spel  The message template in SpEL sysntax.
     * */
    public void log(Level level, String spel) {
        String message = parseMessage(spel);
        String formattedMessage = format(message);
        this.logger.atLevel(level).log(formattedMessage);
    }

    private String format(String message) {
        String id = this.configuration.getLogIdProvider().getId();
        return Optional.of(id)
            .filter(id0 -> !id0.isEmpty())
            .map(id0 -> String.format("[%s] %s", id, message))
            .orElse(message);
    }

    private String parseMessage(String message) {
        Expression expression = this.parser.parseExpression(message, new TemplateParserContext());
        return expression.getValue(this.context, String.class);
    }

}
