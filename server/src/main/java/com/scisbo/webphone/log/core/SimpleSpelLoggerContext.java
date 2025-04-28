package com.scisbo.webphone.log.core;

import java.util.Map;

import org.springframework.expression.EvaluationContext;
import org.springframework.expression.spel.support.StandardEvaluationContext;

/**
 * Default implementation of {@link SpelLoggerContext}
 * using a standard Spring {@link EvaluationContext}.
 */
public class SimpleSpelLoggerContext implements SpelLoggerContext {

    private final EvaluationContext ctx = new StandardEvaluationContext();


    @Override
    public EvaluationContext getEvaluationContext() {
        return ctx;
    }

    @Override
    public void setArguments(Map<String, Object> arguments) {
        for (Map.Entry<String, Object> arg: arguments.entrySet()) {
            ctx.setVariable(arg.getKey(), arg.getValue());
        }
    }

    @Override
    public void setResult(Object result) {
        ctx.setVariable("result", result);
    }

    @Override
    public void setError(Exception exception) {
        ctx.setVariable("error", exception);
    }

}
