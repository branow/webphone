package com.scisbo.webphone.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;

import com.scisbo.webphone.convert.PageToStringConverter;
import com.scisbo.webphone.convert.PageableToStringConverter;
import com.scisbo.webphone.log.config.LoggingConfiguration;
import com.scisbo.webphone.log.id.RequestLogIdProvider;

@Configuration
public class LoggingConfig {

    @Bean
    public LoggingConfiguration loggingConfiguration(RequestLogIdProvider provider) {
        return LoggingConfiguration.builder()
            .logIdProvider(provider)
            .build();
    }

    @Bean
    public ConversionService conversionService(
        PageToStringConverter page,
        PageableToStringConverter pageable
    ) {
        DefaultConversionService service = new DefaultConversionService();
        service.addConverter(page);
        service.addConverter(pageable);
        return service;
    }

}
