package com.scisbo.webphone.log.aspect;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import com.scisbo.webphone.log.annotation.Log;
import com.scisbo.webphone.log.annotation.LogAfter;
import com.scisbo.webphone.log.annotation.LogBefore;
import com.scisbo.webphone.log.annotation.LogError;
import com.scisbo.webphone.log.annotation.LogTrigger;
import com.scisbo.webphone.log.core.SimpleSpelLoggerContext;
import com.scisbo.webphone.log.core.SpelLogger;
import com.scisbo.webphone.log.core.SpelLoggerContext;
import com.scisbo.webphone.log.core.SpelLoggerFactory;

import lombok.RequiredArgsConstructor;

/**
 * Aspect for handling method-level declarative logging
 * based on the {@link Log} annotation.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class LoggingAspect {

    private final SpelLoggerFactory factory;


    @Around("@annotation(log)")
    public Object logExecution(ProceedingJoinPoint point, Log log) throws Throwable {
        return logAllExecution(point, LogDto.build(log));
    }

    @Around("@annotation(logBefore)")
    public Object logBeforeExecution(ProceedingJoinPoint point, LogBefore logBefore) throws Throwable {
        return logAllExecution(point, LogDto.build(logBefore));
    }

    @Around("@annotation(logAfter)")
    public Object logAfterExecution(ProceedingJoinPoint point, LogAfter logAfter) throws Throwable {
        return logAllExecution(point, LogDto.build(logAfter));
    }

    @Around("@annotation(logError)")
    public Object logErrorExecution(ProceedingJoinPoint point, LogError logError) throws Throwable {
        return logAllExecution(point, LogDto.build(logError));
    }

    public Object logAllExecution(ProceedingJoinPoint point, LogDto log) throws Throwable {
        Class<?> targetClass = point.getTarget().getClass();
        SpelLoggerContext ctx = new SimpleSpelLoggerContext();
        ctx.setArguments(parseArguments(point));
        SpelLogger logger = factory.getLogger(targetClass, ctx);

        if (log.isTriggered(LogTrigger.BEFORE)) {
            logger.log(log.getLevel(), log.getMessage());
        }

        Object result;
        try {
            result = point.proceed();
        } catch (Exception ex) {
            ctx.setError(ex);
            if (log.isTriggered(LogTrigger.ERROR)) {
                logger.log(log.getLevel(), log.getMessage());
            }
            throw ex;
        }

        ctx.setResult(result);
        if (log.isTriggered(LogTrigger.AFTER)) {
            logger.log(log.getLevel(), log.getMessage());
        }

        return result;
    }

    private Map<String, Object> parseArguments(ProceedingJoinPoint point) {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Object[] args = point.getArgs();
        String[] argsNames = signature.getParameterNames();

        if (args.length != argsNames.length) {
            throw new IllegalStateException("Mismatch between arguments names and values: " 
                + Arrays.toString(argsNames) + " <=> " + Arrays.toString(args));
        }

        Map<String, Object> params = new HashMap<>();
        for (int i = 0; i < args.length; i++) {
            params.put(argsNames[i], args[i]);
        }
        return params;
    }

}
