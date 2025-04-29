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
 * Core annotation for declarative logging at different method lifecycle points.
 *
 * The annotation enables templated log messages using Spring Expression Language (SpEL).
 * The available context variables depend on the trigger type:
 * <ul>
 *  <li>For {@code BEFORE}, {@code AFTER}, and {@code ERROR} triggers, 
 *  all method arguments are available by name.</li>
 *  <li>For {@code AFTER}, the special variable {@code result} contains the method's return value.</li>
 *  <li>For {@code ERROR}, the special variable {@code error} contains the thrown exception</li>
 * </ul>
 *
 * Example of usage:
 * <pre>
 * @Log(message = "Deleting user with ID=#{#id}", triggers = LogTrigger.BEFORE)
 * @Log(message = "Deleted user with ID=#{#id}", triggers = LogTrigger.AFTER)
 * @Log(message = "Failed to delete user with ID=#{#id}", triggers = LogTrigger.ERROR, level = Level.ERROR)
 * </pre>
 *
 * Alternatively, prefer using specific annotations {@link LogAfter}, {@link LogBefore}, {@link LogError}.
 */
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {

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

    /**
     * Triggers that defines when the log should be recorded.
     */
    LogTrigger[] triggers() default { LogTrigger.BEFORE, LogTrigger.AFTER, LogTrigger.ERROR };

    /**
     * Specified the {@link LogIdProvider} to use for generating a log identifier.
     * If set to {@link DefaultLogIdProvider}, the provider configured in the logging
     * configuration will be used.
     */
    Class<? extends LogIdProvider> id() default DefaultLogIdProvider.class;

}
