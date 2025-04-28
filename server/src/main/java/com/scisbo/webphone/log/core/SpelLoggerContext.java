package com.scisbo.webphone.log.core;

import java.util.Map;

import org.springframework.expression.EvaluationContext;

/**
 * Context interface for managing variables available during
 * SpEL expression evaluation for logging.
 */
public interface SpelLoggerContext {

    EvaluationContext getEvaluationContext();

    void setArguments(Map<String, Object> arguments);

    void setResult(Object result);

    void setError(Exception exception);

}
