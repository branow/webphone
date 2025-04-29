package com.scisbo.webphone.log.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.slf4j.event.Level;
import org.springframework.core.annotation.AliasFor;

import com.scisbo.webphone.log.id.DefaultLogIdProvider;
import com.scisbo.webphone.log.id.LogIdProvider;

/**
 * Shortcut annotation for logging a message when a method execution fails.
 */
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogError {

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
    Level level() default Level.ERROR;

    /**
     * Specified the {@link LogIdProvider} to use for generating a log identifier.
     * If set to {@link DefaultLogIdProvider}, the provider configured in the logging
     * configuration will be used.
     */
    Class<? extends LogIdProvider> id() default DefaultLogIdProvider.class;

}
