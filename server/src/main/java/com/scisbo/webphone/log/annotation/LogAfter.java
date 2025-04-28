package com.scisbo.webphone.log.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.slf4j.event.Level;
import org.springframework.core.annotation.AliasFor;

/**
 * Shortcut annotation for logging a message after successful method execution.
 */
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogAfter {

    /**
     * SpEL expression for the log message.
     * Alias for {@link #message()}
     */
    @AliasFor("message")
    String value() default "";

    /**
     * SpEL expression for the log message.
     * Alias for {@link #value()}
     */
    @AliasFor("value")
    String message() default "";

    /**
     * Log level at which the message should be written.
     */
    Level level() default Level.INFO;

}
