package com.scisbo.webphone.log.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.filter.OrderedRequestContextFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import com.scisbo.webphone.log.core.SpelLoggerFactory;
import com.scisbo.webphone.log.id.NoneLogIdProvider;
import com.scisbo.webphone.log.web.LoggingFilter;

/**
 * Default logging configuration that is applied
 * if the user does not explicitly provide their own {@link LoggingConfiguration}
 */
@Configuration
public class DefaultLoggingAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(LoggingConfiguration.class)
    public LoggingConfiguration loggingConfiguration(NoneLogIdProvider idProvider) {
        return LoggingConfiguration.builder()
            .logIdProvider(idProvider)
            .build();
    }

    @Bean
    @ConditionalOnMissingBean(SpelExpressionParser.class)
    public SpelExpressionParser spelExpressionParser() {
        return new SpelExpressionParser();
    }

    @Bean
    @ConditionalOnMissingBean(ConversionService.class)
    public ConversionService conversionService() {
        return new DefaultConversionService();
    }

    @Bean
    @ConditionalOnProperty(
        name = "log.filter.enabled",
        havingValue = "true",
        matchIfMissing = true
    )
    public FilterRegistrationBean<LoggingFilter> loggingFilterRegistration(SpelLoggerFactory factory) {
        FilterRegistrationBean<LoggingFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new LoggingFilter(factory));
        bean.setOrder(OrderedRequestContextFilter.REQUEST_WRAPPER_FILTER_MAX_ORDER - 100);
        return bean;
    }

}
